"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { SocialLink } from "@/components/comps/homepage-items";
import { Footer } from "@/components/layout/footer";
import AnimatedLogo from "@/components/comps/AnimatedLogo";
import { MusicPlayerWidget } from "@/components/audio/music-player-widget";
import { TopicsList } from "@/components/comps/topics-list";

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
        <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <div>Created: April 10, 2025</div>
          <div>Last updated: July 2, 2025</div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed font-serif">
          <div className="flex flex-col sm:grid grid-cols-4 gap-4 items-center">
            <div className="col-span-3 space-y-2">
              <p>Hello there friend,</p>
              <p>
                Greetings to you and happy to have you here. You've probably
                landed here from your many web explorations and I am super
                excited to house you for the time you'll be here.
              </p>

              <p>
                Welcome to my digital home and mini space on the internet. My
                name is Lily and I'll be your tour guide for the day. This is a
                space where I'm free to express myself in whatever medium I
                choose. Could be through code, images, sounds, and words.
                There's literally no limit to what I can do here.
              </p>
            </div>
            <span className="col-span-1 flex justify-center w-fit h-fit rounded-md overflow-hidden">
              <img
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajNseDRncnNxd3c3MnBza3d6dWhjandldm5yYjhmaGhkdTZ0Z2xjdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1tOuimUZbIeS4/giphy.gif"
                className="object-contain rounded-md"
                alt=""
              />
            </span>
          </div>

          {/* <p className="font-medium">TL;DR</p> */}

          {/* Music Widget */}
          <div className="py-2">
            <Suspense
              fallback={
                <div className="h-16 bg-muted rounded animate-pulse"></div>
              }
            >
              <MusicPlayerWidget
                imageUrl="/images/lily_flower.jpeg"
                title="Welcome to my digital garden & workshop!"
                artist="Written by Lily, recorded with Play.ai"
              />
            </Suspense>
          </div>

          <p>
            I've put in a lot of thoughts and efforts into building everything
            you see and interact with in this space. I try to make this website
            a living representation of my personal space; small, cozy and with
            lots of depth. Be sure to leave your footprint by signing my{" "}
            <Link href="/guestbook" className="text-codeRed">
              guestbook
            </Link>
            .
          </p>

          <p>
            You should first learn a little more{" "}
            <Link href="/about" className="text-codeRed">
              about me
            </Link>
            , then find out what I'm currently up to at the moment by checking
            the{" "}
            <Link href="/now" className="text-codeRed">
              now
            </Link>{" "}
            page. You can also check to see what I'll like to do{" "}
            <Link href="/someday" className="text-codeRed">
              someday
            </Link>
            , and also my career{" "}
            <Link href="/bucket-list" className="text-codeRed">
              bucket list
            </Link>
            . image
          </p>

          <p>
            I love to create sometimes and this site is my playground, you can
            see that by exploring the tiny projects I've added to my{" "}
            <Link href="/playground" className="text-codeRed">
              playground
            </Link>
            . I also build random projects that I call [[seedlings]] which are
            all linked in my{" "}
            <Link href="/projects" className="text-codeRed">
              projects
            </Link>{" "}
            page. I try to keep{" "}
            <Link href="/logs" className="text-codeRed">
              logs
            </Link>{" "}
            on them, emphasis on 'try'.
          </p>

          <p>
            If you like to read amature musings/writings, check my{" "}
            <Link href="/garden" className="text-codeRed">
              garden
            </Link>
            . I have both{" "}
            <Link href="/garden/writings" className="text-codeRed">
              long form
            </Link>{" "}
            and{" "}
            <Link href="/garden/notes" className="text-codeRed">
              short form
            </Link>{" "}
            content that I have recently planted and still tend to. I even have
            a{" "}
            <Link href="/garden/micro-blog" className="text-codeRed">
              micro-blog
            </Link>{" "}
            to share very random thoughts I have during the course of my day,
            most of these thoughts might or might not have been shared on{" "}
            <a href="https://x.com/lilian_ada_" className="external_link">
              Twitter
            </a>
            .
          </p>

          <TopicsList />
          <p>
            If you'd like to comment on any of my writings or notes, you can now
            do so using web mentions! Just mention my site in your own post or
            reply, and your comment will show up here. And if you prefer to{" "}
            <Link href="/ask-me-anything" className="text-codeRed">
              ask me a question
            </Link>{" "}
            that deserves an answer, then don't hesitate to do so.
          </p>

          <p>
            Asides from the many pages displayed on my sidebar, my footer has
            more links that you can explore. Thanks for stopping by.
            {/* If you're still here at this point,
            then I need your help. I have this little idea that's still a
            seedling and I am a bit confused on what to do or where to go with
            it. You can read about it{" "}
            <Link
              href="/garden/writing/minipsace"
              className="text-codeRed"
            >
              here
            </Link>{" "}
            and leave a comment that can help in shaping this idea for our
            little [[indie-web]] community. */}
          </p>

          <p className="pt-4">This page was hand-written by Lily ❤️.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
