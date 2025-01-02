import { Filter } from "lucide-react"
import { useState } from "react"
import { TreeItem } from "./TreeItem"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface ModelSelectionProps {
  selectedModel: string
  onModelSelect: (value: string) => void
}

export const ModelSelection = ({ selectedModel, onModelSelect }: ModelSelectionProps) => {
  const { toast } = useToast()
  const [showModelSelect, setShowModelSelect] = useState(false)

  const handleModelSelect = (value: string) => {
    onModelSelect(value)
    toast({
      title: "Model Selected",
      description: `Selected model: ${value}`
    })
  }

  return (
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
  )
}