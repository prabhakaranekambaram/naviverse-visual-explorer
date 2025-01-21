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

    // Create Python script content
    const pythonScript = `
import pandas as pd
import json

# Load files into dataframes
dataframes = {}
for file_info in json.loads('${JSON.stringify(files)}'):
    file_path = file_info['file_path']
    file_name = file_info['file_name']
    df_name = file_name.split('.')[0]
    
    if file_path.endswith('.csv'):
        dataframes[df_name] = pd.read_csv(file_path)
    else:
        dataframes[df_name] = pd.read_excel(file_path)

# Your preprocessing logic here
# Example: Print basic statistics for each dataframe
results = {}
for name, df in dataframes.items():
    results[name] = {
        'shape': df.shape,
        'columns': list(df.columns),
        'summary': df.describe().to_dict()
    }

print(json.dumps(results))
`

    // Save Python script to storage
    const { error: uploadError } = await supabase.storage
      .from('well_data')
      .upload('preprocess.py', new Blob([pythonScript], { type: 'text/plain' }), {
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Failed to upload Python script: ${uploadError.message}`)
    }

    // Execute Python script (mock execution for now)
    const results = {
      message: 'Preprocessing completed',
      scriptPath: 'preprocess.py',
      filesProcessed: files.length
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in preprocessing:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})