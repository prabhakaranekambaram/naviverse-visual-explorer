import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as XLSX from 'xlsx'
import { FileSelector } from './data-viewer/FileSelector'
import { ColumnSelector } from './data-viewer/ColumnSelector'
import { ChartDisplay } from './data-viewer/ChartDisplay'
import { DataProcessor } from './data-viewer/DataProcessor'

interface DataViewerProps {
  files: File[]
}

export function DataViewer({ files }: DataViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [columns, setColumns] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<{ x: string; y: string }>({ x: '', y: '' })
  const [data, setData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0].name)
    }
  }, [files])

  useEffect(() => {
    const loadFileData = async () => {
      const file = files.find(f => f.name === selectedFile)
      if (!file) return

      try {
        const fileContent = await file.arrayBuffer()
        let parsedData: any[] = []
        let headers: string[] = []

        if (file.name.endsWith('.csv')) {
          const text = new TextDecoder().decode(fileContent)
          const rows = text.split('\n').map(row => row.split(','))
          headers = rows[0]
          parsedData = rows.slice(1).map(row => {
            const obj: any = {}
            row.forEach((value, index) => {
              obj[headers[index]] = isNaN(Number(value)) ? value : Number(value)
            })
            return obj
          })
        } else {
          const workbook = XLSX.read(fileContent)
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
          headers = jsonData[0] as string[]
          parsedData = jsonData.slice(1).map(row => {
            const obj: any = {}
            ;(row as any[]).forEach((value, index) => {
              obj[headers[index]] = value
            })
            return obj
          })
        }

        setColumns(headers)
        setData(parsedData)
        if (headers.length >= 2) {
          setSelectedColumns({ x: headers[0], y: headers[1] })
        }
      } catch (error) {
        console.error('Error reading file:', error)
      }
    }

    loadFileData()
  }, [selectedFile, files])

  if (files.length === 0) {
    return (
      <Card className="m-4">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No files uploaded yet. Please upload files to view data visualizations.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileSelector 
              files={files}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />
            <ColumnSelector
              columns={columns}
              selectedColumn={selectedColumns.x}
              onColumnSelect={(value) => setSelectedColumns(prev => ({ ...prev, x: value }))}
              label="X axis"
            />
            <ColumnSelector
              columns={columns}
              selectedColumn={selectedColumns.y}
              onColumnSelect={(value) => setSelectedColumns(prev => ({ ...prev, y: value }))}
              label="Y axis"
            />
          </div>

          <ChartDisplay 
            data={data}
            xAxis={selectedColumns.x}
            yAxis={selectedColumns.y}
          />

          <DataProcessor
            selectedFile={selectedFile}
            file={files.find(f => f.name === selectedFile)}
            isProcessing={isProcessing}
            onProcessingChange={setIsProcessing}
          />
        </CardContent>
      </Card>
    </div>
  )
}