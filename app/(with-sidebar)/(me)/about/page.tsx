"use client";

import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollProgress
        color="bg-lavender"
        height={3}
        glow={true}
        glowColor="rgba(var(--lavender), 0.6)"
        glowIntensity="12px"
      />
      <div
        className={`max-w-2xl w-full mx-auto sm:px-4 pt-16 pb-8 ${
          isLoaded ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">About Me</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: May 8, 2025</div>
            <div>Last updated: Jan 17, 2025</div>
            <div>Inspired by: <a href="https://nicolevanderhoeven.com/about" className="text-lavender">Nicole Vander Hoeven</a></div>
          </div>
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
            <div className="text-justify">
              <div className="space-y-2 mb-6 w-full">
                <img
                  src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJhdTA3NWcwZWptdDN6ejJqeDZ3cTQ1Z3U0Z3pnem8xaTJwdWFmNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ITWHqTA2TtOqA/giphy.gif"
                  alt="A beautiful arrangement of lilies"
                  className="rounded-lg shadow-md h-[450px] w-full object-cover"
                />
              </div>
              
                <h2 className="text-base font-semibold tracking-tight text-lavender">
                  Whoami?
                </h2>
                <p className="mb-3 text-sm opacity-0 leading-normal animate-slide-up pl-2">
                  ⎯ Lily <br />
                  ⎯ 25 yrs <br />
                  ⎯ Female <br />
                  ⎯ Feminist <br />
                  ⎯ Fitness athelete <br />
                  ⎯ Product manager <br />
                  ⎯ Frontent developer <br />
                  ⎯ Lifestyle connoisseur <br />
                  ⎯ Hobbyist <br />
                  ⎯ Business owner <br />
                  ⎯ Avid reader <br />
                  ⎯ Writer <br />
                  ⎯ Digital gardener <br />
                  ⎯ Creator <br />
                  ⎯ AI enthusiast <br />
                  ⎯ Lifelong learner <br />
                  ⎯ This is what I'm doing{" "}
                  <Link href="/now" className="text-lavender underline">
                    Now{" "}
                  </Link>{" "}
                  <br />
                  ⎯ This is what I hope to do{" "}
                  <Link href="/someday" className="text-lavender underline">
                    Someday{" "}
                  </Link>{" "}
                  <br />
                  ⎯ My not so detailed career/job{" "}
                  <Link href="/bucket-list" className="text-lavender underline">
                    bucket list{" "}
                  </Link>{" "}
                  <br />
                  ⎯ I love to code, go to the gym, read and{" "}
                  <Link href="/garden/essays" className="text-lavender underline">
                    write
                  </Link>{" "}
                  <br />
                  ⎯ I like to collect things digitally so check my{" "}
                  <Link href="/bookmarks" className="text-lavender underline">
                    bookmarks{" "}
                  </Link>{" "}
                  <br />
                </p>

              <div className="space-y-3">
                <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                  I love exploring creative coding, frontend design, lifestyle
                  content and sharing what I learn with others. This site is my
                  digital home for projects, notes, experiments, and
                  inspiration.
                </p>
                <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                  By day, I <a href="https://www.lilianada.com/" className="text-lavender underline" >build and manage digital products </a> — blending a
                  background in software engineering with product thinking to
                  turn creative ideas into real, user-focused solutions.
                </p>
                <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                  By night (and most weekends), this space becomes my lab for
                  experimenting with new tools, exploring AI, bringing dream
                  projects to life one pixel at a time, sharing insights about new things I discovered while reading new books, articles or surfing the internet.
                </p>

                <p className="mb-3 text-sm leading-relaxed opacity-0 animate-slide-up">
                  My goal with this site is not just to show how much you can achieve with
                  AI at the intersection of creativity and innovation, but also how much growth is possible when you are intentional about it. We should
                  all strive to work smarter not harder.
                </p>
              </div>


              <div className="mt-4">
                <h2 className="text-base font-semibold tracking-tight text-lavender">
                 My Mantra
                  </h2>
                <p className="mb-3 text-sm leading-normal opacity-0 animate-slide-up">
                  Steal an idea, refine it, tweak it until it becomes new, until it becomes yours.
                </p>
            </div>

              <div className="mt-4">
                <h2 className="text-base font-semibold tracking-tight text-lavender">
                  What's Next?
                  </h2>
                <p className="mb-3 text-sm leading-normal opacity-0 animate-slide-up">
                  Having taken some time off to recharge and explore, I am looking
                  to get back into the capitalist system. If you are looking for someone whose
                  mission is to demonstrate the vast potential of AI when it’s
                  used as a partner in the creative process, I am always open to
                  chat and make connections, so please do not hesitate to reach
                  out!
                </p>
            </div>
            </div>
            <div className=" mt-6 mb-3">
              <h2 className="text-base font-semibold tracking-tight text-lavender">
                  Time to Explore...
              </h2>
             
              <p className="text-sm leading-normal mb-6">
                Other interesting pages that I have put together for you are all
                listed on the  <Link href="/sitemap" className="text-lavender underline">
                    sitemap
                  </Link>{" "}, be sure to scroll to the bottom in order
                not to miss anything.  And if you have any questions for me, you can either email me or use the{" "}
                <Link href="/ask-me-anything" className="text-lavender underline">
                  Ask Me Anything (AMA)
                </Link>{" "}
                page and most importantly I'd love if you leave me a note in my{" "}
                <a href="/guestbook" className="text-lavender underline">
                  Guestbook
                </a>{" "}
                so I'd know you stopped by.

                <br/>
                <br/>

                Many thanks.
              </p>
            </div>

            <Footer/>
          </>
        )}
      </div>
    </>
  );
}
