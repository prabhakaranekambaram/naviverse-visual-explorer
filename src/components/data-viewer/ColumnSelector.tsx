import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ColumnSelectorProps {
  columns: string[]
  selectedColumn: string
  onColumnSelect: (column: string) => void
  label: string
}

export function ColumnSelector({ columns, selectedColumn, onColumnSelect, label }: ColumnSelectorProps) {
  return (
    <Select value={selectedColumn} onValueChange={onColumnSelect}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {columns.map((column) => (
          <SelectItem key={column} value={column}>
            {column}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}