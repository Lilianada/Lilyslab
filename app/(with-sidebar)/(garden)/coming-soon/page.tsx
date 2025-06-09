 import { Clock, Sprout } from "lucide-react"

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="max-w-md px-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/50 to-primary/20 opacity-75 blur-md"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-md">
              <Sprout size={40} className="text-primary" />
            </div>
          </div>
        </div>
        
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Coming Soon</h1>
        
        <p className="mb-8 text-muted-foreground">
          This section of the digital garden is still being cultivated. 
          Check back soon to see what grows here!
        </p>
        
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
          <Clock size={14} />
          <span>Under Construction</span>
        </div>
      </div>
    </div>
  )
}
