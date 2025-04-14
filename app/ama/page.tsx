"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { formatDate } from "@/lib/utils"
import AuthSignInModal from "@/components/auth-sign-in-modal"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
// First, import the Crown icon and update the useAuth destructuring
import { MessageSquare, X, Crown } from "lucide-react"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"

interface Question {
  id: string
  name: string
  email?: string
  photoURL?: string
  question: string
  dateSubmitted: string
  status: string
  answer?: string
}

export default function AMAPage() {
  // Auth state
  const { user, isAdmin } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [question, setQuestion] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    setIsLoaded(true)
    fetchQuestions()
  }, [])

  // Clear message after timeout
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null)
      }, 5000) // 5 seconds timeout

      return () => clearTimeout(timer)
    }
  }, [submitMessage])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching AMA questions...")
      const response = await fetch("/api/ama")

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Fetched questions:", data)
      setQuestions(data.questions || [])
    } catch (error) {
      console.error("Error fetching questions:", error)
      setSubmitMessage({ type: "error", text: "Failed to load questions. Please refresh the page." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !user) return

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      console.log("Submitting question:", { name: user.displayName, email: user.email, question })
      const response = await fetch("/api/ama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          question,
        }),
      })

      console.log("Submission response status:", response.status)
      const data = await response.json()
      console.log("Submission response data:", data)

      if (response.ok) {
        setQuestion("")
        setShowForm(false)
        setSubmitMessage({ type: "success", text: "Your question has been submitted successfully!" })
        // Fetch updated questions
        fetchQuestions()
      } else {
        setSubmitMessage({ type: "error", text: data.error || "Failed to submit question. Please try again." })
      }
    } catch (error) {
      console.error("Error submitting question:", error)
      setSubmitMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAskButtonClick = () => {
    if (user) {
      setShowForm(true)
    } else {
      setIsAuthModalOpen(true)
    }
  }

  // Add the function to handle admin replies to questions
  const handleAdminReply = async (questionId: string, replyText: string) => {
    if (!user || !isAdmin) return

    try {
      const response = await fetch(`/api/ama/${questionId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: replyText,
          adminEmail: user.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit reply")
      }

      setSubmitMessage({ type: "success", text: "Your answer has been submitted successfully!" })
      // Fetch updated questions
      fetchQuestions()
    } catch (error) {
      console.error("Error submitting admin reply:", error)
      setSubmitMessage({ type: "error", text: `Failed to submit reply: ${error.message}` })
    }
  }

  return (
    <div className={`max-w-xl mx-auto ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <header className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-medium">Ask Me Anything</h1>
          <Button
            onClick={handleAskButtonClick}
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full flex items-center justify-center"
          >
            <MessageSquare size={16} />
            <span className="sr-only">Ask a question</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Have a question about design, engineering, or my work? Ask away!
        </p>
      </header>

      {showForm && user && (
        <section className="mb-8 rounded-lg border p-4 animate-fade-in bg-white dark:bg-background">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Ask a question</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="h-6 w-6 rounded-full p-0">
              <X size={14} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2">
              {user?.photoURL && (
                <Image
                  src={user.photoURL || "/placeholder.svg"}
                  alt={user.displayName || "User"}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
              <span className="text-xs text-muted-foreground">{user.displayName}</span>
            </div>
            <div>
              <Textarea
                placeholder="What would you like to know?"
                className="min-h-[100px] text-xs resize-none bg-white dark:bg-black"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs">
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </Button>
            </div>
          </form>
        </section>
      )}

      {submitMessage && (
        <div
          className={`mb-4 text-xs p-3 rounded animate-fade-in ${
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
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-4 stagger-children">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="space-y-1 rounded-lg border p-4 opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {q.photoURL ? (
                      <Image
                        src={q.photoURL || "/placeholder.svg"}
                        alt={q.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/20"></div>
                    )}
                    <h3 className="text-xs font-medium">{q.name}</h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {q.dateSubmitted ? formatDate(q.dateSubmitted) : "Unknown date"}
                  </span>
                </div>
                <p className="text-xs">{q.question}</p>

                {isAdmin && !q.answer && (
                  <div className="mt-3 pt-2 border-t">
                    <Disclosure>
                      <DisclosureButton className="py-1 px-2 text-[10px] rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/40 flex items-center">
                        <Crown size={12} className="mr-1" /> Answer as Admin
                      </DisclosureButton>
                      <DisclosurePanel className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md animate-fade-in">
                        <AdminReplyForm questionId={q.id} onSubmit={handleAdminReply} />
                      </DisclosurePanel>
                    </Disclosure>
                  </div>
                )}

                {q.answer ? (
                  <div className="mt-2 pt-2 border-t">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Crown size={12} className="mr-1 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Admin Response</span>
                      </div>
                      <p className="text-xs">{q.answer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground italic">This question is awaiting an answer.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-sm text-muted-foreground">No questions yet. Be the first to ask!</p>
          </div>
        )}
      </section>

      {/* Custom Auth Modal */}
      <AuthSignInModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false)
          setShowForm(true)
        }}
      />
    </div>
  )
}

// Add the AdminReplyForm component inside the file
interface AdminReplyFormProps {
  questionId: string
  onSubmit: (id: string, text: string) => Promise<void>
}

function AdminReplyForm({ questionId, onSubmit }: AdminReplyFormProps) {
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(questionId, replyText)
      setReplyText("")
    } catch (error) {
      console.error("Error in admin reply form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <Textarea
          placeholder="Write your answer..."
          className="min-h-[100px] text-xs resize-none bg-white dark:bg-black"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setReplyText("")} className="text-[10px] h-7">
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="text-[10px] h-7 bg-purple-500 hover:bg-purple-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>
    </form>
  )
}
