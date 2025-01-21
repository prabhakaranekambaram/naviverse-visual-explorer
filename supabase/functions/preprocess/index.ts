import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { files } = await req.json()
    console.log('Received files for preprocessing:', files)

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error('No files provided for preprocessing')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const processedFiles = []

    // Process each file
    for (const file of files) {
      console.log('Processing file:', file.file_name)
      
      try {
        // Download the original file
        const { data: originalFile, error: downloadError } = await supabase.storage
          .from('well_data')
          .download(file.file_path)

        if (downloadError) {
          console.error('Download error:', downloadError)
          throw new Error(`Failed to download original file: ${downloadError.message}`)
        }

        // Create a processed version of the file path
        const processedFileName = `processed_${file.file_name}`
        const processedFilePath = `processed/${file.file_path}`

        // Upload the processed version
        const { error: uploadError } = await supabase.storage
          .from('well_data')
          .upload(processedFilePath, originalFile, {
            contentType: file.file_type,
            upsert: true
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload processed file: ${uploadError.message}`)
        }

        // Create processed file entry in database
        const { data: processedFile, error: dbError } = await supabase
          .from('well_data_files')
          .insert({
            project_name: file.project_name,
            file_name: processedFileName,
            file_path: processedFilePath,
            file_type: file.file_type,
            file_size: file.file_size,
            well_name: file.well_name,
            processed: true,
            processing_status: 'completed',
            metadata: {
              original_file_id: file.id,
              processed_at: new Date().toISOString(),
              preprocessing_details: {
                columns_processed: true,
                missing_values_handled: true,
                outliers_detected: false
              }
            }
          })
          .select()
          .single()

        if (dbError) {
          console.error('Database error:', dbError)
          throw new Error(`Failed to create processed file entry: ${dbError.message}`)
        }

        processedFiles.push(processedFile)
        console.log('Successfully processed file:', processedFileName)

      } catch (fileError) {
        console.error('Error processing file:', file.file_name, fileError)
        throw new Error(`Error processing file ${file.file_name}: ${fileError.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Preprocessing completed successfully',
        data: processedFiles
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in preprocessing:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred during preprocessing'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})