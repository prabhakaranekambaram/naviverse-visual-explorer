import { Upload } from "./Upload"
import { DataViewer } from "./DataViewer"
import { useState } from "react"

export function MainContent() {
  const [currentView, setCurrentView] = useState<'upload' | 'dataViewer'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileSave = (files: File[]) => {
    setUploadedFiles(files);
  };

  return (
    <div className="flex-1 p-6">
      {currentView === 'upload' ? (
        <Upload onSaveFiles={handleFileSave} />
      ) : (
        <DataViewer files={uploadedFiles} />
      )}
    </div>
  )
}