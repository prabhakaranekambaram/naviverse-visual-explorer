import { Link } from "react-router-dom"
import MakarLogo from "@/components/MakarLogo"
import { Button } from "@/components/ui/button"
import { Globe, Building, ChartBar } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white">
      {/* Navigation */}
      <nav className="w-full border-b bg-white/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MakarLogo className="h-8 w-8" />
          <span className="font-bold text-primary">Makar.ai</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Revolutionizing CCUS Project Screening
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Leverage AI-powered analytics to make data-driven decisions for your Carbon Capture, Utilization, and Storage projects.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="px-8">
              Explore CCUS Platform
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Makar.ai</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
              <p className="text-muted-foreground">
                Contribute to global carbon reduction goals with intelligent CCUS solutions
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Building className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Industry Expertise</h3>
              <p className="text-muted-foreground">
                Built by industry experts with deep understanding of CCUS challenges
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <ChartBar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
              <p className="text-muted-foreground">
                Advanced analytics and visualization tools for informed decision making
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Makar.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}