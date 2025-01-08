import { Upload } from "./Upload"
import { DataViewer } from "./DataViewer"
import { useState, useEffect } from "react"
import { mergeFilesByWellName, downloadBlob } from "../utils/fileUtils"
import { useToast } from "@/components/ui/use-toast"

export function MainContent() {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'upload' | 'dataViewer'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [projectName, setProjectName] = useState<string>("Project");

  const handleFileSave = async (files: File[]) => {
    setUploadedFiles(files);
    
    try {
      // Merge files and generate download
      const mergedBlob = await mergeFilesByWellName(files);
      downloadBlob(mergedBlob, 'merged.xlsx');
      
      toast({
        title: "Files Merged Successfully",
        description: "The merged file has been downloaded as 'merged.xlsx'",
      });
    } catch (error) {
      console.error('Error merging files:', error);
      toast({
        title: "Error Merging Files",
        description: "There was an error while merging the files. Please check the file format.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const handleNavigation = (event: CustomEvent<string>) => {
      if (event.detail === 'upload') {
        setCurrentView('upload');
        setUploadedFiles([]);
      } else if (event.detail === 'dataViewer') {
        setCurrentView('dataViewer');
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