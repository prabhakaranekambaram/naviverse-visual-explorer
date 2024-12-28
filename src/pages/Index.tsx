import { ProjectExplorer } from "@/components/ProjectExplorer"
import { MainContent } from "@/components/MainContent"
import { RightSidebar } from "@/components/RightSidebar"

const Index = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-gray-50">
        <ProjectExplorer />
      </div>

      {/* Main Content */}
      <MainContent />

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  )
}

export default Index