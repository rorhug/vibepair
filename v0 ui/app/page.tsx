"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Clock, DollarSign, AlarmClock } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for available jobs
const availableJobs = [
  {
    id: "1",
    title: "Fix authentication bug in React application",
    description:
      "There's an issue with the authentication flow in our React application. Users are sometimes logged out unexpectedly.",
    technology: "React",
    price: 150,
    timeRemaining: "23 hours",
    timeRemainingHours: 23, // Added for sorting
    urgency: "medium", // new field for urgency level
    color: "card-pastel-blue",
  },
  {
    id: "2",
    title: "Implement payment gateway integration",
    description:
      "We need to integrate Stripe payment gateway into our Node.js application to process customer payments.",
    technology: "Node.js",
    price: 200,
    timeRemaining: "2 days",
    timeRemainingHours: 48, // Added for sorting
    urgency: "low", // new field for urgency level
    color: "card-pastel-green",
  },
  {
    id: "3",
    title: "Optimize database queries for better performance",
    description:
      "Our application is experiencing slow response times due to inefficient database queries. Need help optimizing them.",
    technology: "PostgreSQL",
    price: 180,
    timeRemaining: "1 day",
    timeRemainingHours: 24, // Added for sorting
    urgency: "medium", // new field for urgency level
    color: "card-pastel-peach",
  },
  {
    id: "4",
    title: "Build responsive UI components",
    description: "We need to create several responsive UI components using React and Tailwind CSS for our dashboard.",
    technology: "React",
    price: 120,
    timeRemaining: "3 days",
    timeRemainingHours: 72, // Added for sorting
    urgency: "low", // new field for urgency level
    color: "card-pastel-yellow",
  },
  {
    id: "5",
    title:
      "Fix CSS layout issues on mobile devices - This is a longer title that will get truncated in the UI to demonstrate the hover effect for truncated text",
    description: "Our web application has layout issues on mobile devices. Need help making it fully responsive.",
    technology: "CSS",
    price: 90,
    timeRemaining: "12 hours",
    timeRemainingHours: 12, // Added for sorting
    urgency: "high", // new field for urgency level
    color: "card-pastel-purple",
  },
]

// Technology options for filter
const technologies = ["All", "React", "Node.js", "PostgreSQL", "CSS"]

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

export default function Home() {
  const [selectedTechnology, setSelectedTechnology] = useState("All")
  const [priceHighToLow, setPriceHighToLow] = useState(false)
  const [timeLeastToMost, setTimeLeastToMost] = useState(false)
  const [activeSort, setActiveSort] = useState<"price" | "time">("price")

  // Filter and sort jobs based on selected criteria
  const filteredJobs = availableJobs
    .filter((job) => selectedTechnology === "All" || job.technology === selectedTechnology)
    .sort((a, b) => {
      if (activeSort === "price") {
        return priceHighToLow ? b.price - a.price : a.price - b.price
      } else {
        return timeLeastToMost
          ? a.timeRemainingHours - b.timeRemainingHours
          : b.timeRemainingHours - a.timeRemainingHours
      }
    })

  const handlePriceToggle = (pressed: boolean) => {
    setPriceHighToLow(pressed)
    setActiveSort("price")
  }

  const handleTimeToggle = (pressed: boolean) => {
    setTimeLeastToMost(pressed)
    setActiveSort("time")
  }

  return (
    <TooltipProvider>
      <div className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6 text-forest">Available Jobs</h1>
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto mb-2 sm:mb-0">
              <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                <SelectTrigger className="w-full sm:w-[200px] bg-pastel-blue/30 border-pastel-blue/50 text-forest">
                  <SelectValue placeholder="Technology" />
                </SelectTrigger>
                <SelectContent className="bg-cream border-pastel-blue/50">
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-3">
              <Toggle
                pressed={priceHighToLow}
                onPressedChange={handlePriceToggle}
                aria-label="Toggle price sorting"
                className={`flex items-center gap-2 ${
                  activeSort === "price"
                    ? "bg-pastel-peach/60 hover:bg-pastel-peach/70"
                    : "bg-pastel-peach/30 hover:bg-pastel-peach/40"
                } text-forest`}
              >
                <DollarSign className="h-4 w-4" />
                {priceHighToLow ? "Price: High to Low" : "Price: Low to High"}
              </Toggle>

              <Toggle
                pressed={timeLeastToMost}
                onPressedChange={handleTimeToggle}
                aria-label="Toggle time sorting"
                className={`flex items-center gap-2 ${
                  activeSort === "time"
                    ? "bg-pastel-blue/60 hover:bg-pastel-blue/70"
                    : "bg-pastel-blue/30 hover:bg-pastel-blue/40"
                } text-forest`}
              >
                <AlarmClock className="h-4 w-4" />
                {timeLeastToMost ? "Time: Least to Most" : "Time: Most to Least"}
              </Toggle>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={`flex flex-col ${job.color} border border-forest/10 shadow-card transition-all duration-200 hover:shadow-card-hover group`}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="line-clamp-2 text-forest mb-3">{job.title}</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[300px]">
                        {job.title}
                      </TooltipContent>
                    </Tooltip>
                    <CardDescription className="mt-3">
                      <Badge variant="outline" className="bg-cream/50 text-forest border-forest/20">
                        {job.technology}
                      </Badge>
                    </CardDescription>
                  </div>

                  {/* Improved inline time remaining badge */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`inline-time-badge ${getUrgencyColor(job.urgency)}`}>
                        <span className="time-label"></span>
                        <Clock className="time-icon" />
                        <span className="time-value">{job.timeRemaining}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">Time remaining to bid on this job</TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pb-6">
                <p className="text-sm text-forest/80 line-clamp-3">{job.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-5 pb-5 border-t border-forest/10">
                <div className="relative">
                  <div className="ribbon-price font-bold py-1 px-3">${job.price}</div>
                </div>
                <Button asChild className="bg-forest hover:bg-forest-light text-cream">
                  <Link href={`/protected/offers/${job.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
