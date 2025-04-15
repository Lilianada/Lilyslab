import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center">
        <div className="relative h-16 w-16 animate-pulse">
          <Image
            src="/logo.png"
            alt="Loading..."
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="mt-4 h-1 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full animate-progress bg-primary" />
        </div>
      </div>
    </div>
  )
}
