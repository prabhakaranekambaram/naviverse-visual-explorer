import { Upload } from "./Upload"
import { DataViewer } from "./DataViewer"
import { CCUSScreening } from "./CCUSScreening"
import { Analytics } from "./Analytics"
import { WellDataManager } from "./WellDataManager"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export function MainContent() {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'upload' | 'dataViewer' | 'screening' | 'analytics' | 'wellData'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [projectName, setProjectName] = useState<string>("Project");

  const handleFileSave = (files: File[]) => {
    setUploadedFiles(files);
    toast({
      title: "Files Saved Successfully",
      description: `${files.length} file(s) have been saved`,
    });
  };

  useEffect(() => {
    const handleNavigation = (event: CustomEvent<string>) => {
      if (event.detail === 'upload') {
        setCurrentView('upload');
        setUploadedFiles([]);
      } else if (event.detail === 'dataViewer') {
        setCurrentView('dataViewer');
      } else if (event.detail === 'screening') {
        setCurrentView('screening');
      } else if (event.detail === 'analytics') {
        setCurrentView('analytics');
      } else if (event.detail === 'wellData') {
        setCurrentView('wellData');
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
      ) : currentView === 'dataViewer' ? (
        <DataViewer files={uploadedFiles} />
      ) : currentView === 'analytics' ? (
        <Analytics />
      ) : currentView === 'wellData' ? (
        <WellDataManager projectName={projectName} />
      ) : (
        <CCUSScreening />
      )}
    </div>
  )
}