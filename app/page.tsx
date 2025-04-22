"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { ProjectItemComponent, SocialLink, ThingItemComponent, WorkItemComponent } from "@/components/homepage-items"
import { MusicPlayerWidget } from "@/components/music-player-widget"

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

interface ThingsItem {
  id: string
  title: string
}

const thingsILike = [
  {
    id: '1',
    name: 'Coding',
    image: '/coding.png'
  },
  {
    id: '2',
    name: 'Reading',
    image: '/reading.png'
  },
  {
    id: '3',
    name: 'Writing',
    image: '/writing.png'
  },
  {
    id: '3',
    name: 'Writing',
    image: '/writing.png'
  }
]
const thingsIDontLike = [
  {
    id: '1',
    name: 'Coding',
    description: 'I love coding and building things with code.',
    image: '/coding.png'
  }
]

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [work, setWork] = useState<WorkItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [things, setThings] = useState<ThingsItem[]>([])
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
        setThings(data.things || [])
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
    <div className={`max-w-xl space-y-12 grid mx-auto px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      {error ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-red-500 mb-2">Error loading data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : (
        <>
          <section className="stagger-children">
            <div className="w-20 h-20 mb-6 object-contain">
              <Image src="/Didi.png" alt="Lily's Lab Logo" width={200} height={200} />
            </div>
            <p className="mb-4 text-sm leading-relaxed opacity-0 animate-slide-up">
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
            <p className="mb-4 text-sm leading-relaxed opacity-0 animate-slide-up">
              I help turn creative ideas into real solutions, making sure that the product being built aligns with the
              needs of the target users and business goals.{" "}
            </p>

            <p className="mb-4 text-sm leading-relaxed opacity-0 animate-slide-up">
              Currently, I'm exploring as much <span className="text-primary hover:underline">AI tools</span> as possible, with
              the aim of bringing all my dream apps to life.
            </p>
          </section>

          <section>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-muted rounded"></div>
              </div>)
              :
              (<MusicPlayerWidget
                imageUrl="/cover.png"
                title="Aura Phonk"
                artist="Curse Devil"
                lastPlayed="Last played on Apr 22, 09:13 AM WAT"
              />)}
          </section>

          {/* Work */}
          <section>
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">Work</h2>
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
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No work experience found.</p>
              )}
            </div>
          </section>



          {/* Things I like */}
          {/* <section className="grid grid-cols-2">
            <div className="">
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">Things I like</h2>
              <div className="space-y-4 stagger-children">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-muted rounded"></div>
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                ) : (
                  thingsILike.map((item) => (
                    <ThingItemComponent
                      key={item.id}
                      name={item.name}
                    />
                  )))}
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">Things I don't like</h2>
              <div className="space-y-4 stagger-children">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-muted rounded"></div>
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                ) : (
                  thingsIDontLike.map((item) => (
                    <ThingItemComponent
                      key={item.id}
                      name={item.name}
                    />
                  )))}
              </div>
            </div>
          </section> */}

          {/* Things I don't like */}


          {/* Social Links */}
          <section>
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">Online</h2>
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
