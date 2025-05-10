"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Clock, DollarSign, AlarmClock } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/components/ui/use-toast"

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

// Helper function to get card color
const getCardColor = (index: number) => {
  const colors = [
    "card-pastel-blue",
    "card-pastel-green",
    "card-pastel-peach",
    "card-pastel-yellow",
    "card-pastel-purple"
  ]
  return colors[index % colors.length]
}

export default function Dashboard() {
  const [selectedTechnology, setSelectedTechnology] = useState("All")
  const [priceHighToLow, setPriceHighToLow] = useState(false)
  const [timeLeastToMost, setTimeLeastToMost] = useState(false)
  const [activeSort, setActiveSort] = useState<"price" | "time">("price")
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { toast } = useToast()

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('offer')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform the data to match our UI needs
        const transformedOffers = data.map((offer, index) => ({
          id: offer.id,
          title: offer.title,
          description: offer.description,
          technology: offer.technology,
          price: offer.price,
          timeRemaining: calculateTimeRemaining(offer.deadline),
          timeRemainingHours: calculateTimeRemainingHours(offer.deadline),
          urgency: calculateUrgency(offer.deadline),
          color: getCardColor(index)
        }))

        setOffers(transformedOffers)
      } catch (error) {
        console.error('Error fetching offers:', error)
        toast({
          title: "Error",
          description: "Failed to load offers",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [supabase, toast])

  // Helper function to calculate time remaining
  const calculateTimeRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffHours = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return `${diffHours} hours`
    } else {
      return `${Math.floor(diffHours / 24)} days`
    }
  }

  // Helper function to calculate time remaining in hours
  const calculateTimeRemainingHours = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    return Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60))
  }

  // Helper function to calculate urgency
  const calculateUrgency = (deadline: string) => {
    const hours = calculateTimeRemainingHours(deadline)
    if (hours < 24) return "high"
    if (hours < 72) return "medium"
    return "low"
  }

  // Filter and sort jobs based on selected criteria
  const filteredOffers = offers
    .filter((offer) => selectedTechnology === "All" || offer.technology === selectedTechnology)
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

  if (loading) {
    return (
      <div className="container py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-forest/20 rounded w-1/4"></div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-forest/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
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
          {filteredOffers.map((offer) => (
            <Card
              key={offer.id}
              className={`flex flex-col ${offer.color} border border-forest/10 shadow-card transition-all duration-200 hover:shadow-card-hover group`}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="line-clamp-2 text-forest mb-3">{offer.title}</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[300px]">
                        {offer.title}
                      </TooltipContent>
                    </Tooltip>
                    <CardDescription className="mt-3">
                      <Badge variant="outline" className="bg-cream/50 text-forest border-forest/20">
                        {offer.technology}
                      </Badge>
                    </CardDescription>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`inline-time-badge ${getUrgencyColor(offer.urgency)}`}>
                        <span className="time-label"></span>
                        <Clock className="time-icon" />
                        <span className="time-value">{offer.timeRemaining}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">Time remaining to bid on this job</TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pb-6">
                <p className="text-sm text-forest/80 line-clamp-3">{offer.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-5 pb-5 border-t border-forest/10">
                <div className="relative">
                  <div className="ribbon-price font-bold py-1 px-3">${offer.price}</div>
                </div>
                <Button asChild className="bg-forest hover:bg-forest-light text-cream">
                  <Link href={`/protected/offers/${offer.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
