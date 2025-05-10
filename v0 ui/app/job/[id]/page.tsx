"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, FileText, Github, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock job data - expanded to include all job IDs
const jobsData = {
  "1": {
    id: "1",
    title: "Fix authentication bug in React application",
    description:
      "There's an issue with the authentication flow in our React application. Users are sometimes logged out unexpectedly. We need someone to investigate the issue and implement a fix. The bug seems to occur when users navigate between protected routes.",
    technology: "React",
    price: 150,
    timeRemaining: "23 hours",
    urgency: "medium",
    repositoryUrl: "https://github.com/vibepair/auth-project",
    branch: "main",
    relevantFiles: [
      "src/components/Auth/Login.js",
      "src/context/AuthContext.js",
      "src/hooks/useAuth.js",
      "src/utils/authUtils.js",
    ],
  },
  "2": {
    id: "2",
    title: "Implement payment gateway integration",
    description:
      "We need to integrate Stripe payment gateway into our Node.js application to process customer payments. The integration should handle payment processing, webhooks, and customer management.",
    technology: "Node.js",
    price: 200,
    timeRemaining: "2 days",
    urgency: "low",
    repositoryUrl: "https://github.com/vibepair/payment-project",
    branch: "feature/payments",
    relevantFiles: [
      "src/services/payment.js",
      "src/controllers/checkout.js",
      "src/routes/api/payment.js",
      "src/config/stripe.js",
    ],
  },
  "3": {
    id: "3",
    title: "Optimize database queries for better performance",
    description:
      "Our application is experiencing slow response times due to inefficient database queries. We need help optimizing them to improve overall performance and user experience.",
    technology: "PostgreSQL",
    price: 180,
    timeRemaining: "1 day",
    urgency: "medium",
    repositoryUrl: "https://github.com/vibepair/db-project",
    branch: "optimization",
    relevantFiles: [
      "src/db/queries/users.js",
      "src/db/queries/products.js",
      "src/services/dataService.js",
      "src/models/index.js",
    ],
  },
  "4": {
    id: "4",
    title: "Build responsive UI components",
    description:
      "We need to create several responsive UI components using React and Tailwind CSS for our dashboard. The components should work well on all device sizes.",
    technology: "React",
    price: 120,
    timeRemaining: "3 days",
    urgency: "low",
    repositoryUrl: "https://github.com/vibepair/ui-components",
    branch: "main",
    relevantFiles: [
      "src/components/Dashboard/Card.jsx",
      "src/components/Dashboard/Chart.jsx",
      "src/components/Dashboard/Table.jsx",
      "src/styles/components.css",
    ],
  },
  "5": {
    id: "5",
    title: "Fix CSS layout issues on mobile devices",
    description:
      "Our web application has layout issues on mobile devices. Need help making it fully responsive and ensuring a consistent experience across all screen sizes.",
    technology: "CSS",
    price: 90,
    timeRemaining: "12 hours",
    urgency: "high",
    repositoryUrl: "https://github.com/vibepair/responsive-fix",
    branch: "fix/mobile",
    relevantFiles: [
      "src/styles/main.css",
      "src/styles/layout.css",
      "src/components/Header.jsx",
      "src/components/Navigation.jsx",
    ],
  },
}

