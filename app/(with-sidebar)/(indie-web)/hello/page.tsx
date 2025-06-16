import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import Link from "next/link";
import React from "react";

export default function HelloPage() {
  return (
    <>
      <ScrollProgress
        color="bg-extra-peach"
        height={3}
        glow={true}
        glowColor="rgba(var(--extra-peach), 0.6)"
        glowIntensity="12px"
      />
      <div className="max-w-2xl mx-auto sm:px-4 py-16 ">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Hello</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Created: June 16, 2025</div>
            <div>Last updated: June 16, 2025</div>
            <div>Inspired by: Alastair Johnston</div>
          </div>
        </header>

        <div className="space-y-4 text-sm leading-relaxed font-nitti">
          <p>Hello there friend,</p>
          <p>
            I'm Lily, a software engineer, product manager and personal trainer.
            I am also a digital garden enthusiast, a web developer and a
            minimalist. I love to create, learn and share my knowledge with
            others. This is my hello page, a page on how I prefer to keep in
            touch and why.
          </p>
          <p>
            The fastest way to reach me is via my website{" "}
            <a href="/guestbook" className="text-extra-peach">
              /guestbook
            </a>
            ,{" "}
            <a href="/guestbook" className="text-extra-peach">
              /ask-me-anything
            </a>{" "}
            or webmentions. I get usually excited when someone finds me via my
            website.
          </p>
          <p>
            My preferred means of communication is emails so you can drop me an{" "}
            <a
              href="mail:hello.lilysgarden@gmail.com"
              className="text-extra-peach"
            >
              email
            </a>
            .
          </p>
          <p>I dislike phone calls or texts so those are out of it.</p>
          <p>
            I use{" "}
            <a
              href="https://linkedin.com/in/lilianada"
              className="text-extra-peach"
            >
              LinkedIn
            </a>{" "}
            since I am actively job hunting so this is the second fastest way to
            reach me.
          </p>
          <p>
            I have a{" "}
            <a href="https://x.com/lilian_ada_" className="text-extra-peach">
              Twitter
            </a>{" "}
            account and occassionally interact there. If you're trying to reach
            me urgently then using this is a bad idea because I go days without
            checking it.
          </p>
          <p>
            I have an{" "}
            <a
              href="https://instagram.com/defitcreative"
              className="text-extra-peach"
            >
              Instagram
            </a>{" "}
            account and I'm quite active there since I inconsistently post
            workout videos and tutorials.
          </p>
          <p>
            While I do have a Facebook, Threads and TikTok accounts, I
            absolutely do not use them. Using Instagram kind of requires you to
            still have a Facebook account and I was deceived into opening a
            Threads account. 
            <br />
            As for TikTok, I try to avoid it to reduce my
            screen time. Either way, I do not use them, so if you find me there,
            there's a 99% chance of your message joining the pile of unanswered
            messages.
          </p>
          <p>I am not on Mastodon, Micro.blog or Bluesky.</p>
          <p>
            I do have a Pinterest account that is absolutely not for any kind of
            friendly engagement or interactions. But you can follow me there to
            see my content - @defitcreative.
          </p>
            <p className="text-muted-foreground">
            This page inspired by <a href="https://alastairjohnston.com/introducing-hello-pages/" className="text-extra-peach">Alastair Johnston</a>.
            </p>
        </div>

        <Footer
          inspirationName="Alexander Sandberg"
          inspirationUrl="https://alexandersandberg.com/someday/"
          pageName="my someday page"
          color="text-extra-peach"
        />
      </div>
    </>
  );
}
