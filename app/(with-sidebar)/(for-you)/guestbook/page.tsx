"use client";

import Link from "next/link";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

// Lazy load form-related components and validation
const GuestbookForm = lazy(
  () => import("@/components/guestbook/guestbook-form")
);
const GuestbookEntries = lazy(
  () => import("@/components/guestbook/guestbook-entries")
);

interface GuestbookEntry {
  id: string;
  name: string;
  url?: string;
  date: string;
  message: string;
}

const GUESTBOOKS_SIGNED = [
  { name: "Barry Hess", url: "https://guestbook.aaronparecki.com/" },
  { name: "Manuel Moreale", url: "https://manuelmoreale.com/guestbook" },
  { name: "Eva", url: "https://eva.town/guestbook" },
  { name: "Kinduff", url: "https://kinduff.com/guest-book/" },
  { name: "David Umoru", url: "https://davidumoru.me/guestbook" },
  { name: "Liz", url: "https://binarydigit.city/guestbook/" },
  { name: "Riri", url: "https://riri.my/blog.php" },
  { name: "Vhbelvadi", url: "https://vhbelvadi.com/guestbook" },
  { name: "Leanrada", url: "https://leanrada.com/guestbook" },
  { name: "Lina", url: "https://amalinalai.github.io/precipice/guestbook/" },
  { name: "Eileen", url: "https://eileenramos.com/guestbook/" },
  { name: "Meadow", url: "https://meadow.cafe/guestbook/" },
  { name: "Bechnokid", url: "https://bechnokid.neocities.org/guestbook/" },
  { name: "Flowerinbinary", url: "https://flowerinbinary.atabook.org/?page=1" },
];

const TAB = "absolute rounded-md border px-3 py-1 text-xs font-medium";

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch guestbook entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("/api/guestbook");
        const data = await response.json();

        if (data.entries) {
          setEntries(data.entries);
        }
      } catch (error) {
        console.error("Failed to fetch guestbook entries:", error);
        toast({
          title: "Error",
          description:
            "Failed to load guestbook entries. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []); // Remove toast dependency to prevent infinite loop

  // On phones the form opens far below the button, so bring it into view.
  useEffect(() => {
    if (isSigning) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isSigning]);

  const handleEntryAdded = (entry: {
    id: string;
    name: string;
    url?: string;
    email: string;
    message: string;
    created_at: string;
  }) => {
    // Map the received entry to GuestbookEntry format
    const newEntry: GuestbookEntry = {
      id: entry.id,
      name: entry.name,
      url: entry.url,
      date: entry.created_at,
      message: entry.message,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setIsSigning(false);
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 pb-8 pt-16 sm:px-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="min-w-0">
        <header className="mb-6">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Guestbook</h1>
          <div className="flex flex-col font-mono text-xs text-muted-foreground">
            <div>Created: April 10, 2025</div>
            <div>Last updated: November 5, 2026</div>
          </div>
        </header>

        <p className="mb-3 text-sm">Welcome, fellow wanderer!</p>
        <p className="mb-6 text-sm">
          Happy to have you in my little, well kept and organised corner of the
          amazing internet. I absolutely love exploring the web and stumbled upon
          the charming tradition of the Guestbook. It&rsquo;s like leaving a
          footprint on someone&rsquo;s digital garden. If you&rsquo;ve found
          something here that caught your eye, I&rsquo;d be thrilled if you left
          me a note. Your words will genuinely brighten my day!
        </p>

        <div className="mb-12 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsSigning((signing) => !signing)}
            aria-expanded={isSigning}
            className="rounded-md border border-primary/60 bg-primary/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/50"
          >
            {isSigning ? "Maybe later" : "Sign the guestbook"}
          </button>
          <Link
            href="/ask-me-anything"
            className="rounded-md border border-primary/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20"
          >
            Ask me anything
          </Link>
        </div>

        <section className="relative mb-10 rounded-lg border border-primary/40 bg-primary/5 px-4 pb-4 pt-8">
          <h2 className={`${TAB} -top-3.5 left-4 border-primary/40 bg-card`}>
            Guestbooks I&rsquo;ve signed
          </h2>
          <ul className="flex flex-wrap gap-2">
            {GUESTBOOKS_SIGNED.map((guestbook) => (
              <li key={guestbook.url}>
                <a
                  href={guestbook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md border border-primary/30 bg-card px-2.5 py-1 text-xs transition-colors hover:bg-primary/30"
                >
                  {guestbook.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative rounded-lg border border-primary/40 bg-primary/10 px-5 pb-8 pt-5">
          <p className="text-sm">
            Do you have a guestbook of your own? Drop your link in the website
            field. I&rsquo;d love to pay your corner of the internet a visit and
            sign your guestbook too.
          </p>
          <span className={`${TAB} -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap border-primary/60 bg-card`}>
            I&rsquo;ll sign yours back
          </span>
        </section>
      </div>

      <div className="min-w-0">
        {isSigning && (
          <div ref={formRef} className="mb-8 scroll-mt-20 rounded-xl border border-primary/40 bg-card p-4 sm:p-6">
            <h2 className="mb-4 text-base font-medium">Sign the guestbook</h2>
            <Suspense fallback={<div className="h-96 animate-pulse rounded bg-muted" />}>
              <GuestbookForm onEntryAdded={handleEntryAdded} />
            </Suspense>
          </div>
        )}

        <h2 className="mb-4 text-base font-medium">
         Guests
        </h2>
        <Suspense fallback={null}>
          <GuestbookEntries entries={entries} isLoading={isLoading} />
        </Suspense>
      </div>
    </div>
  );
}
