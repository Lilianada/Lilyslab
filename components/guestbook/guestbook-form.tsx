"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  url: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => !val || /^https?:\/\/.+\..+/.test(val),
      "Please enter a valid URL starting with http:// or https://"
    ),
  intro: z
    .string()
    .max(150, "Bio should be at most 150 characters")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  location: z
    .string()
    .max(50, "Location should be at most 50 characters")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  mood: z
    .string()
    .max(30, "Mood should be at most 30 characters")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  song: z
    .string()
    .max(80, "Song name should be at most 80 characters")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  favorite: z
    .string()
    .max(50, "Favorite thing should be at most 50 characters")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  spam_check: z.string().refine((val) => val.toLowerCase() === "guestbook", {
    message: "Please type 'guestbook' to verify you're human",
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long (max 2000 characters)"),
});

interface GuestbookFormProps {
  onEntryAdded: (entry: {
    id: string;
    name: string;
    url?: string;
    email: string;
    intro?: string;
    location?: string;
    mood?: string;
    song?: string;
    favorite?: string;
    message: string;
    created_at: string;
  }) => void;
}

export default function GuestbookForm({ onEntryAdded }: GuestbookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      url: "",
      intro: "",
      location: "",
      mood: "",
      song: "",
      favorite: "",
      spam_check: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your message has been added to the guestbook.",
        });
        form.reset();
        onEntryAdded(result.entry);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Required Fields Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sign My Guestbook</h3>
          
          {/* Required Fields (Name, Email, Website) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      className="bg-background"
                      {...field}
                    />
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
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your email won't be displayed publicly
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
                <FormLabel>Website (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://your-website.com"
                    className="bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Intro (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A brief introduction about yourself"
                    className="bg-background"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will appear as your "about me" section (max 150 chars)
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
                <FormLabel>Message for Lily *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Leave your message here... You can use Markdown formatting!"
                    className="min-h-[120px] bg-background resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can use Markdown formatting (links, **bold**, *italic*, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Fields - Collapsible */}
        <Accordion type="single" collapsible className="border px-4 py-2 rounded-md">
          <AccordionItem value="optional-fields" className="border-none">
            <AccordionTrigger className="text-sm py-2">
              More Y2K Profile Details (Optional)
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Where are you from?"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Mood</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How are you feeling today?"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="song"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currently Listening To</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What song/artist are you enjoying?"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="favorite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite Thing</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's something you love?"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Bot Protection */}
        <FormField
          control={form.control}
          name="spam_check"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bot Protection: Type "guestbook" below *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Type 'guestbook' here"
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                To help keep this space genuine and spam-free, please type "guestbook" below.
                It's a simple way to confirm you're a real person wanting to share something meaningful!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "✩ Sign Guestbook ✩"}
        </Button>
      </form>
    </Form>
  );
}