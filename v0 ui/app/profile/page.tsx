"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

// Mock user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  // Using a placeholder instead of a specific image path
  avatar: "",
  bio: "Full-stack developer with 5 years of experience in React, Node.js, and PostgreSQL.",
  skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
  completedJobs: 12,
  successRate: "95%",
  averageRating: 4.8,
}

export default function ProfilePage() {
  const [name, setName] = useState(userData.name)
  const [email, setEmail] = useState(userData.email)
  const [bio, setBio] = useState(userData.bio)

  const handleSaveProfile = () => {
    // In a real app, this would save to an API
    console.log({ name, email, bio })
    // Show success message
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <div className="container py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-forest">Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="card-pastel-yellow border-none shadow-card hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-forest">Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-cream">
                {/* Only try to load the image if there's a valid URL */}
                {userData.avatar ? (
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                ) : null}
                <AvatarFallback className="bg-forest text-cream flex items-center justify-center">
                  {userData.avatar ? <span className="sr-only">{userData.name}</span> : <User className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium text-forest">{userData.name}</h3>
              <p className="text-sm text-forest/70 mb-4">{userData.email}</p>

              <div className="w-full space-y-2 mt-4">
                <div className="flex justify-between text-sm text-forest/80">
                  <span>Completed Jobs:</span>
                  <span className="font-medium text-forest">{userData.completedJobs}</span>
                </div>
                <div className="flex justify-between text-sm text-forest/80">
                  <span>Success Rate:</span>
                  <span className="font-medium text-forest">{userData.successRate}</span>
                </div>
                <div className="flex justify-between text-sm text-forest/80">
                  <span>Average Rating:</span>
                  <span className="font-medium text-forest">{userData.averageRating}/5</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {userData.skills.map((skill) => (
                  <Badge key={skill} className="bg-cream/50 text-forest border-forest/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="card-pastel-blue border-none shadow-card hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-forest">Edit Profile</CardTitle>
              <CardDescription className="text-forest/70">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-forest">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-cream/50 border-forest/20 text-forest"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-forest">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-cream/50 border-forest/20 text-forest"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio" className="text-forest">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="bg-cream/50 border-forest/20 text-forest"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="skills" className="text-forest">
                  Skills
                </Label>
                <Select>
                  <SelectTrigger id="skills" className="bg-cream/50 border-forest/20 text-forest">
                    <SelectValue placeholder="Add a skill" />
                  </SelectTrigger>
                  <SelectContent className="bg-cream border-forest/20">
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="node">Node.js</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} className="bg-forest hover:bg-forest-light text-cream">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
