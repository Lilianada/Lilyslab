import { type Tool } from "@/types"

interface ToolCardProps extends Pick<Tool, "name" | "description" | "logo" | "platforms" | "url"> {}

export function ToolCard({ name, description, logo, platforms, url }: ToolCardProps) {
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border bg-card p-6 transition-all hover:border-primary"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {logo && (
              <div className="h-12 w-12 overflow-hidden rounded-lg">
                <img src={logo} alt={name} className="h-full w-full object-cover" />
              </div>
            )}
            <h3 className="text-lg font-medium">{name}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
} 