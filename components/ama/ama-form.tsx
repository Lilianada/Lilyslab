"use client";

import { useState } from "react";
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
import { X } from "lucide-react";
import { Card } from "../ui/card";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(1000, "Question is too long (max 1000 characters)"),
  spam_check: z
    .string()
    .refine((val) => val === "7", {
      message: 'Please solve the simple math problem to verify you are human',
    })
    .transform((val) => val as string),
});

type FormData = {
  name: string;
  email: string;
  question: string;
  spam_check: string;
};

interface AMAFormProps {
  showForm: boolean;
  onShowFormChange: (show: boolean) => void;
  onSubmitSuccess: () => void;
  onSubmitError: (message: string) => void;
}

export default function AMAForm({ 
  showForm, 
  onShowFormChange, 
  onSubmitSuccess, 
  onSubmitError 
}: AMAFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      question: "",
      spam_check: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ask-me-anything", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        form.reset();
        onSubmitSuccess();
      } else {
        onSubmitError(result.error || "Failed to submit question. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      onSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!showForm) return null;

  return (
    <Card className="p-6 mb-8 border shadow-sm">
        <div className="animate-in fade-in slide-in-from-top-5 duration-300">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Submit your question</h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onShowFormChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Your email won't be displayed publicly
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Question</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What would you like to ask?" 
                  className="min-h-[100px] resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-xs">
                Be specific and clear. Your question will be displayed publicly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spam_check"
          render={({ field }) => (
            <FormItem>
              <FormLabel> 5 + 2 = ?</FormLabel>
              <FormControl>
                <Input placeholder='Enter the answer' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="transition-all duration-300 hover:shadow-md"
          >
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </Button>
        </div>
      </form>
    </Form>
    </div>
    </Card>
  );
}