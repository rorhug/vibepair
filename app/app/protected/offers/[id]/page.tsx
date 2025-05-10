"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"
import { useUser } from "@/hooks/useUser"

interface Offer {
  id: string
  title: string
  description: string
  technology: string
  price: number
  deadline: string
  created_at: string
}

interface BidForm {
  estimate_minutes: number
  price: number
  proposal: string
  self_penalty: number | null
}

export default function OfferDetails() {
  const params = useParams()
  const { user } = useUser()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<BidForm>({
    estimate_minutes: 0,
    price: 0,
    proposal: "",
    self_penalty: null
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { toast } = useToast()

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const { data, error } = await supabase
          .from('offer')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setOffer(data)
      } catch (error) {
        console.error('Error fetching offer:', error)
        toast({
          title: "Error",
          description: "Failed to load offer details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [params.id, supabase, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          offer_id: params.id,
          user_id: user.id,
          username: user.user_metadata.username || user.email,
          ...formData
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Your bid has been submitted successfully",
      })
    } catch (error) {
      console.error('Error submitting bid:', error)
      toast({
        title: "Error",
        description: "Failed to submit bid",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimate_minutes' || name === 'price' || name === 'self_penalty' 
        ? Number(value) 
        : value
    }))
  }

  if (loading) {
    return (
      <div className="container py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-forest/20 rounded w-1/4"></div>
          <div className="h-64 bg-forest/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="container py-8 px-4">
        <h1 className="text-2xl font-bold text-forest">Offer not found</h1>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Offer Details */}
        <Card className="border border-forest/10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-forest mb-2">{offer.title}</CardTitle>
                <CardDescription className="mt-2">
                  <Badge variant="outline" className="bg-cream/50 text-forest border-forest/20">
                    {offer.technology}
                  </Badge>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-forest/70">
                <Clock className="h-4 w-4" />
                <span>Posted {new Date(offer.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-forest/80">{offer.description}</p>
              <div className="flex items-center gap-2 text-forest/70">
                <DollarSign className="h-4 w-4" />
                <span>Budget: ${offer.price}</span>
              </div>
              <div className="flex items-center gap-2 text-forest/70">
                <Clock className="h-4 w-4" />
                <span>Deadline: {new Date(offer.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bid Form */}
        <Card className="border border-forest/10">
          <CardHeader>
            <CardTitle className="text-2xl text-forest">Submit Your Bid</CardTitle>
            <CardDescription>Fill out the form below to submit your proposal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-forest">
                  Your Price ($)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="bg-cream/50 border-forest/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="estimate_minutes" className="text-sm font-medium text-forest">
                  Estimated Time (minutes)
                </label>
                <Input
                  id="estimate_minutes"
                  name="estimate_minutes"
                  type="number"
                  min="0"
                  required
                  value={formData.estimate_minutes}
                  onChange={handleInputChange}
                  className="bg-cream/50 border-forest/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="proposal" className="text-sm font-medium text-forest">
                  Your Proposal
                </label>
                <Textarea
                  id="proposal"
                  name="proposal"
                  required
                  value={formData.proposal}
                  onChange={handleInputChange}
                  className="bg-cream/50 border-forest/20 min-h-[150px]"
                  placeholder="Describe your approach and why you're the best fit for this job..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="self_penalty" className="text-sm font-medium text-forest">
                  Self-Imposed Penalty ($) - Optional
                </label>
                <Input
                  id="self_penalty"
                  name="self_penalty"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.self_penalty || ""}
                  onChange={handleInputChange}
                  className="bg-cream/50 border-forest/20"
                  placeholder="Amount you'll pay if you don't deliver on time"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-forest hover:bg-forest-light text-cream"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Bid"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 