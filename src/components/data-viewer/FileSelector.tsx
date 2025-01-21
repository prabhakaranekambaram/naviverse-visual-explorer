import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FileSelectorProps {
  files: File[]
  selectedFile: string
  onFileSelect: (fileName: string) => void
}

export function FileSelector({ files, selectedFile, onFileSelect }: FileSelectorProps) {
  return (
    <Select value={selectedFile} onValueChange={onFileSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select file" />
      </SelectTrigger>
      <SelectContent>
        {files.map((file) => (
          <SelectItem key={file.name} value={file.name}>
            {file.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}