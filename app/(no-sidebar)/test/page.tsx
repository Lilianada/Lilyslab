'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/');
  };
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-[#faf9f6] relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/noise.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '260px 260px'
      }}
    >
      {/* Texture and subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-100/80 via-transparent to-stone-200/60 pointer-events-none" />
      <main className="relative z-10 w-full flex flex-col items-center px-4">
        {/* Centered container */}
        <section className="w-full max-w-2xl mt-16 mb-12 flex flex-col items-center">
          {/* Title */}
          <h1 className="font-sorts text-4xl md:text-5xl text-stone-800 text-center font-light mb-2 tracking-wide">
            Welcome to
          </h1>
          <h2 className="font-sans text-5xl md:text-6xl text-stone-900 font-bold mb-10 text-center tracking-tight">
            Minispace
          </h2>
          
          {/* Poem */}
          <div className="space-y-7 w-full text-center">
            {/* Stanza 1 */}
            <div className="space-y-1">
              <p className="font-sorts text-xl md:text-2xl text-stone-700">
                Experience the quiet and calm of the internet again.
              </p>
              <p className="font-sorts text-lg md:text-xl text-stone-600">
                Focus fully on what you love most:
              </p>
              <p className="font-sans italic text-base md:text-lg text-stone-800">
                Reading. Writing. Building. Connecting.
              </p>
            </div>
            {/* Stanza 2 */}
            <div className="space-y-1">
              <p className="font-sorts text-lg md:text-xl text-stone-700">
                Get inspired by your neighbours.
              </p>
              <p className="font-sorts text-base md:text-lg text-stone-600">
                Discover the small, thoughtful worlds they’ve made,
              </p>
              <p className="font-sorts text-base md:text-lg text-stone-600">
                and build your own.
              </p>
            </div>
            {/* Stanza 3 */}
            <div className="font-sorts italic text-stone-600 text-base md:text-lg space-y-0.5">
              <div>A space for your musings.</div>
              <div>A space for your ideas.</div>
              <div>A space for your tinkerings.</div>
            </div>
            {/* Stanza 4 */}
            <div className="font-sans text-base md:text-lg text-stone-700 font-light space-y-0.5">
              <div>Write to think.</div>
              <div>Write to learn.</div>
              <div>Write to write better.</div>
            </div>
            {/* Stanza 5 */}
            <div className="font-sorts text-base md:text-lg text-stone-600 space-y-0.5">
              <div>Build something small.</div>
              <div>Build something true.</div>
              <div>Build for you.</div>
              <div>Build for us.</div>
            </div>
            {/* Final line */}
            <div className="pt-2">
              <p className="font-sorts text-sm md:text-base text-stone-500 italic">
                Just like we’ve built this, for you.
              </p>
            </div>
          </div>

          {/* Enter Button */}
          <button
            className="mt-12 px-10 py-3 bg-white/80 border border-stone-300 rounded-full font-sans text-lg text-stone-700 shadow transition hover:bg-white hover:border-stone-400 hover:shadow-lg"
            onClick={handleEnter}
          >
            Enter
          </button>

          {/* Tagline */}
          <p className="mt-8 text-xs font-sans text-stone-400 tracking-widest uppercase">
            A quiet corner of the internet
          </p>
        </section>
      </main>
    </div>
  );
}