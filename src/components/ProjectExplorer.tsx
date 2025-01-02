import { Folder, Upload, Database, Box, Plus, FileUp, FileText, ChartLine, Info, DollarSign, Repeat } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ProjectForm } from "./ProjectForm"
import { loadProjectConfig } from "@/utils/projectUtils"
import { TreeItem } from "./TreeItem"
import { ModelSelection } from "./ModelSelection"
import { Link } from "react-router-dom"

export function ProjectExplorer() {
  const { toast } = useToast()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projectName, setProjectName] = useState("Project")
  const [selectedModel, setSelectedModel] = useState<string>("")

  const handleNewProject = () => {
    setIsFormOpen(true)
  }

  const handleUploadProject = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const config = await loadProjectConfig(file)
      handleProjectChange(config.projectName)
      toast({
        title: "Success",
        description: `Project ${config.projectName} loaded successfully`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project configuration",
        variant: "destructive"
      })
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleProjectChange = (name: string) => {
    setProjectName(name)
    const event = new CustomEvent('projectChange', { detail: name })
    window.dispatchEvent(event)
  }

  const dispatchNavigationEvent = (view: string) => {
    const event = new CustomEvent('navigate', { detail: view })
    window.dispatchEvent(event)
  }

  return (
    <div className="tree-view-container">
      <div className="flex flex-col items-center gap-4 mb-6 pt-4">
        <img 
          src="/makar-logo.png" 
          alt="Makar Logo" 
          className="w-32 h-auto mb-2"
        />
        <Link 
          to="/about"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Info className="w-4 h-4" />
          About
        </Link>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={handleNewProject}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={handleUploadProject}
        >
          <FileUp className="w-4 h-4 mr-2" />
          Upload Project
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".conf"
          className="hidden"
        />
      </div>
      <TreeItem 
        label={projectName} 
        icon={<Folder className="w-4 h-4" />}
        defaultExpanded={true}
      >
        <TreeItem 
          label="Upload" 
          icon={<Upload className="w-4 h-4" />}
          onClick={() => dispatchNavigationEvent('upload')}
        />
        <TreeItem 
          label="Data Viewer" 
          icon={<Database className="w-4 h-4" />}
          onClick={() => dispatchNavigationEvent('dataViewer')}
        />
        <TreeItem 
          label="Auto DCA" 
          icon={<DollarSign className="w-4 h-4" />}
        />
        <TreeItem 
          label="Auto MBAL" 
          icon={<Repeat className="w-4 h-4" />}
        />
        <TreeItem 
          label="Model Generator" 
          icon={<Box className="w-4 h-4" />}
          defaultExpanded={true}
        >
          <TreeItem 
            label="Data Set" 
            icon={<FileText className="w-4 h-4" />}
          />
          <ModelSelection
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
          />
          <TreeItem 
            label="Forecast" 
            icon={<ChartLine className="w-4 h-4" />}
          />
        </TreeItem>
      </TreeItem>
      <ProjectForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onProjectCreate={handleProjectChange} 
      />
    </div>
  )
}
