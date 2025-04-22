"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SUGGESTION_TYPES = ["Book", "Movie/Show", "Article", "Tool", "Resource", "Idea", "Other"];

interface SuggestionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestionSidebar({ isOpen, onClose }: SuggestionSidebarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    title: "", // e.g., Book Title, Movie Title, Article Title
    url: "",   // Optional URL
    notes: "", // Why you're suggesting it
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.title) {
        toast({
            title: "Missing Fields",
            description: "Please select a suggestion type and provide a title.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);

    try {
       // TODO: Replace with your actual API endpoint
      console.log("Submitting suggestion:", formData); 
      const response = await fetch("/api/suggestions/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit suggestion");
      }

       // Simulate successful submission for now
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      toast({
        title: "Suggestion Received!",
        description: "Thanks for sharing your suggestion.",
      });

      // Reset form and close sidebar
      setFormData({
        type: "",
        title: "",
        url: "",
        notes: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sm:fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-background border-l shadow-lg animate-in slide-in-from-right duration-300">
      <div className="h-full flex flex-col">
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-50">
          <h2 className="text-lg font-semibold">Make a Suggestion</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close suggestion sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="suggestion-type" className="text-sm font-medium">
              Suggestion Type <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger id="suggestion-type">
                <SelectValue placeholder="Select a type..." />
              </SelectTrigger>
              <SelectContent>
                {SUGGESTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="suggestion-title" className="text-sm font-medium">
              Title / Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="suggestion-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Book title, Movie name, Article heading..."
              required
              maxLength={150}
            />
             <p className="text-xs text-muted-foreground">Max 150 characters.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="suggestion-url" className="text-sm font-medium">
              URL (Optional)
            </label>
            <Input
              id="suggestion-url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="suggestion-notes" className="text-sm font-medium">
              Notes / Why suggest it? (Optional)
            </label>
            <Textarea
              id="suggestion-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any relevant context or why you found it interesting (max 500 characters)"
              maxLength={500}
              className="resize-none"
              rows={5}
            />
            <p className="text-xs text-muted-foreground text-right">
                {formData.notes.length}/500
              </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !formData.type || !formData.title}
          >
            {isSubmitting ? (
                 <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
            ) : (
                 <>
                    <Send size={16} className="mr-2"/> Submit Suggestion
                 </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 