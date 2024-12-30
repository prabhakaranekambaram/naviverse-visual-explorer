import { Upload } from "./Upload"
import { DataViewer } from "./DataViewer"
import { useState, useEffect } from "react"

export function MainContent() {
  const [currentView, setCurrentView] = useState<'upload' | 'dataViewer'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileSave = (files: File[]) => {
    setUploadedFiles(files);
    setCurrentView('dataViewer');
  };

  useEffect(() => {
    const handleNavigation = (event: CustomEvent<string>) => {
      if (event.detail === 'dataViewer') {
        setCurrentView('dataViewer');
      } else if (event.detail === 'upload') {
        setCurrentView('upload');
        // Reset files when switching back to upload view
        setUploadedFiles([]);
      }
    };

    window.addEventListener('navigate', handleNavigation as EventListener);
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
    };
  }, []);

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