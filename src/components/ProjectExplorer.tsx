import { ChevronRight, ChevronDown, Folder, Upload, Database, Box } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

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
  return (
    <div className="tree-view-container">
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