import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface DataProcessorProps {
  selectedFile: string | null
  file: File | undefined
  isProcessing: boolean
  onProcessingChange: (processing: boolean) => void
}

export function DataProcessor({ selectedFile, file, isProcessing, onProcessingChange }: DataProcessorProps) {
  const { toast } = useToast()

  const handlePreprocessData = async () => {
    if (!selectedFile || !file) {
      toast({
        title: "No file selected",
        description: "Please select a file to preprocess.",
        variant: "destructive"
      })
      return
    }

    onProcessingChange(true)

    try {
      const fileExt = file.name.split('.').pop()
      const tempFilePath = `temp/${crypto.randomUUID()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('well_data')
        .upload(tempFilePath, file)

      if (uploadError) throw uploadError

      const { data: result, error } = await supabase.functions.invoke('preprocess', {
        body: { 
          files: [{
            project_name: 'default',
            file_name: file.name,
            file_path: tempFilePath,
            file_type: file.type,
            file_size: file.size,
            well_name: null
          }]
        }
      })

      if (error) throw error

      if (!result.success) {
        throw new Error(result.error || 'Preprocessing failed')
      }

      toast({
        title: "Success",
        description: "File preprocessing completed successfully.",
      })

    } catch (error) {
      console.error('Error preprocessing data:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to preprocess file",
        variant: "destructive"
      })

      try {
        const fileExt = selectedFile.split('.').pop()
        const tempFilePath = `temp/${crypto.randomUUID()}.${fileExt}`
        await supabase.storage
          .from('well_data')
          .remove([tempFilePath])
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError)
      }
    } finally {
      onProcessingChange(false)
    }
  }

  return (
    <div className="flex justify-end mt-4">
      <Button 
        onClick={handlePreprocessData}
        disabled={isProcessing}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isProcessing ? "Processing..." : "Preprocess Data"}
      </Button>
    </div>
  )
}