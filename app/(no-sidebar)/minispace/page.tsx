import React from "react";

export default function page() {
  return (
    <main className="bg-[#111617] h-screen flex items-center justify-center">
      <section className="w-[95%] max-w-[480px] m-auto space-y-4">
        <p className="leading-4 m-0">
          <strong className="text-2xl font-bold text-zinc-100">Minispace</strong>
          <br />
          <span className="text-zinc-500 text-sm font-serif">
            Nothing is original
            <span className="font-sans text-xs"> but you are.</span>
          </span>
        </p>
        <p className="text-[20px] text-zinc-100 leading-tight">
          We inspire you to surf and explore the internet. Create
          your own mini space.
        </p>

        <p className="text-lg pl-2 border-border border-l-4 text-zinc-100">
          Our aim is to fuel your imagination. We have handpicked the best
          things that can speak to your imagination and creativity, to create
          things that will make you authentic.
        </p>
        <p className="italic text-base text-zinc-500 font-serif">
         The internet gave us an opportunity to find people who live hundreds and thousands of miles away just by clicking a few buttons. Everyone has the chance to create a presence, a space, an identity — to design and refine it, make it their own.
        </p>

        <p className="">
          <a
            href="https://minispace.dev/home"
            className="text-zinc-400 border-b border-dotted text-base font-serif border-zinc-400"
          >
            Explore and learn to create your own experiences.
          </a>
        </p>
      </section>
    </main>
  );
}
