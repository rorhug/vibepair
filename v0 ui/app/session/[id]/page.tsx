"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Code, Send, Video } from "lucide-react"

// Mock session data
const sessionData = {
  id: "1",
  jobTitle: "Optimize database queries for better performance",
  client: "TechCorp Inc.",
  status: "Active",
  startTime: "May 8, 2025, 3:00 PM",
  elapsedTime: "1h 23m",
  problem:
    "Our application is experiencing slow response times due to inefficient database queries. Need help optimizing them.",
  repositoryUrl: "https://github.com/vibepair/db-project",
  branch: "optimization",
  liveShareUrl: "https://prod.liveshare.vsengsaas.visualstudio.com/join?ABCDEF123456789",
  messages: [
    {
      id: "1",
      sender: "Client",
      content: "Hi, I'm looking forward to working with you on this issue.",
      timestamp: "3:00 PM",
    },
    {
      id: "2",
      sender: "You",
      content:
        "Thanks! I've looked at the repository and I think I understand the problem. Let's start by examining the main query in the users service.",
      timestamp: "3:05 PM",
    },
    {
      id: "3",
      sender: "Client",
      content:
        "Great! That's where we're seeing the most slowdown. The query takes about 5 seconds to complete which is way too long.",
      timestamp: "3:07 PM",
    },
  ],
}

