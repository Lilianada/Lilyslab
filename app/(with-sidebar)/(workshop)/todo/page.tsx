"use client";

import { useEffect, useState } from "react";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Footer } from "@/components/layout/footer";

export default function TodoPage() {
  const [mounted, setMounted] = useState(false);

  // Simple array of todo items with completed status
  const todoItems = [
    { text: "Redesign home page, make it more personal", completed: false },
    { text: "Update bookshelf page with books I've read.", completed: false },
    { text: "Update Misc page", completed: false },
    {
      text: "Create a /Wants page - under (with-sidebar) with 100 things I want to do in my lifetime.",
      completed: false,
    },
    { text: "Project 365 Days & 100 Days of Pics", completed: false },
    { text: "Add services section to /uses", completed: true },
    { text: "Redesign /notes list", completed: true },
    {
      text: "Write a script that updates changelog folder based on our commit message, only use messages with 'feat:', 'improv:', 'fix:'.",
      completed: false,
    },
    {
      text: "Create y2k browser style card for guestbook entries.",
      completed: true,
    },
    {
      text: "Add a list of topics I'll like to write on to homepage.",
      completed: true,
    },
    {
      text: "Design one markdown renderer as a reusable component round the app. This should help me in writing my essays and notes using just very few markdown styles to keep design or layout uniform.",
      completed: true,
    },
    {
      text: "Stuff - create it with its header under no-sidebar. The design for stuff will be 3x3 grid on available screen size. The stuff grids will have random stuff like Total site visitors, 3 different 88x31 button designs for anyone who wants to mention me on their website to choose from.",
      completed: true,
    },
    {
      text: "/Todo page redesign with this list as its content.",
      completed: true,
    },
    { text: "Update someday page with content.", completed: true },
    {
      text: "Update now page to use the custom markdown renderer component.",
      completed: true,
    },
    { text: "Update Manifesto.", completed: true },
    { text: "Update 'Why I keep a daily log'.", completed: true },
    {
      text: "Create /Archives page with a simple table list of all my past essays/notes.",
      completed: true,
    },
    { text: "Implement web mentions", completed: true },
    { text: "Add an Hello page", completed: true },
    { text: "Change opengraph image", completed: true },
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
            Website Todo List
          </h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: June 10, 2025</div>
            <div>Last updated: June 20, 2025</div>
          </div>
        </header>

        <section className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Features and fixes to implement on my website. This is a simple todo
            list that I use to keep track of what I want to do next on my
            website. I will update this list as I complete tasks and add new
            ones. <br />
            <br />
            <span className="text-primary text-xs">
              {" "}
              Completed {
                todoItems.filter((todo) => todo.completed).length
              } of {todoItems.length} tasks.
            </span>
          </p>
          {todoItems.map((todo, index) => (
            <div key={index} className="text-sm flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded border ${
                  todo.completed
                    ? "border-primary bg-primary/10"
                    : "border-border"
                } flex items-center justify-center flex-shrink-0`}
              >
                {todo.completed && (
                  <span className="text-xs text-primary">x</span>
                )}
              </div>
              <div
                className={`${
                  todo.completed
                    ? "text-sm line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {todo.text}
              </div>
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </>
  );
}
