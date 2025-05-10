import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MessageSquare } from "lucide-react"
import Link from "next/link"

// Mock data for active jobs
const activeJobs = [
  {
    id: "1",
    title: "Optimize database queries for better performance",
    client: "TechCorp Inc.",
    startedAt: "May 8, 2025",
    timeElapsed: "2 days",
    status: "In Progress",
    unreadMessages: 3,
    color: "card-pastel-green",
  },
  {
    id: "2",
    title: "Implement user authentication system",
    client: "StartupXYZ",
    startedAt: "May 9, 2025",
    timeElapsed: "1 day",
    status: "In Progress",
    unreadMessages: 0,
    color: "card-pastel-blue",
  },
]

export default function ActiveJobsPage() {
  return (
    <div className="container py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-forest">Active Jobs</h1>

      {activeJobs.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2 text-forest">No active jobs</h2>
          <p className="text-forest/70 mb-6">When your bids are accepted, your active jobs will appear here.</p>
          <Button asChild className="bg-forest hover:bg-forest-light text-cream">
            <Link href="/">Browse Available Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeJobs.map((job) => (
            <Card key={job.id} className={`${job.color} border-none shadow-sm`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-forest">{job.title}</CardTitle>
                    <CardDescription className="text-forest/70">Client: {job.client}</CardDescription>
                  </div>
                  <Badge className="bg-pastel-green/50 text-forest border-pastel-green/70">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-forest/80">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Started: {job.startedAt}
                  </div>
                  <div>Time elapsed: {job.timeElapsed}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild className="border-forest/20 text-forest hover:bg-pastel-blue/30">
                  <Link href={`/session/${job.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                    {job.unreadMessages > 0 && (
                      <Badge className="ml-2 bg-forest text-cream">{job.unreadMessages}</Badge>
                    )}
                  </Link>
                </Button>
                <Button asChild className="bg-forest hover:bg-forest-light text-cream">
                  <Link href={`/session/${job.id}`}>Continue Session</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
