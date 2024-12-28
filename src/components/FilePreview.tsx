import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as XLSX from 'xlsx'

interface FilePreviewProps {
  file: File;
}

export function FilePreview({ file }: FilePreviewProps) {
  const [data, setData] = React.useState<any[]>([])
  const [headers, setHeaders] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const readFile = async () => {
      try {
        const fileContent = await file.arrayBuffer()
        if (file.name.endsWith('.csv')) {
          const text = new TextDecoder().decode(fileContent)
          const rows = text.split('\n').map(row => row.split(','))
          setHeaders(rows[0])
          setData(rows.slice(1).filter(row => row.some(cell => cell.trim())))
        } else {
          const workbook = XLSX.read(fileContent)
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
          setHeaders(jsonData[0] as string[])
          setData(jsonData.slice(1))
        }
      } catch (error) {
        console.error('Error reading file:', error)
      } finally {
        setLoading(false)
      }
    }

    readFile()
  }, [file])

  if (loading) {
    return <div className="p-4">Loading preview...</div>
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 100).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.isArray(row) ? 
                    row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    )) :
                    headers.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>{(row as any)[header]}</TableCell>
                    ))
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}