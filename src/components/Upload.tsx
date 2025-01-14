import { useState, useCallback } from "react"
import { Upload as UploadIcon, File, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FilePreview } from "./FilePreview"

interface UploadProps {
  onSaveFiles?: (files: File[]) => void;
  projectName: string;
}

export function Upload({ onSaveFiles, projectName }: UploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [savedFiles, setSavedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const isDefaultProject = projectName === "Project"

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDefaultProject) {
      setDragActive(true)
    }
  }, [isDefaultProject])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const validateFile = (file: File) => {
    if (isDefaultProject) {
      toast({
        variant: "destructive",
        title: "No project selected",
        description: "Please select a project before uploading files"
      })
      return false
    }

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

    if (isDefaultProject) {
      toast({
        variant: "destructive",
        title: "No project selected",
        description: "Please select a project before uploading files"
      })
      return
    }

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(validateFile)
    setFiles(prev => [...prev, ...validFiles])
  }, [toast, isDefaultProject])

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDefaultProject) {
      toast({
        variant: "destructive",
        title: "No project selected",
        description: "Please select a project before uploading files"
      })
      return
    }

    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter(validateFile)
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [toast, isDefaultProject])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveFile = async (file: File) => {
    try {
      // Save file locally
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSavedFiles(prev => {
        const newSavedFiles = [...prev, file]
        onSaveFiles?.(newSavedFiles)
        return newSavedFiles
      })
      setFiles(prev => prev.filter(f => f !== file))
      
      toast({
        title: "File Saved",
        description: `${file.name} has been saved successfully`
      })
    } catch (error) {
      console.error('Error saving file:', error)
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive"
      })
    }
  }

  const handleCancelFile = () => {
    setFiles([])
    toast({
      title: "Upload Cancelled",
      description: "File upload has been cancelled"
    })
  }

  const uploadFiles = async () => {
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
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
          dragActive ? 'border-primary bg-primary/10' : 
          isDefaultProject ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <UploadIcon className={`mx-auto h-12 w-12 ${isDefaultProject ? 'text-gray-300' : 'text-gray-400'}`} />
        <div className="mt-4">
          <label 
            htmlFor="file-upload" 
            className={`cursor-pointer ${isDefaultProject ? 'text-gray-400' : 'text-primary hover:text-primary/80'}`}
          >
            {isDefaultProject ? 'Select a project to upload' : 'Click to upload'}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={onFileSelect}
            disabled={isDefaultProject}
          />
          {!isDefaultProject && (
            <>
              <p className="mt-1 text-sm text-gray-500">or drag and drop</p>
              <p className="text-xs text-gray-500">CSV or Excel files</p>
            </>
          )}
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
              <FilePreview 
                file={file} 
                onSave={handleSaveFile}
                onCancel={() => removeFile(index)}
              />
            </div>
          ))}
          
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="w-full" />
          )}
        </div>
      )}

      {savedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Saved Files</h3>
          <div className="space-y-2">
            {savedFiles.map((file, index) => (
              <Alert key={index}>
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <AlertDescription>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}