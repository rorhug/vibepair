import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibePair - Engineer Bidding Platform",
  description: "Connect with clients and bid on engineering projects",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-forest/10">
              <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-forest">VibePair</span>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="relative text-forest">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-cream p-0">
                      3
                    </Badge>
                  </Button>
                </div>
              </div>
              <div className="container px-4">
                <Tabs defaultValue="available-jobs" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-pastel-blue/30">
                    <TabsTrigger
                      value="available-jobs"
                      asChild
                      className="data-[state=active]:bg-forest data-[state=active]:text-cream"
                    >
                      <Link href="/">Available Jobs</Link>
                    </TabsTrigger>
                    <TabsTrigger
                      value="my-bids"
                      asChild
                      className="data-[state=active]:bg-forest data-[state=active]:text-cream"
                    >
                      <Link href="/my-bids">My Bids</Link>
                    </TabsTrigger>
                    <TabsTrigger
                      value="active-jobs"
                      asChild
                      className="data-[state=active]:bg-forest data-[state=active]:text-cream"
                    >
                      <Link href="/active-jobs">Active Jobs</Link>
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      asChild
                      className="data-[state=active]:bg-forest data-[state=active]:text-cream"
                    >
                      <Link href="/profile">Profile</Link>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
