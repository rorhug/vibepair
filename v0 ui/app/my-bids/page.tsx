import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for bids
const myBids = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Fix authentication bug in React application",
    bidAmount: 140,
    status: "Pending",
    timestamp: "2 hours ago",
    estimatedTime: "2 hours",
    color: "card-pastel-blue",
  },
  {
    id: "2",
    jobId: "3",
    jobTitle: "Optimize database queries for better performance",
    bidAmount: 170,
    status: "Accepted",
    timestamp: "1 day ago",
    estimatedTime: "4 hours",
    sessionTime: "Today, 3:00 PM",
    color: "card-pastel-green",
  },
  {
    id: "3",
    jobId: "5",
    jobTitle: "Fix CSS layout issues on mobile devices",
    bidAmount: 85,
    status: "Declined",
    timestamp: "3 days ago",
    estimatedTime: "1 hour",
    color: "card-pastel-peach",
  },
]

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-pastel-green/50 text-forest border-pastel-green/70"
    case "Declined":
      return "bg-pastel-peach/50 text-forest border-pastel-peach/70"
    default:
      return "bg-pastel-yellow/50 text-forest border-pastel-yellow/70"
  }
}

export default function MyBidsPage() {
  return (
    <div className="container py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-forest">My Bids</h1>

      <div className="space-y-4">
        {myBids.map((bid) => (
          <Card key={bid.id} className={`${bid.color} border-none shadow-sm`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-forest">{bid.jobTitle}</CardTitle>
                  <CardDescription className="text-forest/70">
                    Bid: ${bid.bidAmount} • {bid.timestamp}
                  </CardDescription>
                </div>
                <Badge className={getStatusBadgeVariant(bid.status)}>{bid.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-forest/80">
                  Estimated time: {bid.estimatedTime}
                  {bid.sessionTime && (
                    <div className="mt-1 font-medium text-forest">Session scheduled: {bid.sessionTime}</div>
                  )}
                </div>

                {bid.status === "Accepted" && (
                  <Button asChild className="bg-forest hover:bg-forest-light text-cream">
                    <Link href={`/session/${bid.jobId}`}>Join Session</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
