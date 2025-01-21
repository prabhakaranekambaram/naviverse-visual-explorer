import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { saveProjectConfig } from "@/utils/projectUtils"
import { useAuth } from "@/App"
import { useNavigate } from "react-router-dom"

interface ProjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreate: (projectName: string) => void
}

export function ProjectForm({ open, onOpenChange, onProjectCreate }: ProjectFormProps) {
  const { toast } = useToast()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({
    projectName: "",
    companyName: "",
    blockName: "",
    siteName: "",
    gpsCoordinates: ""
  })

  React.useEffect(() => {
    if (!session) {
      navigate('/login')
    }
  }, [session, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to create a project",
        variant: "destructive"
      })
      navigate('/login')
      return
    }
    
    try {
      await saveProjectConfig(formData)
      toast({
        title: "Success",
        description: "Project configuration saved successfully"
      })
      onProjectCreate(formData.projectName)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving project:', error)
      toast({
        title: "Error",
        description: "Failed to save project configuration",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="projectName"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Input
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Input
              name="blockName"
              placeholder="Block Name"
              value={formData.blockName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Input
              name="siteName"
              placeholder="Site Name"
              value={formData.siteName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Input
              name="gpsCoordinates"
              placeholder="GPS Coordinates"
              value={formData.gpsCoordinates}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">Create Project</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}