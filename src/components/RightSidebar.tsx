import { Button } from "@/components/ui/button"
import { UserProfile } from "./UserProfile"

export function RightSidebar() {
  return (
    <div className="w-64 border-l bg-gray-50 p-4 flex flex-col">
      <div className="flex justify-end mb-4">
        <UserProfile />
      </div>
      <div className="space-y-2">
        <Button className="w-full justify-start" variant="ghost">
          Operation 1
        </Button>
        <Button className="w-full justify-start" variant="ghost">
          Operation 2
        </Button>
        <Button className="w-full justify-start" variant="ghost">
          Operation 3
        </Button>
      </div>
    </div>
  )
}