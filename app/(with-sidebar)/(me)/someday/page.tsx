import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import React from "react";

export default function SomedayPage() {
  return (
    <div className="max-w-2xl mx-auto sm:px-4 pt-16 pb-8 ">
      <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">Someday</h1>
        <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <div>Created: April 10, 2025</div>
          <div>Last updated: June 12, 2025</div>
          <div>Inspired by: Alexander Sandberg</div>
        </div>
      </header>

      <div className="space-y-6">
           <p className="text-sm text-muted-foreground">
          This is a{" "}
          <a href="https://someday.page/" className="text-lavender">
            Someday page
          </a>
          , a movement started by
          <a
            href="https://alexandersandberg.com/someday/"
            className="text-lavender"
            target="_blank"
          >
            {" "}
            Alexander Sandberg
          </a>
          . 
            This page is simply a list of things I'd like to achieve, accomplish, explore, experience, create, learn, and understand someday.
          
        </p>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to be at a job where I am valued and rightly rewarded
            for my efforts.</strong>
          </h3>
          <p className="text-sm">
            I would actually like to work a job that I enjoy being at and would also like to be rewarded rightly for the efforts I make and for my contributions.
          </p>
        </div>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to move to a new country and start over.</strong>
          </h3>
          <p className="text-sm">
            Moving to a new country currently seems scary and intimidaing, but I'll like to actually try that. I have a few places I've thought of living in but I'm not so sure yet because I "do not" like the "fast life". So my current choices are subject to change.
            <br />→ Toronto, Canada
            <br />→ Somewhere in England
            <br />→ Small town in the US
            <br />→ Maybe Finland
          </p>
        </div>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to get my Master's Degree.</strong>
          </h3>
          <p className="text-sm">
            I do not like the concept of very structured learning but since a Master's Program is less than 18 months I honestly would like to get it done.
          </p>
        </div>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to get my PhD.</strong>
          </h3>
          <p className="text-sm">
            During the latter stages of my life, when the kids are a bit grown and don't require me to keep them alive, I will get my PhD. I also do't mind if it happens before then, either way, it is happening.
          </p>
        </div>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to marry the love of my life and enjoy the world together.</strong>
          </h3>
          <p className="text-sm">
            Contrary to the popular phenomenon of what marriage is meant to be, my first reason and priority for being coupled up is to have a companion. Someone to call my own, my friend, my lover, my knight in shinning armour. 
            <br /><br />
            I know that the joy of marriage is procreating, which is good but 'fuck em kids'. 
            <br /><br />
            Okay, jokes aside, it's a full-time job taking care of kids, having a personal life and also having a life with your partner. Children seem like a lot of baggage, many decisions you make will revolve around them most especially at the early stages which seems very happiness threatening.
            <br /><br />
            Either way, I do plan to have kids but I also plan to enjoy my marriage to the fullest, so I guess the best I can do is pray that a lovely man who I can enjoy life with and build a family with finds me.
          </p>
        </div>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to visit all 9 continents of the world.</strong>
          </h3>
          <p className="text-sm">
            This is one goal that I must make sure to achieve. I am not limited by where I am coming from, it doesn't matter to me how many have tried and failed before me. I know. I can and surely I will. One after the other I will mark each continent off my list.
          </p>
        </div>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to start a fashion business.</strong>
          </h3>
          <p className="text-sm">
            In rememberance of the one who thought me everything I know about fashion, the one in whoms footstep I follow, I shall start a fashion business. A business that would supersede all the other fashion businesses that came before me in my family. I will build an empire in rememberance of my Icon 'Maureen'.
          </p>
        </div>
        
        <div className="text-left">
          <h3 className="font-medium tracking-tight mb-1">
            <strong className="font-semibold">Someday I hope to write a book</strong>
          </h3>
          <p className="text-sm">
            I believe everyone should write a book, whether or not you publish it commercially is up to you, but leave something more valuable than money for your generation to come. 
            <br /><br />
            I plan to achieve this by taking notes going forward, keeping <Link href="/daily-logs" className="">daily-logs</Link> of my personal life, <Link href="/garden/writings" className="">writing</Link> about things I'm learning, experiences etc, this will be a very good foundation for a Personal Memoir.
          </p>
        </div>
        
        <div className="text-left mt-10">
          <p className="text-sm text-muted-foreground">To add a <span className="text-lavender">/someday</span> page to your website or join the movement, visit this <a href="https://someday.page/" className="text-lavender">page</a> and be sure to leave a link to your own page when you sign my <Link href="/guestbook" className="">guestbook</Link>.
          </p>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
