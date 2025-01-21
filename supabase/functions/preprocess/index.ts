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
      const { error: updateError } = await supabase
        .from('well_data_files')
        .update({ 
          processing_status: 'processing',
          processed: false 
        })
        .eq('file_path', file.file_path)

      if (updateError) {
        throw new Error(`Failed to update processing status: ${updateError.message}`)
      }
    }

    // Simulate processing (we'll implement actual processing later)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update the status to completed
    for (const file of files) {
      const { error: completeError } = await supabase
        .from('well_data_files')
        .update({ 
          processing_status: 'completed',
          processed: true,
          metadata: {
            processed_at: new Date().toISOString(),
            status: 'success'
          }
        })
        .eq('file_path', file.file_path)

      if (completeError) {
        throw new Error(`Failed to complete processing: ${completeError.message}`)
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