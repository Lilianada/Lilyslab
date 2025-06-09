import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webrings | Lily's Lab",
  description: "Join me in exploring the interconnected web through curated webrings",
};

export default function WebringsPage() {
  return (
    <div className="container max-w-4xl py-8 px-4 md:px-8">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Webrings</h1>
        <p className="text-xl text-muted-foreground">
          Discovering the interconnected web through curated communities
        </p>
      </header>
      
      <section className="mb-12 prose dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground">
          Webrings are a beautiful throwback to the early days of the internet—a way of connecting like-minded websites together in a ring. 
          By joining webrings, I'm participating in community-curated discovery and helping to rebuild the personal, interconnected web.
        </p>
      </section>
      
      <div className="space-y-12">
        {/* Meta Ring */}
        <WebringCard
          title="Meta Ring"
          description="A webring that connects digital gardens, personal wikis, and other thinking tools on the web."
          url="https://meta-ring.hedy.dev/"
          previousUrl="https://meta-ring.hedy.dev/previous"
          randomUrl="https://meta-ring.hedy.dev/random"
          nextUrl="https://meta-ring.hedy.dev/next"
          accentColor="from-blue-500/10 to-indigo-500/10"
        />
        
        {/* Bucketfish Webring */}
        <WebringCard
          title="Bucketfish Webring"
          description="A collection of personal websites and creative spaces from around the web."
          url="https://webring.bucketfish.me"
          previousUrl="https://webring.bucketfish.me/redirect.html?to=prev&name=Lily's Lab"
          randomUrl="https://webring.bucketfish.me/redirect.html?to=random&name=Lily's Lab"
          nextUrl="https://webring.bucketfish.me/redirect.html?to=next&name=Lily's Lab"
          accentColor="from-teal-500/10 to-emerald-500/10"
        />
      </div>
      
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">What are webrings?</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Webrings are a way to discover websites with similar content by linking them together in a circular fashion. 
            Popular in the late 90s, they're making a comeback as people seek alternatives to algorithm-driven discovery.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Why join webrings?</h3>
          <ul className="space-y-2 list-disc pl-5">
            <li>Discover like-minded websites and creators</li>
            <li>Be part of intentional communities rather than algorithmic recommendations</li>
            <li>Support the decentralized, human-curated web</li>
            <li>Connect with others who share your interests and values</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Want to add Lily's Lab to your webring?</h3>
          <p>
            If you maintain a webring and think Lily's Lab would be a good fit, feel free to 
            <Link href="/contact" className="text-accent hover:underline"> reach out</Link>. I'm always interested in joining thoughtful communities.
          </p>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>Last updated: 2025-06-09</p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface WebringCardProps {
  title: string;
  description: string;
  url: string;
  previousUrl: string;
  randomUrl: string;
  nextUrl: string;
  accentColor?: string;
}

function WebringCard({ 
  title, 
  description, 
  url, 
  previousUrl, 
  randomUrl, 
  nextUrl,
  accentColor = "from-accent/5 to-accent/20"
}: WebringCardProps) {
  return (
    <div className={`rounded-lg border border-accent/20 overflow-hidden bg-gradient-to-r ${accentColor}`}>
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-medium mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="flex items-center justify-between mb-6">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <span>Visit Webring</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l9.2-9.2M17 17V7H7"/>
            </svg>
          </a>
        </div>
        
        {/* Navigation Controls */}
        <div className="p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-accent/10 flex items-center justify-between">
          <a 
            href={previousUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span>Previous</span>
          </a>
          <a 
            href={randomUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16.003v-6h-6M3 7.997v6h6M16 21.003l-4-4-4 4M16 2.997l-4 4-4-4"/>
            </svg>
            <span>Random</span>
          </a>
          <a 
            href={nextUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors flex items-center gap-1"
          >
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
        
        {/* HTML Code Snippet */}
        <div className="mt-6">
          <details className="group">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7 8 10 8-10 8"></path>
                </svg>
                Show HTML code for embedding
              </span>
            </summary>
            <div className="mt-3 p-3 bg-background rounded-md border border-accent/10 overflow-x-auto text-xs">
              <pre className="text-muted-foreground">
                {title === "Meta Ring" ? 
                  `<p style="text-align: center;">
  This site is part of the <a href="https://meta-ring.hedy.dev/">Meta Ring</a>:<br/>
  [<a href="https://meta-ring.hedy.dev/previous">← Previous</a>]
  [<a href="https://meta-ring.hedy.dev/random">Random</a>]
  [<a href="https://meta-ring.hedy.dev/next">Next →</a>]
</p>` : 
                  `<!-- Bucketfish Webring -->
<p style="text-align: center;">
  This site is part of the <a href="https://webring.bucketfish.me/">Bucketfish Webring</a>:<br/>
  [<a href="https://webring.bucketfish.me/redirect.html?to=prev&name=Lily's Lab">← Previous</a>]
  [<a href="https://webring.bucketfish.me/redirect.html?to=random&name=Lily's Lab">Random</a>]
  [<a href="https://webring.bucketfish.me/redirect.html?to=next&name=Lily's Lab">Next →</a>]
</p>`
                }
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}