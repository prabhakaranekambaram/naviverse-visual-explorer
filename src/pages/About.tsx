import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

const About = () => {
  const features = [
    "Secure well data management and storage",
    "Advanced CCUS screening workflow",
    "Interactive data visualization",
    "Comprehensive reporting tools",
    "Real-time collaboration features",
    "Customizable screening criteria"
  ]

  const leadership = [
    {
      name: "Balaji Chennakrishna",
      role: "CEO & Co-founder",
      bio: "With over 25 years of experience in the oil and gas industry, Balaji is the CEO of Telesto Energy, a Singapore based enterprise focused on bringing new technologies to the upstream sector. His expertise spans reservoir geology, production geology, field development, and geological modeling. At Telesto Energy, he leads a team leveraging AI and big data analytics to improve mature fields performance and automate decline curve analysis. He has published papers in international conferences and journals, focusing on delivering innovative solutions for the energy transition era.",
      image: "/balaji.jpg",
      fallback: "BC"
    },
    {
      name: "Prabhakaran Ekambaram",
      role: "CTO & Co-founder",
      bio: "Prabhakaran is a technology leader with over 20 years of experience in software development and architecture. He specializes in building scalable enterprise solutions and has led digital transformation initiatives at major companies. He holds an MS in Computer Science and has expertise in AI/ML applications.",
      image: "/prabha.jpg",
      fallback: "PE"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white">
      <div className="container mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <img 
              src="/makar-logo.png" 
              alt="Makar.ai Logo" 
              className="h-16 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simplifying CCUS Screening
            </h1>
            <p className="text-xl text-muted-foreground">
              Makar.ai is a cloud-based platform designed to streamline the CCUS screening process
              for oil and gas companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To accelerate CCUS adoption by providing powerful, user-friendly tools
                  for initial screening and project selection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8">Our Leadership</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {leadership.map((leader, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={leader.image} alt={leader.name} />
                        <AvatarFallback>{leader.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{leader.name}</h3>
                        <p className="text-muted-foreground">{leader.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{leader.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Target Users</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Reservoir Engineers",
                "Petroleum Engineers",
                "CCUS Project Managers",
                "Sustainability Specialists"
              ].map((user, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground">{user}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About