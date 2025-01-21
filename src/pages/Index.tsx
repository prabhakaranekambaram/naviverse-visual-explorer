import { ProjectExplorer } from "@/components/ProjectExplorer"
import { MainContent } from "@/components/MainContent"
import { UserProfile } from "@/components/UserProfile"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, BarChart2, Database, FileCheck, Users, Info } from "lucide-react"
import MakarLogo from "@/components/MakarLogo"
import { Link } from "react-router-dom"
import { ChatBot } from "@/components/ChatBot"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary to-white">
      {/* Top Bar */}
      <div className="w-full border-b bg-white/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MakarLogo className="h-8 w-8" />
            <span className="font-bold text-primary">Makar.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>CCUS Screening Platform</span>
            <ChevronRight className="h-4 w-4" />
            <span>Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/about"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="h-4 w-4" />
            About
          </Link>
          <UserProfile />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-white/80 backdrop-blur-sm">
          <ProjectExplorer />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-screen-xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  CCUS Screening Platform
                </h1>
                <p className="text-lg text-muted-foreground">
                  Streamline your CCUS project selection with data-driven insights
                </p>
              </header>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Database className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Well Data Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload and manage your well data securely
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <FileCheck className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Screening Workflow</h3>
                    <p className="text-sm text-muted-foreground">
                      Start the CCUS screening process
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <BarChart2 className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Analytics & Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualize and analyze screening results
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Users className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Collaboration</h3>
                    <p className="text-sm text-muted-foreground">
                      Share and collaborate with your team
                    </p>
                  </CardContent>
                </Card>
              </div>

              <MainContent />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Makar.ai. All rights reserved.</p>
        </div>
      </footer>

      {/* ChatBot - Make sure it's rendered outside of any scrollable containers */}
      <ChatBot />
    </div>
  )
}

export default Index