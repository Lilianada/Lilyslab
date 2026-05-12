"use client";

import { useEffect, useState } from "react";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Footer } from "@/components/layout/footer";

export default function WantsPage() {
  const [mounted, setMounted] = useState(false);

  // Simple array of items with completed status
  const wantsItems = [
    { text: "I want to learn to ride a bike", completed: false },
    { text: "I want to learn to swim", completed: false },
    { text: "I want to go back to sewing but for fun/myself", completed: true },
    { text: "I want to learn to play paddle", completed: true },
    { text: "I want to read 100 books in a year", completed: false },
    { text: "I want to ride myself to the gym and back home (in a car)", completed: true },
    { text: "I want to learn to play tennis", completed: false },
    { text: "I want to go jet skiing", completed: false },
    { text: "I want to learn to install my own weave", completed: false },
    { text: "I want to buy a new phone", completed: false },
    { text: "I want to an iPad", completed: true },
    { text: "I want to a new macbook", completed: false },
    { text: "I want to a mad ass work station", completed: false },
    { text: "I want to own a collection of gym shoes ", completed: false },
    { text: "I want to learn french", completed: false },
    { text: "I want to give a ted talk on a stage", completed: false },
    { text: "I want to take my grandma out of the country on a trip", completed: false },
    { text: "I want to visit Ghana", completed: true },
    { text: "I want to visit South Africa", completed: false },
    { text: "I want to visit Japan, Tokyo, Osaka", completed: false },
    { text: "I want to visit Europe", completed: false },
    { text: "I want to start an audioblog or podcast or something of such", completed: false },
    { text: "I want to learn to code again...", completed: false }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ScrollProgress
        color="bg-steelBlue"
        height={3}
        glow={true}
        glowColor="rgba(var(--steelBlue), 0.6)"
        glowIntensity="12px"
      />
      <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="text-2xl font-medium tracking-tight mb-3">
            100 Things I Want To Do (or have done)
          </h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: April 11, 2026</div>
            <div>Last updated: April 11, 2026</div>
          </div>
        </header>

        <section className="space-y-6">
          <p className="text-sm text-muted-foreground">
            This is a simple list of things I would like to do in the nearest future or in my lifetime. I will keep updating this list as I complete the tasks and add new
            ones. <br />
            <br />
            <span className="text-primary text-xs">
              {" "}
              Completed {
                wantsItems.filter((wants) => wants.completed).length
              } of {wantsItems.length} wants.
            </span>
          </p>
          {wantsItems.map((wants, index) => (
            <div key={index} className="text-sm flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded border ${
                  wants.completed
                    ? "border-primary bg-primary/10"
                    : "border-border"
                } flex items-center justify-center flex-shrink-0`}
              >
                {wants.completed && (
                  <span className="text-xs text-primary">x</span>
                )}
              </div>
              <div
                className={`${
                  wants.completed
                    ? "text-sm line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {wants.text}
              </div>
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </>
  );
}
