"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import AnimatedLogo from "@/components/AnimatedLogo";
import { SocialLink, WorkItemComponent } from "@/components/homepage-items"
import { MusicPlayerWidget } from "@/components/music-player-widget"
import { useEffect as useFooterEffect, useState as useFooterState } from "react";

function FooterWithDateTimeAndLocation() {
  // Use empty initial values to prevent hydration mismatch
  const [dateTime, setDateTime] = useFooterState("");
  const [location, setLocation] = useFooterState("");
  // Add a mounted state to prevent rendering content during SSR
  const [isMounted, setIsMounted] = useFooterState(false);

  useFooterEffect(() => {
    // Set mounted to true once component is mounted on client
    setIsMounted(true);
    
    // Function to update date/time
    const updateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString());
    };
  
    // Initialize and set interval for updating time
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    
    // Set a static location instead of using geolocation
    // This completely avoids the permissions policy violation
    setLocation("Remote, Digital World");
  
    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, []);
  
  // Only render the content on the client side
  if (!isMounted) {
    return <footer className="mt-8 py-4 text-xs text-left text-secondary"></footer>;
  }
  
  return (
    <footer className="mt-8 py-4 text-xs text-left text-secondary">
      <span className="block">Current time: {dateTime}</span>
      <span className="block">Location: {location}</span>
    </footer>
  );
}

interface WorkItem {
  id: string
  company: string
  role: string
  period: string
  description: string
}

interface ProjectItem {
  id: string
  img: string
}


export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [work, setWork] = useState<WorkItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)

    // Fetch data from Obsidian
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
    <>
      <div className={`max-w-xl space-y-12 grid mx-auto sm:x-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {error ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-red-500 mb-2">This section is still under construction.</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <section className="stagger-children">
              <div className="w-20 h-20 mb-6 object-contain">
                <AnimatedLogo />
              </div>
              <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
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
                . This personal website is my cozy corner of the internet — part digital living room, part creative workshop. It’s where I share my work, interests, and curiosities freely, without the noise of algorithms or the pressure to perform.
              </p>
              <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                By day, I manage and build digital products — blending a background in software engineering with product thinking to turn creative ideas into real, user-focused solutions.

              </p>

              <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">

                By night (and most weekends), this space becomes my lab for experimenting with new tools, exploring AI, and bringing dream projects to life one pixel at a time. I hope you enjoy exploring it as much as I’ve enjoyed crafting and tinkering with it.  {" "}
              </p>

              <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                My goal with this site to show how much you can achieve with AI at the intersection of creativity and innovation. We should all strive to work smarter not harder. You don’t have to learn a new skill each time you want to accomplish something. Steal an idea, refine it, tweak it until it becomes new, until it becomes yours. {" "}
              </p>

              <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                <span className="font-semibold text-extra-yellow">Status: </span> Actively looking 
                <br />
                Having taken some time off to recharge and explore, I am looking to get back into it.

                If you are looking for someone whose mission is to demonstrate the vast potential of AI when it’s used as a partner in the creative process, I am always open to chat and make connections, so please do not hesitate to reach out!
              </p>
            </section>

            {/* Music Widget */}
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

            {/* Projects */}
            <section>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">Color Project</h2>

              <div className="flex justify-start">
                {isLoading ? (
                  <div className="animate-pulse flex gap-2 sm:gap-4">
                    <div className="h-20 w-20 sm:h-36 sm:w-36 bg-muted rounded"></div>
                    <div className="h-20 w-20 sm:h-36 sm:w-36 bg-muted rounded"></div>
                    <div className="h-20 w-20 sm:h-36 sm:w-36 bg-muted rounded"></div>
                    <div className="h-20 w-20 sm:h-36 sm:w-36 bg-muted rounded"></div>
                  </div>
                ) : (
                  <div className="animate-pulse grid grid-cols-4 justfy-between gap-2 w-full sm:gap-4">
                    {
                      ["bg-[#FBF3B9]", "bg-[#FFDCCC]", "bg-[#FDB7EA]", "bg-[#B7B1F2]"].map((code, indx) => {
                        return <div key={indx} className={`h-20 w-full sm:h-36 sm:w-36 ${code} rounded`}></div>
                      })
                    }

                  </div>
                )}
              </div>

            </section>

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


            <FooterWithDateTimeAndLocation />
          </>
        )}
      </div>
    </>
  )
}


