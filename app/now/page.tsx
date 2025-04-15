"use client"

import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"

export default function NowPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const lastUpdated = "2025-04-10"

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`max-w-xl mx-auto px-6 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Now</h1>
        <p className="text-xs text-muted-foreground">
          Last updated: {formatDate(lastUpdated)} • Inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            nownownow.com
          </a>
        </p>
      </header>

      <div className="space-y-8 stagger-children">
        <section className="opacity-0 animate-slide-up">
          <h2 className="text-base font-medium mb-3">What I'm working on</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              I'm currently focused on building a new AI-powered financial tool designed to help users simplify
              budgeting, automate savings, optimize debt repayment, and make smarter investment decisions using
              AI-driven financial tools.
            </p>
            <p className="text-sm text-muted-foreground">
              I'm also doing some exploring into using AI powered tools to build and ship web apps fast.
            </p>
          </div>
        </section>

        <section className="opacity-0 animate-slide-up">
          <h2 className="text-base font-medium mb-3">What I'm learning</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              I've been diving deeper into AI and data analysis, particularly focusing on how these technologies can
              enhance user experiences and boost business success.
            </p>
          </div>
        </section>

        <section className="opacity-0 animate-slide-up">
          <h2 className="text-base font-medium mb-3">What I'm reading</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Atomic Habits</strong> by James Clear — An easy and proven way to build good habits that lasts.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Ikigai</strong> by Francesc Miralles and Hector Garcia — The Japanese secret to a long and happy
              life.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Feel-Good Productivity Book</strong> by Ali Abdaal — The three fundamental energizers that make us
              feel good and lead to true productivity.
            </p>
          </div>
        </section>

        <section className="opacity-0 animate-slide-up">
          <h2 className="text-base font-medium mb-3">Where I'm at</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              I'm currently based in Abuja, Nigeria. I plan to travel to Ghana and Tokyo sometime this year.
            </p>
          </div>
        </section>

        <section className="opacity-0 animate-slide-up">
          <h2 className="text-base font-medium mb-3">What I'm excited about</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The intersection of AI and creativity is particularly exciting to me right now. I'm fascinated by how
              these tools can augment human creativity rather than replace it.
            </p>
            <p className="text-xs text-muted-foreground">
              I'm also excited about the growing focus on digital wellbeing and how we can design technology that
              enhances our lives without dominating them.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
