"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
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
const GuestbookForm = lazy(() => import("./guestbook-form"));
const GuestbookEntries = lazy(() => import("./guestbook-entries"));

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

  const handleEntryAdded = (newEntry: GuestbookEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="pb-12 mx-auto w-full max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-4">Guestbook</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Welcome, fellow wanderer! 
            <br />
            <br />
            I absolutely love exploring the web and stumbled upon the charming
            tradition of the Guestbook—it's like leaving a footprint on
            someone's digital garden. If you've found something here that caught
            your eye, I'd be thrilled if you left me a note below. Your words
            will genuinely brighten my day!
            <br />
            <br />
            Do you have a guestbook of your own? Drop your link in the URL
            field—I'd love to pay your corner of the internet a visit and sign
            your guestbook too.
            <br />
            <br />
            Thanks for stopping by and sharing a little bit of yourself.
          </p>
        </div>

        <Card className="border border-border bg-card shadow-sm transition-all">
          <CardHeader>
            <CardTitle className="text-lg">Sign the Guestbook</CardTitle>
            <CardDescription>
              Leave a message for me and future visitors
            </CardDescription>
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
