"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"

// Lazy load components
const AMAForm = lazy(() => import("../../../components/ama/ama-form"));
const AMAQuestionsList = lazy(() => import("./ama-questions-list"));
const AuthSignInModal = lazy(() => import("@/components/auth/auth-sign-in-modal"));

interface Question {
  id: string
  name: string
  email: string
  date: string
  question: string
  response: string
  filename?: string
  photoURL?: string
  dateSubmitted?: string
}

export default function AMAPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    fetchQuestions()
  }, [])

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [submitMessage])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/ask-me-anything")
      const data = await response.json()

      if (response.ok) {
        setQuestions(data.questions || [])
      } else {
        console.error("Failed to fetch questions:", data.error)
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionSubmit = async (question: string, name: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/ask-me-anything", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: user?.email || "",
          question: question,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit question")
      }

      setSubmitMessage({ type: "success", text: "Your question has been submitted successfully!" })
      setShowForm(false)
      await fetchQuestions()
    } catch (error) {
      console.error("Error submitting question:", error)
      setSubmitMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit question. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdminReply = async (questionId: string, replyText: string) => {
    try {
      const response = await fetch("/api/ask-me-anything/admin-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questionId,
          adminResponse: replyText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit reply")
      }

      setSubmitMessage({ type: "success", text: "Your response has been submitted successfully!" })
      await fetchQuestions()
    } catch (error) {
      console.error("Error submitting admin reply:", error)
      setSubmitMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit response. Please try again.",
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch {
      return "Unknown date"
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-medium tracking-tight">Ask Me Anything</h1>
        <p className="text-sm text-muted-foreground">
          Got a question? I'd love to hear from you! Whether it's about my work, interests, or just something random you're curious about.
        </p>
      </div>

      <div className="flex gap-2">
        {!showForm && (
          <button
            onClick={() => {
              if (!user) {
                setIsAuthModalOpen(true)
              } else {
                setShowForm(true)
              }
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
          >
            Ask a Question
          </button>
        )}
        
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {showForm && user && (
        <Suspense fallback={
          <div className="animate-pulse space-y-4 p-4 border rounded-lg">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        }>
          <AMAForm onSubmit={handleQuestionSubmit} isSubmitting={isSubmitting} />
        </Suspense>
      )}

      {submitMessage && (
        <div
          className={`mb-4 text-xs p-3 rounded animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            submitMessage.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-sm font-medium">Previous Questions</h2>
        <Suspense fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        }>
          <AMAQuestionsList 
            questions={questions}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onAdminReply={handleAdminReply}
            formatDate={formatDate}
          />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <AuthSignInModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </Suspense>
    </div>
  )
}
