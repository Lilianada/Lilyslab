"use client"

import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <ScrollProgress
        color="bg-extra-green"
        height={3}
        glow={true}
        glowColor="rgba(var(--extra-green), 0.6)"
        glowIntensity="12px"
      />
      <div className={`max-w-2xl w-full mx-auto md:px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-medium">About me</h1>
          <p className="text-xs text-extra-green">Last updated: May 8, 2025</p>
        </header>

        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-[450px] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
            
            {/* Text paragraphs skeletons */}
            <div className="space-y-6 mb-8">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-[95%]"></div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-[90%]"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-[85%]"></div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-[92%]"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
            
            {/* Footer section skeleton */}
            <div className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-[90%] mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-[80%]"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 text-justify">
              <figure className="space-y-2 mb-6 w-full">
                <img src="/images/about2.jpeg" alt="A beautiful arrangement of lilies" className="rounded-lg shadow-md h-[450px] w-full object-cover" />
                <figcaption className="text-center text-sm text-muted-foreground mt-2">lilies</figcaption>
              </figure>
              <p className="mb-3 text-sm opacity-0 leading-normal mb-6 animate-slide-up">Hi! I’m Lily, a software engineer, digital creator, lifestyle connoisseur, design enthusiast, and lifelong learner. I love exploring creative coding, frontend design, lifestyle content and sharing what I learn with others. This site is my digital home for projects, notes, experiments, and inspiration. </p>

              <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                By day, I build and manage digital products — blending a background in software engineering with product thinking to turn creative ideas into real, user-focused solutions.
              </p>
              <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                By night (and most weekends), this space becomes my lab for experimenting with new tools, exploring AI, and bringing dream projects to life one pixel at a time.
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
            </div>
            <div className=" mt-6">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Time to explore 😃</h2>
              <p className="text-sm leading-normal mb-6">While you're here, be sure to explore all the amazing corners of this space. I suggest you check what I'm currently up to in my <a href="/now" className="text-extra-yellow">Now</a> page and also what I will most likely be doing <a href="/someday" className="text-extra-yellow">Someday</a>.</p>

              <p className="text-sm leading-normal mb-6">
                Other interesting pages that I have put together for you are all listed on the sidebar, be sure to scroll to the bottom in order not to miss anything. And if you have any questions for me, you can either email me or use the <a href="/ask-me-anything" className="text-extra-yellow">Ask Me Anything (AMA)</a> page.
              </p>
            </div>


            <Footer
              inspirationName="Nicole"
              inspirationUrl="https://nicolevanderhoeven.com/about"
              color="text-extra-green"
            />
          </>
        )
        }
      </div>
    </>
  );
}
