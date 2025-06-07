"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from '@/components/footer';
import { useToast } from "@/hooks/use-toast"

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.string().length(0)),
  url: z.string().url({ message: "Invalid URL" }).optional().or(z.string().length(0)),
  spam_check: z.string().refine(val => val.toLowerCase() === 'guestbook', {
    message: 'Please enter "guestbook" to prove you are human'
  }),
  message: z.string().min(1, { message: "Message is required" }).max(1000),
})

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      url: "",
      spam_check: "",
      message: "",
    },
  });

  // Fetch guestbook entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/guestbook');
        const data = await response.json();
        
        if (data.entries) {
          setEntries(data.entries);
        }
      } catch (error) {
        console.error('Failed to fetch guestbook entries:', error);
        toast({
          title: "Error",
          description: "Failed to load guestbook entries. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [toast]);

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      // Add new entry to the list
      if (result.entry) {
        setEntries(prev => [result.entry, ...prev]);
      }

      // Reset form
      form.reset();

      // Show success message
      toast({
        title: "Success!",
        description: "Thank you for signing my guestbook!",
      });

    } catch (error) {
      console.error('Error submitting guestbook entry:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="container pb-12 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-4">Guestbook</h1>
          <p className="text-muted-foreground mb-8">
            I have enjoyed surfing the web and finding out about the concept that is a Guestbook was really fascinating to me. 
            If you come across my site and find anything interesting you like, leave me a little message. 
            Your messages will certainly make my entire day.
            <br /><br />
            If you also have a guestbook, be sure to drop it in the url field so that I can sign it as well.
            <br /><br />
            Cheers.
          </p>
        </div>

        <Card className="border border-border bg-card shadow-sm transition-all">
          <CardHeader>
            <CardTitle>Sign the Guestbook</CardTitle>
            <CardDescription>
              Leave a message for me and future visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (not published)</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will not be published
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-website.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your name will link to this URL (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Leave a message..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spam_check"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spam protection</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 'guestbook'" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter the word &quot;guestbook&quot; below, lovely human. We don&apos;t think that the 🤖spam bots🤖 will figure this out. Thank you!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing...' : 'Sign the Guestbook'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Messages</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No messages yet. Be the first to sign!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden border border-border hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="bg-muted/30 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        {entry.url ? (
                          <a 
                            href={entry.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium hover:underline text-primary"
                          >
                            {entry.name}
                          </a>
                        ) : (
                          <span className="font-medium">{entry.name}</span>
                        )}
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {formatDate(entry.date)}
                      </time>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      <p style={{ whiteSpace: 'pre-wrap' }}>{entry.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
