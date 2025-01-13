import { ProjectExplorer } from "@/components/ProjectExplorer"
import { MainContent } from "@/components/MainContent"
import { RightSidebar } from "@/components/RightSidebar"
import { UserProfile } from "@/components/UserProfile"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary to-white">
      {/* Top Bar */}
      <div className="w-full border-b bg-white/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/makar-logo.png" 
            alt="Makar.ai Logo" 
            className="h-8 w-auto"
          />
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>CCUS Screening Platform</span>
            <ChevronRight className="h-4 w-4" />
            <span>Well Analysis</span>
          </div>
        </div>
        <UserProfile />
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
              <MainContent />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 border-l bg-white/80 backdrop-blur-sm">
          <RightSidebar />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Makar.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Index