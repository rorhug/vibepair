export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-forest/20 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-forest/10 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-forest/10 rounded w-2/3 mx-auto"></div>
          <div className="h-10 bg-forest/20 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    </div>
  )
} 