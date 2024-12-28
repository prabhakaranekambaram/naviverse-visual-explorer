import { useState, useCallback } from "react"
import { Upload as UploadIcon, File, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FilePreview } from "./FilePreview"

export function Upload() {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const validateFile = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload only CSV or Excel files"
      })
      return false
    }
    return true
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(validateFile)
    setFiles(prev => [...prev, ...validFiles])
  }, [toast])

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter(validateFile)
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [toast])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    // Simulated upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress(progress)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${files.length} file(s)`
    })
    
    setFiles([])
    setUploadProgress(0)
  }

  return (
    <div className="p-4 space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary/80">
            Click to upload
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={onFileSelect}
          />
          <p className="mt-1 text-sm text-gray-500">or drag and drop</p>
          <p className="text-xs text-gray-500">CSV or Excel files</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div key={index}>
              <Alert className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <AlertDescription>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Alert>
              <FilePreview file={file} />
            </div>
          ))}
          
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="w-full" />
          )}
          
          <Button
            className="w-full"
            onClick={uploadFiles}
            disabled={uploadProgress > 0}
          >
            Upload {files.length} file{files.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  )
}