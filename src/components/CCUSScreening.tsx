import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ScreeningStep = {
  id: string
  title: string
  description: string
}

const screeningSteps: ScreeningStep[] = [
  {
    id: "technical",
    title: "Technical Assessment",
    description: "Evaluate technical parameters for CCUS suitability",
  },
  {
    id: "economic",
    title: "Economic Analysis",
    description: "Assess economic feasibility and potential returns",
  },
  {
    id: "environmental",
    title: "Environmental Impact",
    description: "Review environmental considerations and regulations",
  },
  {
    id: "summary",
    title: "Summary",
    description: "Review and export screening results",
  },
]

export function CCUSScreening() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTab, setSelectedTab] = useState("input")
  const progress = ((currentStep + 1) / screeningSteps.length) * 100

  const handleNext = () => {
    if (currentStep < screeningSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      toast({
        title: "Progress Saved",
        description: "Your screening data has been saved",
      })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleExport = () => {
    toast({
      title: "Report Generated",
      description: "Your screening report has been downloaded",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CCUS Screening Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {screeningSteps.length}</span>
              <span>{screeningSteps[currentStep].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{screeningSteps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="input">Input Parameters</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="input">
              {currentStep === 0 && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reservoir-depth">Reservoir Depth (m)</Label>
                    <Input id="reservoir-depth" type="number" placeholder="Enter depth" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="porosity">Porosity (%)</Label>
                    <Input id="porosity" type="number" placeholder="Enter porosity" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="permeability">Permeability (mD)</Label>
                    <Input id="permeability" type="number" placeholder="Enter permeability" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="capex">CAPEX (USD)</Label>
                    <Input id="capex" type="number" placeholder="Enter CAPEX" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="opex">OPEX (USD/year)</Label>
                    <Input id="opex" type="number" placeholder="Enter OPEX" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="carbon-price">Carbon Price (USD/tonne)</Label>
                    <Input id="carbon-price" type="number" placeholder="Enter carbon price" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="co2-reduction">CO2 Reduction Potential (tonnes/year)</Label>
                    <Input id="co2-reduction" type="number" placeholder="Enter CO2 reduction" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="environmental-risk">Environmental Risk Score (1-10)</Label>
                    <Input id="environmental-risk" type="number" min="1" max="10" placeholder="Enter risk score" />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Technical Suitability</TableCell>
                        <TableCell>High</TableCell>
                        <TableCell className="text-green-600">✓ Suitable</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Economic Viability</TableCell>
                        <TableCell>Medium</TableCell>
                        <TableCell className="text-yellow-600">⚠ Review</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Environmental Impact</TableCell>
                        <TableCell>Low</TableCell>
                        <TableCell className="text-green-600">✓ Acceptable</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Button onClick={handleExport} className="w-full">
                    Export Screening Report
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results">
              <div className="space-y-4">
                {currentStep < 3 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Complete the input parameters to view results
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Storage Capacity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">2.5 Mt</div>
                          <p className="text-xs text-muted-foreground">
                            Estimated CO2 storage potential
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Project NPV
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$12.5M</div>
                          <p className="text-xs text-muted-foreground">
                            Net Present Value
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Risk Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">Low</div>
                          <p className="text-xs text-muted-foreground">
                            Overall project risk assessment
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === screeningSteps.length - 1}
            >
              {currentStep === screeningSteps.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}