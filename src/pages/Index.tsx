import { ProjectExplorer } from "@/components/ProjectExplorer"
import { MainContent } from "@/components/MainContent"
import { RightSidebar } from "@/components/RightSidebar"
import { UserProfile } from "@/components/UserProfile"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar with User Profile */}
      <div className="w-full border-b bg-white px-4 py-2 flex justify-end">
        <UserProfile />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-gray-50">
          <ProjectExplorer />
        </div>

        {/* Main Content */}
        <MainContent />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  )
}

export default Index