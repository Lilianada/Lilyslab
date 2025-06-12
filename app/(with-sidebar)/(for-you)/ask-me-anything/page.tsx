"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import AMAForm  from "@/components/ama/ama-form";
import AMAEntries from "@/components/ama/ama-entries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, MessageSquarePlus } from "lucide-react";

interface Question {
  id: string;
  name: string;
  email: string;
  date: string;
  question: string;
  response: string;
  filename?: string;
  photoURL?: string;
  dateSubmitted?: string;
}

export default function AMAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ask-me-anything");
      const data = await response.json();
      
      if (response.ok) {
        setQuestions(data.questions || []);
      } else {
        console.error("Failed to fetch questions:", data.error);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    setSubmitMessage({ type: "success", text: "Your question has been submitted successfully!" });
    fetchQuestions();
    setShowForm(false); // Close form after successful submission
  };

  const handleSubmitError = (message: string) => {
    setSubmitMessage({ type: "error", text: message });
  };

  // Function to handle admin replies to questions
  const handleAdminReply = async (questionId: string, replyText: string) => {
    if (!user || !isAdmin) return;

    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/ask-me-anything/admin-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questionId,
          adminResponse: replyText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit reply");
      }

      setSubmitMessage({ type: "success", text: "Your response has been submitted successfully!" });
      
      // Refresh questions after submission
      fetchQuestions();
    } catch (error: any) {
      console.error("Error submitting admin reply:", error);
      setSubmitMessage({ type: "error", text: error.message || "Failed to submit reply" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter questions based on active tab
  const filteredQuestions = questions.filter(question => {
    if (activeTab === "answered") return question.response && question.response.trim() !== "";
    if (activeTab === "unanswered") return !question.response || question.response.trim() === "";
    return true; // "all" tab
  });

  // Stats for tabs
  const answeredCount = questions.filter(q => q.response && q.response.trim() !== "").length;
  const unansweredCount = questions.filter(q => !q.response || q.response.trim() === "").length;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
         <header className="mb-8">
          <h1 className="mb-2 text-xl font-medium">Ask Me Anything</h1>
          <div className="flex flex-col text-xs text-muted-foreground font-mono">
            <div>Curious about something? </div>
            <div>Feel free to ask me any question, </div>
            <div>I'll do my best to answer it.</div>
          </div>
          <Button 
            variant="link"
            size="sm"
            className="p-0 text-xs font-mono text-extra-peach hover:underline"
            onClick={() => setShowForm(true)}
            disabled={isSubmitting}
          >
            → Ask a Question
            </Button>
        </header>


      
        {showForm && (
            <AMAForm 
              showForm={showForm}
              onShowFormChange={setShowForm}
              onSubmitSuccess={handleSubmitSuccess}
              onSubmitError={handleSubmitError}
            />
        )}

      {submitMessage && (
        <div
          className={`mb-6 p-4 rounded-md animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-200 dark:border-green-800"
              : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className={`mr-3 rounded-full p-1 ${
            submitMessage.type === "success"
              ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
              : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
          }`}>
            {submitMessage.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {submitMessage.text}
        </div>
      )}

      <div className="space-y-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-end mb-4">
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger value="all" className="text-xs px-3 py-1.5">
                All ({questions.length})
              </TabsTrigger>
              <TabsTrigger value="answered" className="text-xs px-3 py-1.5">
                Answered ({answeredCount})
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="text-xs px-3 py-1.5">
                Pending ({unansweredCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <AMAEntries 
              questions={filteredQuestions}
              isLoading={isLoading}
              onAdminReply={handleAdminReply}
            />
          </TabsContent>
          <TabsContent value="answered" className="mt-0">
            <AMAEntries 
              questions={filteredQuestions}
              isLoading={isLoading}
              onAdminReply={handleAdminReply}
            />
          </TabsContent>
          <TabsContent value="unanswered" className="mt-0">
            <AMAEntries 
              questions={filteredQuestions}
              isLoading={isLoading}
              onAdminReply={handleAdminReply}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}