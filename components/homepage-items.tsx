import { ExternalLink } from "lucide-react"

// Types (can be moved to a central types file later if needed)
export interface WorkItem {
  id: string
  company: string
  role: string
  period: string
  description: string
}


export const WorkItemComponent = ({
  company,
  role,
  period,
}: Omit<WorkItem, 'id' | 'description'>) => { // Exclude unused description for now
  return (
    <div className="flex justify-between items-center gap-4  opacity-0 animate-slide-up transition-colors duration-300">
      <div className="flex">
        <span className="font-medium text-sm text-foreground">{company}</span>
        <span className="hidden sm:flex text-sm text-muted-foreground ml-2">{role}</span>
      </div>
      <div className="flex-grow border-b border-border mx-2 mb-1"></div>
      <p className="text-xs sm:text-sm text-muted-foreground font-mono">{period}</p>
    </div>
  )
}

export const SocialLink = ({ platform, url, action }: { platform: string; url: string; action: string }) => {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
      <span className="text-xs">{platform}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-primary hover:underline group"
      >
        {action}
        <ExternalLink
          size={12}
          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
        />
      </a>
    </div>
  )
}
