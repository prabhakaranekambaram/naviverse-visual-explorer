import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { createContext, useContext, useState, useEffect } from "react"
import Landing from "./pages/Landing"
import Index from "./pages/Index"
import Login from "./pages/Login"
import About from "./pages/About"
import { supabase } from "./integrations/supabase/client"

const queryClient = new QueryClient()

const AuthContext = createContext<{ session: any | null }>({ session: null })

export const useAuth = () => {
  return useContext(AuthContext)
}

function App() {
  const [session, setSession] = useState<any | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/dashboard"
                element={session ? <Index /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  )
}

export default App