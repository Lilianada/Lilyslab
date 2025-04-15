"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

// Types for our data
interface WorkItem {
  id: string
  company: string
  role: string
  period: string
  description: string
}

interface ProjectItem {
  id: string
  name: string
  description: string
  url: string
}

interface SpeakingItem {
  id: string
  title: string
  date: string
  description: string
  url: string
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [work, setWork] = useState<WorkItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [speaking, setSpeaking] = useState<SpeakingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)

    // Fetch data from Notion
    async function fetchData() {
      try {
        const response = await fetch("/api/homepage-data")

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setWork(data.work || [])
        setProjects(data.projects || [])
        setSpeaking(data.speaking || [])
      } catch (error) {
        console.error("Error fetching homepage data:", error)
        setError("Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className={`max-w-xl space-y-16 grid mx-auto px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      {error ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-red-500 mb-2">Error loading data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : (
        <>
          <section className="stagger-children">
            <div className="w-40 h-40 rounded-full bg-muted border-muted mb-6">
              <Image src="/logo.png" alt="Lily's Lab Logo" className="rounded-full " />
            </div>
            <p className="mb-4 text-base leading-relaxed opacity-0 animate-slide-up">
              Hi there, I'm Lilian. I'm a{" "}
              <Link href="https://github.com/lilianokeke" className="text-primary hover:underline">
                MERN-Stack Developer
              </Link>
              ,{" "}
              <Link href="https://www.notion.so/codedbabe/LILIAN-OKEKE-15bf441cd2fd80589088fc3eae7f1418?pvs=4" className="text-primary hover:underline">
                Technical Product Manager
              </Link>
              , and{" "}
              <Link href="/writing" className="text-primary hover:underline">
                Digital Creator
              </Link>
              . I'm currently focused on managing technical and digital products. I combine my technical knowledge from
              working 4 years as a software developer with creative thinking to lead the building and execution of
              products successfully.
            </p>
            <p className="mb-4 text-base leading-relaxed opacity-0 animate-slide-up">
              I help turn creative ideas into real solutions, making sure that the product being built aligns with the
              needs of the target users and business goal.{" "}
            </p>

            <p className="mb-4 text-base leading-relaxed opacity-0 animate-slide-up">
              I am exploring as much <span className="text-primary hover:underline">AI tools</span> as possible, with
              the aim of bringing all my dream apps to life.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-muted-foreground">Work</h2>
            <div className="space-y-4 stagger-children">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-muted rounded"></div>
                  <div className="h-16 bg-muted rounded"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              ) : work.length > 0 ? (
                work.map((item) => (
                  <WorkItemComponent
                    key={item.id}
                    company={item.company}
                    role={item.role}
                    period={item.period}
                    description={item.description}
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No work experience found.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-muted-foreground">Projects</h2>
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
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-muted-foreground">Speaking</h2>
            <div className="space-y-4 stagger-children">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-muted rounded"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              ) : speaking.length > 0 ? (
                speaking.map((item) => (
                  <SpeakingItemComponent
                    key={item.id}
                    title={item.title}
                    event={item.description}
                    date={item.date}
                    url={item.url}
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No speaking engagements found.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-muted-foreground">Online</h2>
            <div className="space-y-2 stagger-children">
              <SocialLink platform="LinkedIn" url="https://linkedin.com/in/lilianada" action="Connect" />
              <SocialLink platform="GitHub" url="https://github.com/lilianokeke" action="Visit" />
              <SocialLink platform="Twitter" url="https://twitter.com/lilian_okeke" action="Follow" />
              <SocialLink platform="Email" url="mailto:lilianokeke.ca" action="Message" />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function SocialLink({ platform, url, action }: { platform: string; url: string; action: string }) {
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

function WorkItemComponent({
  company,
  role,
  period,
  description,
}: {
  company: string
  role: string
  period: string
  description: string
}) {
  return (
    <div className="border-b border-border pb-4 opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium">{company}</h3>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
        <span className="text-xs text-muted-foreground">{period}</span>
      </div>
      <p className="mt-1 text-xs">{description}</p>
    </div>
  )
}

function ProjectItemComponent({
  name,
  description,
  url,
}: {
  name: string
  description: string
  url: string
}) {
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

function SpeakingItemComponent({
  title,
  event,
  date,
  url,
}: {
  title: string
  event: string
  date: string
  url: string
}) {
  return (
    <div className="border-b border-border pb-4 opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
      <h3 className="text-sm font-medium">
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
          {title}
        </a>
      </h3>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{event}</p>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
    </div>
  )
}
