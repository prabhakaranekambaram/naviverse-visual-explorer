import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/App"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"

export function UserProfile() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const user = session?.user;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {user ? (
              <>
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt={user?.email || "User"} />
                <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={handleLogin}>Log in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}