import { Folder, Upload, Database, Box, Plus, FileUp, FileText, ChartLine, Info, DollarSign, Repeat, CheckSquare, BarChart2, Settings } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ProjectForm } from "./ProjectForm"
import { loadProjectConfig } from "@/utils/projectUtils"
import { TreeItem } from "./TreeItem"
import { Link } from "react-router-dom"

export function ProjectExplorer() {
  const { toast } = useToast()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projectName, setProjectName] = useState("Project")
  const [highlightedItem, setHighlightedItem] = useState<string>("")
  const [expandedItems, setExpandedItems] = useState<string[]>(["Well Data Management"])

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
    setHighlightedItem(view)
    const event = new CustomEvent('navigate', { detail: view })
    window.dispatchEvent(event)
  }

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  return (
    <div className="tree-view-container">
      <div className="flex flex-col gap-2 mb-4 pt-4">
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
          label="Well Data Management" 
          icon={<Settings className="w-4 h-4" />}
          defaultExpanded={expandedItems.includes("Well Data Management")}
          onClick={() => {
            dispatchNavigationEvent('wellData')
            toggleExpanded("Well Data Management")
          }}
          isHighlighted={highlightedItem === 'wellData'}
        >
          <TreeItem 
            label="Upload" 
            icon={<Upload className="w-4 h-4" />}
            onClick={() => dispatchNavigationEvent('upload')}
            isHighlighted={highlightedItem === 'upload'}
          />
          <TreeItem 
            label="Data Viewer" 
            icon={<Database className="w-4 h-4" />}
            onClick={() => dispatchNavigationEvent('dataViewer')}
            isHighlighted={highlightedItem === 'dataViewer'}
          />
          <TreeItem 
            label="Auto DCA" 
            icon={<DollarSign className="w-4 h-4" />}
          />
          <TreeItem 
            label="Auto MBAL" 
            icon={<Repeat className="w-4 h-4" />}
          />
        </TreeItem>
        <TreeItem 
          label="CCUS Screening" 
          icon={<CheckSquare className="w-4 h-4" />}
          onClick={() => dispatchNavigationEvent('screening')}
          isHighlighted={highlightedItem === 'screening'}
        />
        <TreeItem 
          label="Analytics" 
          icon={<BarChart2 className="w-4 h-4" />}
          onClick={() => dispatchNavigationEvent('analytics')}
          isHighlighted={highlightedItem === 'analytics'}
        />
      </TreeItem>
      <ProjectForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onProjectCreate={handleProjectChange} 
      />
    </div>
  )
}