export default function SessionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [summary, setSummary] = useState("")
  const [commitIds, setCommitIds] = useState("")
  const [rating, setRating] = useState(5)

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to an API
      console.log({ sessionId: params.id, message })
      setMessage("")
    }
  }

  const handleCompleteSession = () => {
    // In a real app, this would submit to an API
    console.log({
      sessionId: params.id,
      summary,
      commitIds,
      rating,
    })

    setIsCompleteDialogOpen(false)
    router.push("/active-jobs")
  }

  return (
    <div className="container py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="border-forest/20 text-forest hover:bg-pastel-blue/30"
          onClick={() => router.push("/active-jobs")}
        >
          ← Back to Active Jobs
        </Button>

        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-forest hover:bg-forest-light text-cream">Complete Session</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-cream border-forest/10">
            <DialogHeader>
              <DialogTitle className="text-forest">Complete Session</DialogTitle>
              <DialogDescription className="text-forest/70">
                Summarize the work completed and provide any relevant information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="summary" className="text-forest">
                  Solution Summary
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Describe the solution implemented..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="bg-pastel-yellow/30 border-pastel-yellow/50 text-forest"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="commits" className="text-forest">
                  Repository Changes (Commit IDs)
                </Label>
                <Input
                  id="commits"
                  placeholder="e.g., abc123, def456"
                  value={commitIds}
                  onChange={(e) => setCommitIds(e.target.value)}
                  className="bg-pastel-blue/30 border-pastel-blue/50 text-forest"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-forest">Rate Your Experience</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={rating === value ? "default" : "outline"}
                      size="sm"
                      className={
                        rating === value
                          ? "bg-forest text-cream"
                          : "border-forest/20 text-forest hover:bg-pastel-green/30"
                      }
                      onClick={() => setRating(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCompleteSession} className="bg-forest hover:bg-forest-light text-cream">
                Submit & Complete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6 card-pastel-green border-none shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-forest">{sessionData.jobTitle}</CardTitle>
              <CardDescription className="text-forest/70">Client: {sessionData.client}</CardDescription>
            </div>
            <Badge className="bg-pastel-green/50 text-forest border-pastel-green/70">
              Session {sessionData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-forest/80">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Started: {sessionData.startTime}
            </div>
            <div>Time elapsed: {sessionData.elapsedTime}</div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-forest">Problem</h3>
            <p className="text-forest/80">{sessionData.problem}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="collaboration">
        <TabsList className="grid w-full grid-cols-3 bg-pastel-blue/30">
          <TabsTrigger value="collaboration" className="data-[state=active]:bg-forest data-[state=active]:text-cream">
            Collaboration
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-forest data-[state=active]:text-cream">
            Chat
          </TabsTrigger>
          <TabsTrigger value="setup" className="data-[state=active]:bg-forest data-[state=active]:text-cream">
            Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaboration" className="py-4">
          <Card className="card-pastel-blue border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-forest">Live Collaboration</CardTitle>
              <CardDescription className="text-forest/70">
                Join the Microsoft Live Share session to collaborate in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 border rounded-md bg-cream/50 text-center border-forest/10">
                <Code className="h-12 w-12 mx-auto mb-4 text-forest" />
                <h3 className="text-lg font-medium mb-2 text-forest">Ready to collaborate</h3>
                <p className="text-forest/80 mb-4">Click the button below to join the VS Code Live Share session.</p>
                <Button className="w-full sm:w-auto bg-forest hover:bg-forest-light text-cream" asChild>
                  <a href={sessionData.liveShareUrl} target="_blank" rel="noopener noreferrer">
                    Join Live Share Session
                  </a>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-forest/20 text-forest hover:bg-pastel-blue/30"
                  asChild
                >
                  <a href={sessionData.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    Open Repository
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 border-forest/20 text-forest hover:bg-pastel-blue/30">
                  <Video className="h-4 w-4 mr-2" />
                  Start Voice Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="py-4">
          <Card className="flex flex-col h-[600px] card-pastel-peach border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-forest">Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              <div className="space-y-4">
                {sessionData.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.sender === "You" ? "bg-forest text-cream" : "bg-cream/70"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`font-medium text-xs ${msg.sender === "You" ? "text-cream/90" : "text-forest"}`}
                        >
                          {msg.sender}
                        </span>
                        <span className={`text-xs ${msg.sender === "You" ? "text-cream/70" : "text-forest/70"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className={msg.sender === "You" ? "text-cream" : "text-forest"}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-forest/10 p-4">
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[60px] bg-cream/70 border-forest/10 text-forest"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage} className="bg-forest hover:bg-forest-light text-cream">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="py-4">
          <Card className="card-pastel-yellow border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-forest">Setup Instructions</CardTitle>
              <CardDescription className="text-forest/70">
                Follow these steps to prepare for the collaboration session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-forest">Prerequisites</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="vs-code"
                      className="border-forest/30 data-[state=checked]:bg-forest data-[state=checked]:text-cream"
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="vs-code" className="text-forest">
                        Install Visual Studio Code
                      </Label>
                      <p className="text-sm text-forest/80">
                        Download and install VS Code from{" "}
                        <a
                          href="https://code.visualstudio.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-forest hover:underline"
                        >
                          code.visualstudio.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="live-share"
                      className="border-forest/30 data-[state=checked]:bg-forest data-[state=checked]:text-cream"
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="live-share" className="text-forest">
                        Install Live Share Extension
                      </Label>
                      <p className="text-sm text-forest/80">
                        Install the Live Share extension from the VS Code marketplace
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="git"
                      className="border-forest/30 data-[state=checked]:bg-forest data-[state=checked]:text-cream"
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="git" className="text-forest">
                        Install Git
                      </Label>
                      <p className="text-sm text-forest/80">Make sure Git is installed on your system</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-forest">Repository Setup</h3>
                <div className="space-y-2 text-sm text-forest/80">
                  <p>1. Clone the repository:</p>
                  <pre className="bg-cream/70 p-2 rounded-md overflow-x-auto text-forest">
                    git clone {sessionData.repositoryUrl}
                  </pre>

                  <p>2. Switch to the correct branch:</p>
                  <pre className="bg-cream/70 p-2 rounded-md overflow-x-auto text-forest">
                    git checkout {sessionData.branch}
                  </pre>

                  <p>3. Install dependencies (if applicable):</p>
                  <pre className="bg-cream/70 p-2 rounded-md overflow-x-auto text-forest">npm install</pre>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="bg-forest hover:bg-forest-light text-cream">
                <a href={sessionData.liveShareUrl} target="_blank" rel="noopener noreferrer">
                  Join Live Share Session
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
