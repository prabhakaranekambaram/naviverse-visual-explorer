import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { ChartTooltip, ChartLegend } from "@/components/ui/chart"

interface ChartDisplayProps {
  data: any[]
  xAxis: string
  yAxis: string
}

export function ChartDisplay({ data, xAxis, yAxis }: ChartDisplayProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxis}
            label={{ value: xAxis, position: 'bottom' }}
          />
          <YAxis
            label={{ 
              value: yAxis, 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <ChartTooltip />
          <ChartLegend align="left" verticalAlign="top" />
          <Line
            type="monotone"
            dataKey={yAxis}
            stroke="#8884d8"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}