// Helper function to get urgency color
const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "text-red-600"
    case "medium":
      return "text-amber-600"
    case "low":
      return "text-green-600"
    default:
      return "text-forest/70"
  }
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [penaltyAmount, setPenaltyAmount] = useState("") // New state for penalty amount
  const [proposal, setProposal] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("2hr")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching job details
    const fetchJobDetails = () => {
      setIsLoading(true)

      // Get job details from our mock data
      const job = jobsData[params.id as keyof typeof jobsData]

      if (job) {
        setJobDetails(job)
        setBidAmount(job.price.toString())
        // Set default penalty amount to 20% of bid amount
        setPenaltyAmount(Math.round(job.price * 0.2).toString())
      } else {
        // Handle case where job doesn't exist
        console.error(`Job with ID ${params.id} not found`)
      }

      setIsLoading(false)
    }

    fetchJobDetails()
  }, [params.id])

  const handleSubmitBid = () => {
    // In a real app, this would submit the bid to an API
    console.log({
      jobId: params.id,
      bidAmount,
      penaltyAmount, // Include penalty amount in submission
      proposal,
      estimatedTime,
    })

    setIsDialogOpen(false)
    router.push("/my-bids")
  }

  if (isLoading) {
    return (
      <div className="container py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-forest">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <div className="container py-6 px-4">
        <Button
          variant="outline"
          className="mb-6 border-forest/20 text-forest hover:bg-pastel-blue/30"
          onClick={() => router.push("/")}
        >
          ← Back to Available Jobs
        </Button>
        <Card className="mb-6 bg-pastel-blue/30 border-none shadow-sm">
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-xl font-medium text-forest mb-2">Job not found</h2>
              <p className="text-forest/70 mb-6">The job you're looking for doesn't exist or has been removed.</p>
              <Button className="bg-forest hover:bg-forest-light text-cream" onClick={() => router.push("/")}>
                Browse Available Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="container py-6 px-4">
        <Button
          variant="outline"
          className="mb-6 border-forest/20 text-forest hover:bg-pastel-blue/30"
          onClick={() => router.push("/")}
        >
          ← Back to Available Jobs
        </Button>

        <Card className="mb-6 bg-pastel-blue/30 border-none shadow-card hover:shadow-card-hover transition-all duration-200">
          <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-forest">{jobDetails.title}</CardTitle>
                <CardDescription className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-cream/50 text-forest border-forest/20">
                    {jobDetails.technology}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`inline-time-badge ${getUrgencyColor(jobDetails.urgency)}`}>
                        <span className="time-label">Time:</span>
                        <Clock className="time-icon" />
                        <span className="time-value">{jobDetails.timeRemaining}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">Time remaining to bid on this job</TooltipContent>
                  </Tooltip>
                </CardDescription>
              </div>
              <div className="relative">
                <div className="ribbon-price font-bold py-1 px-3">${jobDetails.price}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-forest">Problem Description</h3>
              <p className="text-forest/80">{jobDetails.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-forest">Repository Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-forest" />
                  <a
                    href={jobDetails.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest hover:underline"
                  >
                    {jobDetails.repositoryUrl}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-cream/50 text-forest border-forest/20">
                    Branch: {jobDetails.branch}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-forest">Relevant Files</h3>
              <div className="space-y-2">
                {jobDetails.relevantFiles.map((file: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-forest/70" />
                    <span className="text-sm text-forest/80">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-5 pb-5">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-forest hover:bg-forest-light text-cream">Place Bid</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-cream border-forest/10">
                <DialogHeader>
                  <DialogTitle className="text-forest">Place Your Bid</DialogTitle>
                  <DialogDescription className="text-forest/70">
                    Submit your bid for this job. Be competitive but fair with your pricing.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bid-amount" className="text-forest">
                      Bid Amount ($)
                    </Label>
                    <Input
                      id="bid-amount"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="bg-pastel-peach/30 border-pastel-peach/50 text-forest"
                    />
                  </div>

                  {/* New Penalty Amount field */}
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="penalty-amount" className="text-forest">
                        Penalty ($)
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <AlertCircle className="h-4 w-4 text-forest/70" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[250px]">
                          Amount you agree to pay if work is not completed satisfactorily
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="penalty-amount"
                      type="number"
                      value={penaltyAmount}
                      onChange={(e) => setPenaltyAmount(e.target.value)}
                      placeholder="Amount you'll pay if work isn't satisfactory"
                      className="bg-pastel-purple/30 border-pastel-purple/50 text-forest"
                    />
                    <p className="text-xs text-forest/60 mt-1">
                      This amount will be charged if you fail to deliver as promised
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="estimated-time" className="text-forest">
                      Estimated Completion Time
                    </Label>
                    <Select value={estimatedTime} onValueChange={setEstimatedTime}>
                      <SelectTrigger
                        id="estimated-time"
                        className="bg-pastel-green/30 border-pastel-green/50 text-forest"
                      >
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-cream border-pastel-green/50">
                        <SelectItem value="1hr">1 hour</SelectItem>
                        <SelectItem value="2hr">2 hours</SelectItem>
                        <SelectItem value="4hr">4 hours</SelectItem>
                        <SelectItem value="8hr">8 hours</SelectItem>
                        <SelectItem value="1d">1 day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="proposal" className="text-forest">
                      Brief Proposal
                    </Label>
                    <Textarea
                      id="proposal"
                      placeholder="Explain how you'll approach this problem..."
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      className="bg-pastel-yellow/30 border-pastel-yellow/50 text-forest"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmitBid} className="bg-forest hover:bg-forest-light text-cream">
                    Submit Bid
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}
