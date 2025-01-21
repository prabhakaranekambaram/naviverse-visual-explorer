import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import * as XLSX from 'xlsx'
import { supabase } from "@/integrations/supabase/client"

interface FilePreviewProps {
  file: File;
  onSave: (file: File) => void;
  onCancel: () => void;
}

export function FilePreview({ file, onSave, onCancel }: FilePreviewProps) {
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
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
        toast({
          title: "Error",
          description: "Failed to read file content",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    readFile()
  }, [file])

  const handlePreprocess = async () => {
    try {
      toast({
        title: "Processing",
        description: "Starting file preprocessing...",
      })

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/preprocess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          files: [{
            file_name: file.name,
            file_path: file.name,
            file_type: file.type,
            file_size: file.size
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to preprocess file')
      }

      const result = await response.json()
      console.log('Preprocessing result:', result)

      toast({
        title: "Success",
        description: "File preprocessing completed successfully",
      })
    } catch (error) {
      console.error('Error preprocessing file:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to preprocess file",
        variant: "destructive"
      })
    }
  }

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
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handlePreprocess}>
            Preprocess
          </Button>
          <Button onClick={() => onSave(file)}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}