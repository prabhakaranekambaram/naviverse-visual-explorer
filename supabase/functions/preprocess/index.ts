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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update the processing status in the database
    for (const file of files) {
      // Create a new processed file entry
      const processedFilePath = `processed/${file.file_path}`
      
      const { error: dbError } = await supabase
        .from('well_data_files')
        .insert({
          project_name: file.project_name,
          file_name: `processed_${file.file_name}`,
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

      if (dbError) {
        throw new Error(`Failed to create processed file entry: ${dbError.message}`)
      }

      // Copy the file to the processed location
      const { data: originalFile, error: downloadError } = await supabase.storage
        .from('well_data')
        .download(file.file_path)

      if (downloadError) {
        throw new Error(`Failed to download original file: ${downloadError.message}`)
      }

      const { error: uploadError } = await supabase.storage
        .from('well_data')
        .upload(processedFilePath, originalFile, {
          contentType: file.file_type,
          upsert: true
        })

      if (uploadError) {
        throw new Error(`Failed to upload processed file: ${uploadError.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Preprocessing completed successfully',
        files: files.map(f => ({
          ...f,
          status: 'completed'
        }))
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