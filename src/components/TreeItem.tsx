import { ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"

interface TreeItemProps {
  label: string
  icon: React.ReactNode
  defaultExpanded?: boolean
  children?: React.ReactNode
  onClick?: () => void
  isHighlighted?: boolean
}

export const TreeItem = ({ 
  label, 
  icon, 
  defaultExpanded = false, 
  children, 
  onClick,
  isHighlighted = false 
}: TreeItemProps) => {
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
        className={`tree-item ${isHighlighted ? 'bg-accent text-accent-foreground' : ''}`}
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