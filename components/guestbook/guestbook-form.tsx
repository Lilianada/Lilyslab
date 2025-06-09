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

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  url: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .refine(
      (val) => !val || /^https?:\/\/.+\..+/.test(val),
      "Please enter a valid URL starting with http:// or https://"
    ),
  spam_check: z
    .string()
    .refine((val) => val.toLowerCase() === "guestbook", {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
               To help keep this space genuine and spam-free, please type &quot;guestbook&quot; below. 
                        It's a simple way to confirm you're a real person wanting to share something meaningful!
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Sign Guestbook"}
        </Button>
      </form>
    </Form>
  );
}
