import { Upload } from "./Upload"
import { DataViewer } from "./DataViewer"
import { useState, useEffect } from "react"

export function MainContent() {
  const [currentView, setCurrentView] = useState<'upload' | 'dataViewer'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [projectName, setProjectName] = useState<string>("Project");

  const handleFileSave = (files: File[]) => {
    setUploadedFiles(files);
    // Only navigate to dataViewer when files are explicitly saved
    setCurrentView('dataViewer');
  };

  useEffect(() => {
    const handleNavigation = (event: CustomEvent<string>) => {
      if (event.detail === 'upload') {
        setCurrentView('upload');
        // Reset files when switching back to upload view
        setUploadedFiles([]);
      }
    };

    const handleProjectChange = (event: CustomEvent<string>) => {
      setProjectName(event.detail);
    };

    window.addEventListener('navigate', handleNavigation as EventListener);
    window.addEventListener('projectChange', handleProjectChange as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
      window.removeEventListener('projectChange', handleProjectChange as EventListener);
    };
  }, []);

  return (
    <div className="flex-1 p-6">
      {currentView === 'upload' ? (
        <Upload onSaveFiles={handleFileSave} projectName={projectName} />
      ) : (
        <DataViewer files={uploadedFiles} />
      )}
    </div>
  )
}