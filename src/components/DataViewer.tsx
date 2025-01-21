import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import * as XLSX from 'xlsx';

interface DataViewerProps {
  files: File[];
}

export function DataViewer({ files }: DataViewerProps) {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<{ x: string; y: string }>({ x: '', y: '' });
  const [data, setData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0].name);
    }
  }, [files]);

  useEffect(() => {
    const loadFileData = async () => {
      const file = files.find(f => f.name === selectedFile);
      if (!file) return;

      try {
        const fileContent = await file.arrayBuffer();
        let parsedData: any[] = [];
        let headers: string[] = [];

        if (file.name.endsWith('.csv')) {
          const text = new TextDecoder().decode(fileContent);
          const rows = text.split('\n').map(row => row.split(','));
          headers = rows[0];
          parsedData = rows.slice(1).map(row => {
            const obj: any = {};
            row.forEach((value, index) => {
              obj[headers[index]] = isNaN(Number(value)) ? value : Number(value);
            });
            return obj;
          });
        } else {
          const workbook = XLSX.read(fileContent);
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          headers = jsonData[0] as string[];
          parsedData = jsonData.slice(1).map(row => {
            const obj: any = {};
            (row as any[]).forEach((value, index) => {
              obj[headers[index]] = value;
            });
            return obj;
          });
        }

        setColumns(headers);
        setData(parsedData);
        if (headers.length >= 2) {
          setSelectedColumns({ x: headers[0], y: headers[1] });
        }
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };

    loadFileData();
  }, [selectedFile, files]);

  const handlePreprocessData = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to preprocess.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const file = files.find(f => f.name === selectedFile);
      if (!file) throw new Error('File not found');

      // Upload file to temporary storage
      const fileExt = file.name.split('.').pop();
      const tempFilePath = `temp/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('well_data')
        .upload(tempFilePath, file);

      if (uploadError) throw uploadError;

      // Call the preprocess function with file metadata
      const { data: result, error } = await supabase.functions.invoke('preprocess', {
        body: { 
          files: [{
            project_name: 'default', // You might want to get this from props or context
            file_name: file.name,
            file_path: tempFilePath,
            file_type: file.type,
            file_size: file.size,
            well_name: null
          }]
        }
      });

      console.log('Preprocess result:', result);

      if (error) throw error;

      if (!result.success) {
        throw new Error(result.error || 'Preprocessing failed');
      }

      toast({
        title: "Success",
        description: "File preprocessing completed successfully.",
      });

    } catch (error) {
      console.error('Error preprocessing data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to preprocess file",
        variant: "destructive"
      });

      // Attempt to clean up temporary file if preprocessing fails
      try {
        const fileExt = selectedFile.split('.').pop();
        const tempFilePath = `temp/${crypto.randomUUID()}.${fileExt}`;
        await supabase.storage
          .from('well_data')
          .remove([tempFilePath]);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (files.length === 0) {
    return (
      <Card className="m-4">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No files uploaded yet. Please upload files to view data visualizations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedFile} onValueChange={setSelectedFile}>
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

            <Select
              value={selectedColumns.x}
              onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, x: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select X axis" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedColumns.y}
              onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, y: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Y axis" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={selectedColumns.x}
                  label={{ value: selectedColumns.x, position: 'bottom' }}
                />
                <YAxis
                  label={{ 
                    value: selectedColumns.y, 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                />
                <ChartTooltip />
                <ChartLegend align="left" verticalAlign="top" />
                <Line
                  type="monotone"
                  dataKey={selectedColumns.y}
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              onClick={handlePreprocessData}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isProcessing ? "Processing..." : "Preprocess Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}