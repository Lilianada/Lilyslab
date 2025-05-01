import { type Tool } from "@/types"
import { ArrowUpRight } from "lucide-react"

interface ToolCardProps extends Pick<Tool, "name" | "description" | "logo" | "platforms" | "url"> {}

export function ToolCard({ name, description, logo, platforms, url }: ToolCardProps) {
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group block rounded-lg border bg-card p-4 transition-all duration-200 hover:border-primary/60 hover:bg-accent/50"
    >
      <ArrowUpRight
        className="absolute top-3 right-3 h-4 w-4 text-muted-foreground opacity-0 scale-75 translate-x-2 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary"
        aria-hidden="true"
      />
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {logo && (
              <div className="h-6 w-6 overflow-hidden rounded-md flex-shrink-0">
                <img src={logo} alt={name} width={24} height={24} loading="lazy" className="h-full w-full object-cover" />
              </div>
            )}
            <h3 className="text-sm font-medium truncate">{name}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
} 