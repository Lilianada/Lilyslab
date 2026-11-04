import Link from "next/link"
import { Home } from "lucide-react"
import { InteractiveFlower } from "@/components/interactive-flower"
import { WanderButton } from "@/components/fun/WanderButton"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-mono animate-fade-in">
      <div className="max-w-md w-full">
        <p className="text-xs text-muted-foreground mb-2">404 ✳︎ bed not found</p>
        <h1 className="text-2xl font-medium tracking-tight mb-3">Nothing's planted here.</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This corner of the garden is just soil. Maybe the page moved, or maybe it never grew at all. You could plant
          something while you're here.
        </p>

        <InteractiveFlower />

        <div className="flex items-center gap-4 mt-6 text-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-codeRed hover:italic">
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <span className="text-muted-foreground">or</span>
          <WanderButton variant="link" />
        </div>
      </div>
    </div>
  )
}
