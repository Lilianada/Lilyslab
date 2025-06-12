"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";
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

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Guestbook links array
  const guestbooks = [
    {
      name: "Barry Hess's Guestbook",
      url: "https://guestbook.aaronparecki.com/",
    },
    {
      name: "Manuel Moreale's Guestbook",
      url: "https://manuelmoreale.com/guestbook",
    },
    {
      name: "Eva's Guestbook",
      url: "https://eva.town/guestbook",
    },
    {
      name: "Kinduff's Guestbook",
      url: "https://kinduff.com/guest-book/",
    },
    {
      name: "David Umoru's Guestbook",
      url: "https://davidumoru.me/guestbook",
    },
    {
      name: "Liz's Guestbook",
      url: "https://binarydigit.city/guestbook/",
    },
    {
      name: "Riri's Guestbook",
      url: "https://riri.my/blog.php",
    },
    {
      name: "Vhbelvadi's Guestbook",
      url: "https://vhbelvadi.com/guestbook",
    },
    {
      name: "Leanrada's Guestbook",
      url: "https://leanrada.com/guestbook",
    },
    {
      name: "Lina's Guestbook",
      url: "https://amalinalai.github.io/precipice/guestbook/",
    },
    {
      name: "Eileen's Guestbook",
      url: "https://eileenramos.com/guestbook/",
    },
  ];

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
  };

  return (
    <div className="max-w-2xl mx-auto sm:px-4 py-16 ">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Guestbook</h1>
        <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <div>Created: April 10, 2025</div>
          <div>Last updated: June 12, 2025</div>
        </div>
      </header>
      <div>
        <div>
          <p className="text-sm mb-2">
            Welcome, fellow wanderer!
            <br />
            <br />
            Happy to have you in my little, well kept and organised corner of
            the amazing internet. I absolutely love exploring the web and
            stumbled upon the charming tradition of the Guestbook. It’s like
            leaving a footprint on someone’s digital garden. If you’ve found
            something here that caught your eye, I’d be thrilled if you left me
            a note below. Your words will genuinely brighten my day!
            <br />
            <br />
            Do you have a guestbook of your own? Drop your link in the URL
            field—I’d love to pay your corner of the internet a visit and sign
            your guestbook too.
            <br />
            <br />
            Here are some of the guestbooks that I've signed:
          </p>
          <ol className="list-none pl-4 text-sm mb-8">
            {guestbooks.map((guestbook, index) => (
              <li key={index}>
                <span className="mr-2">﹡</span>
                <a
                  href={guestbook.url}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {guestbook.name}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <Card className="border border-border bg-card shadow-sm transition-all">
          <CardHeader>
            <CardTitle className="text-lg">Sign the Guestbook</CardTitle>
            <CardDescription>Leave a message for me</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="animate-pulse space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-24 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </div>
              }
            >
              <GuestbookForm onEntryAdded={handleEntryAdded} />
            </Suspense>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-xl font-medium mb-6">Entries</h2>
          <Suspense
            fallback={
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <GuestbookEntries entries={entries} isLoading={isLoading} />
          </Suspense>
        </div>
      </div>

      <Footer />
    </div>
  );
}
