import * as XLSX from 'xlsx';

export const mergeFilesByWellName = async (files: File[]): Promise<Blob> => {
  const mergedData: { [key: string]: any } = {};
  
  for (const file of files) {
    const fileContent = await file.arrayBuffer();
    const workbook = XLSX.read(fileContent);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    jsonData.forEach((row: any) => {
      // Assuming 'Well Name' is the column header for well names
      const wellName = row['Well Name'] || row['WELL_NAME'] || row['well_name'];
      if (!wellName) return;

      if (!mergedData[wellName]) {
        mergedData[wellName] = [];
      }
      mergedData[wellName].push(row);
    });
  }

  // Convert merged data to worksheet format
  const worksheet = XLSX.utils.json_to_sheet(
    Object.entries(mergedData).flatMap(([wellName, data]) => 
      Array.isArray(data) ? data : [data]
    )
  );

  // Create a new workbook and add the worksheet
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Merged Data');

  // Generate blob
  const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};