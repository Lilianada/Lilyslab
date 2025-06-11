"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { SocialLink } from "@/components/comps/homepage-items";
import { Footer } from "@/components/layout/footer";
import AnimatedLogo from "@/components/comps/AnimatedLogo";
import { MusicPlayerWidget } from "@/components/audio/music-player-widget";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`max-w-2xl space-y-12 grid mx-auto sm:x-6 py-12 ${
        isLoaded ? "animate-fade-in" : "opacity-0"
      }`}
    >
      <section className="space-y-6">
        <div className="w-20 h-20 mb-6 object-contain">
          <AnimatedLogo />
        </div>
        <div className="flex flex-col text-xs text-muted-foreground">
          <div>Created: April, 2025</div>
          <div>Updated: June, 2025</div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>Hi there friend,</p>

          <p>
            Greetings to you and happy to have you here. You've probably landed
            here from your many web explorations and I am super excited to take
            you on a field trip. Buckle up and join the ride!
          </p>

          <p>
            Welcome to my mini space on the internet, a space where I'm free to
            express myself in whatever medium I choose. Could be through code,
            images, sounds, writings, there's literally no limit to what I can
            do here.
          </p>

          <p className="font-medium">TL;DR</p>

          {/* Music Widget */}
          <div className="py-2">
            <Suspense
              fallback={
                <div className="h-16 bg-muted rounded animate-pulse"></div>
              }
            >
              <MusicPlayerWidget
                imageUrl="/images/Headshot1.png"
                title="Welcome to my digital garden & workshop!"
                artist="Written by Lily, recorded with Play.ai"
              />
            </Suspense>
          </div>

          <p>
            I've put in a lot of thoughts and efforts into building everything
            you see and interact with here. I try to make this website a living
            representation of my personal space so see it as my virtual home. So
            after you go round, be sure to leave your footprint by signing my{" "}
            <Link href="/guestbook" className="text-primary dark:text-codeRed">
              guestbook
            </Link>
            .
          </p>

          <p>
            You should first learn a little more{" "}
            <Link href="/about" className="text-primary dark:text-codeRed">
              about me
            </Link>
            , then find out what I'm currently up to at the moment by checking
            the{" "}
            <Link href="/now" className="text-primary dark:text-codeRed">
              now
            </Link>{" "}
            page. If you don't have a now page on your mini space already,
            consider adding one and leave me a link to the page when you sign
            the guestbook.
          </p>

          <p>
            I love to create sometimes and this site is my playground, you can
            see that by exploring the tiny projects I've added to my{" "}
            <Link href="/playground" className="text-primary dark:text-codeRed">
              playground
            </Link>
            . I also build random projects that I call [[seedlings]] which are
            all linked in my{" "}
            <Link href="/projects" className="text-primary dark:text-codeRed">
              projects
            </Link>{" "}
            page. I try to keep{" "}
            <Link href="/logs" className="text-primary dark:text-codeRed">
              logs
            </Link>{" "}
            on them, emphasis on 'try'.
          </p>

          <p>
            If you like to read amature musings/writings, check my{" "}
            <Link href="/garden" className="text-primary dark:text-codeRed">
              garden
            </Link>
            . I have both{" "}
            <Link
              href="/garden/writings"
              className="text-primary dark:text-codeRed"
            >
              long form
            </Link>{" "}
            and{" "}
            <Link
              href="/garden/notes"
              className="text-primary dark:text-codeRed"
            >
              short form
            </Link>{" "}
            content that I have recently planted and still tend to. I even have
            a{" "}
            <Link
              href="/garden/threads"
              className="text-primary dark:text-codeRed"
            >
              micro-blog
            </Link>{" "}
            to share very random thoughts I have during the course of my day,
            most of these thoughts might or might not have been shared on{" "}
            <a href="https://x.com/lilian_ada_" className="external_link">
              Twitter
            </a>
            .
          </p>

          <p>Here are a few of my favourite seedlings and ...:</p>

          <ul className="space-y-1 pl-6 list-none">
            <li className="flex items-center gap-1">
              <span className="text-primary dark:text-codeRed">-&gt;</span>
              <Link
                href="/garden/writings"
                className="text-primary dark:text-codeRed"
              >
                a random topic
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <span className="text-primary dark:text-codeRed">-&gt;</span>
              <Link
                href="/garden/writings"
                className="text-primary dark:text-codeRed"
              >
                a random topic
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <span className="text-primary dark:text-codeRed">-&gt;</span>
              <Link
                href="/garden/writings"
                className="text-primary dark:text-codeRed"
              >
                a random topic
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <span className="text-primary dark:text-codeRed">-&gt;</span>
              <Link
                href="/garden/writings"
                className="text-primary dark:text-codeRed"
              >
                a random topic
              </Link>
            </li>
          </ul>

          <p>
            If you'd like to comment on any of my writings or notes, I have a
            comment modal that you can access by clicking the comment icon
            randomly placed on the different pages. And if you prefer to{" "}
            <Link
              href="/ask-me-anything"
              className="text-primary dark:text-codeRed"
            >
              ask me a question
            </Link>{" "}
            that deserves an answer, then don't hesitate to do so.
          </p>

          <p>
            Asides from the many pages displayed on my sidebar, my footer has
            more links that you can explore. If you're still here at this point,
            then I need your help. I have this little idea that's still a
            seedling and I am a bit confused on what to do or where to go with
            it. You can read about it{" "}
            <Link
              href="/garden/writing/minipsace"
              className="text-primary dark:text-codeRed"
            >
              here
            </Link>{" "}
            and leave a comment that can help in shaping this idea for our
            little [[indie-web]] community.
          </p>

          <p className="pt-4 dark:text-codeRed">
            This page was hand-written by Lily ❤️.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
