import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const technicalData = [
  { parameter: "Reservoir Depth", value: 2500, threshold: 3000 },
  { parameter: "Porosity", value: 15, threshold: 10 },
  { parameter: "Permeability", value: 100, threshold: 50 },
  { parameter: "Temperature", value: 80, threshold: 90 },
]

const economicData = [
  { month: "Jan", capex: 1000, opex: 200 },
  { month: "Feb", capex: 1200, opex: 220 },
  { month: "Mar", capex: 900, opex: 180 },
  { month: "Apr", capex: 1500, opex: 250 },
]

const environmentalData = [
  { name: "CO2 Reduction", value: 40 },
  { name: "Water Usage", value: 25 },
  { name: "Land Impact", value: 15 },
  { name: "Energy Efficiency", value: 20 },
]

const COLORS = ["#0EA5E9", "#F2FCE2", "#D3E4FD", "#8E9196"]

export function DataVisualizations() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technical">Technical Assessment</TabsTrigger>
          <TabsTrigger value="economic">Economic Analysis</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Parameters vs Thresholds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={technicalData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="parameter" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#0EA5E9" name="Current Value" />
                    <Bar dataKey="threshold" fill="#F2FCE2" name="Threshold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economic">
          <Card>
            <CardHeader>
              <CardTitle>CAPEX vs OPEX Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={economicData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="capex"
                      stroke="#0EA5E9"
                      name="CAPEX"
                    />
                    <Line
                      type="monotone"
                      dataKey="opex"
                      stroke="#F2FCE2"
                      name="OPEX"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={environmentalData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {environmentalData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}