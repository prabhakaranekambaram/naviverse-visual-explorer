import { ChevronRight, ChevronDown, Folder, Upload, Database, Box, Plus, FileUp } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ProjectForm } from "./ProjectForm"
import { loadProjectConfig } from "@/utils/projectUtils"

interface TreeItemProps {
  label: string
  icon: React.ReactNode
  defaultExpanded?: boolean
  children?: React.ReactNode
}

const TreeItem = ({ label, icon, defaultExpanded = false, children }: TreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div>
      <div 
        className="tree-item"
        onClick={() => children && setIsExpanded(!isExpanded)}
      >
        {children ? (
          isExpanded ? <ChevronDown className="tree-item-icon" /> : <ChevronRight className="tree-item-icon" />
        ) : (
          <div className="w-4" />
        )}
        {icon}
        <span className="tree-item-content">{label}</span>
      </div>
      {children && isExpanded && (
        <div className="tree-item-children">
          {children}
        </div>
      )}
    </div>
  )
}

export function ProjectExplorer() {
  const { toast } = useToast()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projectName, setProjectName] = useState("Project")

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
      setProjectName(config.projectName)
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

  return (
    <div className="tree-view-container">
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
        />
        <TreeItem 
          label="Data Viewer" 
          icon={<Database className="w-4 h-4" />}
        />
        <TreeItem 
          label="Model Generator" 
          icon={<Box className="w-4 h-4" />}
        />
      </TreeItem>
      <ProjectForm open={isFormOpen} onOpenChange={setIsFormOpen} onProjectCreate={(name) => setProjectName(name)} />
    </div>
  )
}