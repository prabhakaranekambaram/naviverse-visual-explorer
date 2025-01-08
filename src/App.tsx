import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createContext, useContext, useState } from "react"
import Index from "./pages/Index"
import Login from "./pages/Login"
import About from "./pages/About"
import { supabase } from "./integrations/supabase/client"

const queryClient = new QueryClient()

// Create a context for authentication (keeping structure for future re-enablement)
const AuthContext = createContext<{ session: any | null }>({ session: null })

export const useAuth = () => {
  return useContext(AuthContext)
}

function App() {
  const [session] = useState<any | null>(null)

  return (
    <AuthContext.Provider value={{ session }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  )
}

export default App
