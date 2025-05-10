'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-forest mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button
          onClick={() => reset()}
          className="bg-forest hover:bg-forest/90"
        >
          Try again
        </Button>
      </div>
    </div>
  )
} 