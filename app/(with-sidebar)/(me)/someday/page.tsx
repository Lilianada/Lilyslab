import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import React from "react";

export default function SomedayPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 ">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Someday</h1>
        <p className="text-sm text-zinc-500">
          This is a{" "}
          <a href="https://someday.page/" className="text-extra-lavender">
            Someday page
          </a>
          , a movement started by
          <a
            href="https://alexandersandberg.com/someday/"
            className="text-extra-lavender"
            target="_blank"
          >
            {" "}
            Alexander Sandberg
          </a>
          . 
        </p>
      </header>

      <div className="space-y-6">
        <div className="text-left">
          <h3 className="text-[15px] font-medium tracking-tight mb-1">
            Someday I hope to be at a job where I am valued and rightly rewarded
            for my efforts.
          </h3>
          <p className="text-[13px]">
            I would actually like to work a job that I enjoy being at and would also like to be rewarded rightly for the efforts I make and for my contributions.

          </p>
        </div>
        <div className="text-left">
          <h3 className="text-[15px] font-medium tracking-tight mb-1">
            Someday I hope to move to a new country and start over.
          </h3>
          <p className="text-[13px]">
            I would actually like to work a job that I enjoy being at and would also like to be rewarded rightly for the efforts I make and for my contributions.

          </p>
        </div>
      </div>

      <Footer
        inspirationName="Alexander Sandberg"
        inspirationUrl="https://alexandersandberg.com/someday/"
        pageName="my someday page"
        color="text-extra-peach"
      />
    </div>
  );
}
