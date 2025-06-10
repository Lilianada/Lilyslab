export default function WebringsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-8 text-foreground">
      <h1 className="text-4xl font-bold mb-6 border-b border-accent/30 pb-2"># Webrings</h1>
      
      <div className="border-l-4 border-accent/50 pl-4 py-2 mb-8">
        <p className="mb-2">
          A <a href="https://en.wikipedia.org/wiki/Webring" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">webring↗</a> is a collection of websites made by like-minded folks, usually centered around a topic, aesthetic, or common interest.
        </p>
        <p className="text-muted-foreground">
          — from the <a href="https://safonts.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">safonts↗</a> webring
        </p>
      </div>
      
      <p className="mb-10">
        Here are the webrings my personal website is part of. Click on the arrows to visit my neighbor sites on each ring. Some webrings also lets you visit a random site part of the ring. Pick a ring and you'll be off!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta Ring */}
        <div className="border border-accent/30 bg-accent/5 p-6 rounded">
          <h2 className="text-xl font-medium mb-3">
            <a href="https://meta-ring.hedy.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Meta Ring↗
            </a>
          </h2>
          <p className="mb-6">
            Personal website tinkerers; those with meta pages or <a href="/colophon" className="text-accent hover:underline">colophons↗</a>.
          </p>
          
          <div className="flex items-center justify-between">
            <a 
              href="https://meta-ring.hedy.dev/previous" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Previous site in Meta Ring"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            
            <a 
              href="https://meta-ring.hedy.dev/random" 
              className="text-accent hover:text-accent/80 flex items-center gap-2" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 10 L12 12 L9 10" />
                <path d="M15 14 L12 12 L9 14" />
              </svg>
              Random
            </a>
            
            <a 
              href="https://meta-ring.hedy.dev/next" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Next site in Meta Ring"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* IndieWeb */}
        <div className="border border-accent/30 bg-accent/5 p-6 rounded">
          <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
            <a href="https://indieweb.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              IndieWeb 🕸️↗
            </a>
          </h2>
          <p className="mb-6">
            "For folks adding <a href="https://indieweb.org/building-blocks" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">IndieWeb building blocks↗</a> to their personal websites to find (and be found by) other folks with IndieWeb building blocks on their sites!"
          </p>
          
          <div className="flex items-center justify-between">
            <a 
              href="https://indieweb.org/previous" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Previous site in IndieWeb"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            
            <a 
              href="https://indieweb.org/random" 
              className="text-accent hover:text-accent/80 flex items-center gap-2" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 10 L12 12 L9 10" />
                <path d="M15 14 L12 12 L9 14" />
              </svg>
              Random
            </a>
            
            <a 
              href="https://indieweb.org/next" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Next site in IndieWeb"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Bucketfish Webring */}
        <div className="border border-accent/30 bg-accent/5 p-6 rounded">
          <h2 className="text-xl font-medium mb-3">
            <a href="https://webring.bucketfish.me" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Bucketfish Webring↗
            </a>
          </h2>
          <p className="mb-6">
            A collection of personal websites and creative spaces from around the web.
          </p>
          
          <div className="flex items-center justify-between">
            <a 
              href="https://webring.bucketfish.me/redirect.html?to=prev&name=Lily's Lab" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Previous site in Bucketfish Webring"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            
            <a 
              href="https://webring.bucketfish.me/redirect.html?to=random&name=Lily's Lab" 
              className="text-accent hover:text-accent/80 flex items-center gap-2" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 10 L12 12 L9 10" />
                <path d="M15 14 L12 12 L9 14" />
              </svg>
              Random
            </a>
            
            <a 
              href="https://webring.bucketfish.me/redirect.html?to=next&name=Lily's Lab" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Next site in Bucketfish Webring"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* CSS JOY */}
        <div className="border border-accent/30 bg-accent/5 p-6 rounded">
          <h2 className="text-xl font-medium mb-3">
            <a href="https://css-joy.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              CSS JOY↗
            </a>
          </h2>
          <p className="mb-6">
            CSS enjoyers.
          </p>
          
          <div className="flex items-center justify-between">
            <a 
              href="https://css-joy.com/previous" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Previous site in CSS JOY"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            
            <a 
              href="https://css-joy.com/random" 
              className="text-accent hover:text-accent/80 flex items-center gap-2" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 10 L12 12 L9 10" />
                <path d="M15 14 L12 12 L9 14" />
              </svg>
              Random
            </a>
            
            <a 
              href="https://css-joy.com/next" 
              className="text-accent hover:text-accent/80" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Next site in CSS JOY"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Join a Ring */}
        <div className="border border-dashed border-accent/30 p-6 rounded flex flex-col items-center justify-center text-center bg-transparent hover:bg-accent/5 transition-colors">
          <h2 className="text-xl font-medium mb-3">Join a webring?</h2>
          <p className="mb-4 text-muted-foreground">
            Want to add your site to one of these rings or suggest a new one?
          </p>
          <a 
            href="mailto:lilyslab.gmail.com" 
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <span>Contact me</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-muted-foreground">
        <p>Last updated: June 10, 2025</p>
      </div>
    </div>
  );
}