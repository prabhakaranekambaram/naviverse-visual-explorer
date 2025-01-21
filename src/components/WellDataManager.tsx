import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WellDataFile {
  id: string
  project_name: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  well_name: string | null
  uploaded_at: string
  processed: boolean
  processing_status: string | null
}

export function WellDataManager({ projectName }: { projectName: string }) {
  const [files, setFiles] = useState<WellDataFile[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchWellData()
  }, [projectName])

  const fetchWellData = async () => {
    try {
      const { data, error } = await supabase
        .from('well_data_files')
        .select('*')
        .eq('project_name', projectName)
        .order('uploaded_at', { ascending: false })

      if (error) throw error

      setFiles(data)
    } catch (error) {
      console.error('Error fetching well data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch well data files",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('well_data')
        .download(filePath)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "File downloaded successfully"
      })
    } catch (error) {
      console.error('Error downloading file:', error)
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      })
    }
  }

  const deleteFile = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('well_data')
        .remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('well_data_files')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      setFiles(files.filter(file => file.id !== id))
      toast({
        title: "Success",
        description: "File deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      })
    }
  }

  const FileTable = ({ files }: { files: WellDataFile[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Well Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                {file.file_name}
              </TableCell>
              <TableCell>{file.well_name || '-'}</TableCell>
              <TableCell>{file.file_type}</TableCell>
              <TableCell>{(file.file_size / 1024).toFixed(2)} KB</TableCell>
              <TableCell>
                <Badge variant={file.processed ? "success" : "secondary"}>
                  {file.processing_status || (file.processed ? 'Processed' : 'Pending')}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(file.uploaded_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadFile(file.file_path, file.file_name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFile(file.id, file.file_path)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (loading) {
    return <div>Loading well data...</div>
  }

  const originalFiles = files.filter(file => !file.processed)
  const processedFiles = files.filter(file => file.processed)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Well Data Files</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="original" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="original">Original Files ({originalFiles.length})</TabsTrigger>
            <TabsTrigger value="processed">Processed Files ({processedFiles.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="original">
            {originalFiles.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No original files found
              </div>
            ) : (
              <FileTable files={originalFiles} />
            )}
          </TabsContent>
          <TabsContent value="processed">
            {processedFiles.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No processed files found
              </div>
            ) : (
              <FileTable files={processedFiles} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}