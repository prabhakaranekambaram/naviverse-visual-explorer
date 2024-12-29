import { ChevronRight, ChevronDown, Folder, Upload, Database, Box, Plus, FileUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

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

  const handleNewProject = () => {
    toast({
      title: "Create New Project",
      description: "This feature is coming soon!"
    })
  }

  const handleUploadProject = () => {
    toast({
      title: "Upload Project",
      description: "This feature is coming soon!"
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
      </div>
      <TreeItem 
        label="Project" 
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
    </div>
  )
}