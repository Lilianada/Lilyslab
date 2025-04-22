import Link from "next/link"
import { ExternalLink } from "lucide-react"

// Types (can be moved to a central types file later if needed)
export interface WorkItem {
  id: string
  company: string
  role: string
  period: string
  description: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  url: string
}

// Using 'any' for now as the original data source (speaking) might not be correct
export interface ThingItem {
  id: string
  name: string
  description: string
}


export const WorkItemComponent = ({
    company,
    role,
    period,
  }: Omit<WorkItem, 'id' | 'description'>) => { // Exclude unused description for now
    return (
      <div className="flex justify-between items-baseline gap-4  opacity-0 animate-slide-up transition-colors duration-300">
        <div>
          <span className="font-medium text-sm text-foreground">{company}</span>
          <span className="text-sm text-muted-foreground ml-2">{role}</span>
        </div>
        <div className="flex-grow border-b border-neutral-300 dark:border-neutral-700 mx-2 mb-1"></div> 
        <p className="text-sm text-muted-foreground font-mono">{period}</p>
      </div>
    )
  }  

export const ProjectItemComponent = ({
  name,
  description,
  url,
}: Omit<ProjectItem, 'id'>) => {
  return (
    <div className="space-y-6 opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg border p-4 transition-colors hover:bg-accent"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium group-hover:text-primary text-sm">{name}</h3>
          <ExternalLink
            size={16}
            className="text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </a>
    </div>
  )
}

// Renamed from ThingsComponent to avoid conflict
export const ThingItemComponent = ({ name, description }: Omit<ThingItem, 'id'>) => {
  return (
    <div className="opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
      <h3 className="text-sm font-medium">
        {name}
      </h3>
      <p className="text-xs">{description}</p>
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

 {/* Projects */}
          {/* <section>
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">Projects</h2>
            <div className="space-y-4 stagger-children">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-muted rounded"></div>
                  <div className="h-20 bg-muted rounded"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectItemComponent
                    key={project.id}
                    name={project.name}
                    description={project.description}
                    url={project.url}
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No projects found.</p>
              )}
            </div>
          </section> */}