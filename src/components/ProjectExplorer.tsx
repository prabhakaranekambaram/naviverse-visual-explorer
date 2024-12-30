import { ChevronRight, ChevronDown, Folder, Upload, Database, Box, Plus, FileUp, FileText, Filter, ChartLine } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ProjectForm } from "./ProjectForm"
import { loadProjectConfig } from "@/utils/projectUtils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TreeItemProps {
  label: string
  icon: React.ReactNode
  defaultExpanded?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

const TreeItem = ({ label, icon, defaultExpanded = false, children, onClick }: TreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (children) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div>
      <div 
        className="tree-item"
        onClick={handleClick}
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
  const [showModelSelect, setShowModelSelect] = useState(false)
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

  const handleModelSelect = (value: string) => {
    setSelectedModel(value)
    toast({
      title: "Model Selected",
      description: `Selected model: ${value}`
    })
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
          defaultExpanded={true}
        >
          <TreeItem 
            label="Data Set" 
            icon={<FileText className="w-4 h-4" />}
          />
          <TreeItem 
            label="Model Selection" 
            icon={<Filter className="w-4 h-4" />}
            defaultExpanded={true}
            onClick={() => setShowModelSelect(!showModelSelect)}
          >
            <div className="relative pl-8 pr-4 py-2">
              <Select onValueChange={handleModelSelect} value={selectedModel}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-full min-w-[200px]">
                  <SelectItem value="random-forest">Random Forest</SelectItem>
                  <SelectItem value="decision-tree">Decision Tree</SelectItem>
                  <SelectItem value="lstm">LSTM</SelectItem>
                  <SelectItem value="ann">ANN</SelectItem>
                  <SelectItem value="dnn">DNN</SelectItem>
                  <SelectItem value="cnn">CNN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TreeItem>
          <TreeItem 
            label="Forecast" 
            icon={<ChartLine className="w-4 h-4" />}
          />
        </TreeItem>
      </TreeItem>
      <ProjectForm open={isFormOpen} onOpenChange={setIsFormOpen} onProjectCreate={(name) => setProjectName(name)} />
    </div>
  )
}