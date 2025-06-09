"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import AuthSignInModal from "@/components/auth/auth-sign-in-modal"
import AMAForm from "../../../components/ama/ama-form"
import AMAEntries from "../../../components/ama/ama-entries"

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
      setIsLoading(true)
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

  const handleSubmitSuccess = () => {
    setSubmitMessage({ type: "success", text: "Your question has been submitted successfully!" })
    fetchQuestions()
  }

  const handleSubmitError = (message: string) => {
    setSubmitMessage({ type: "error", text: message })
  }

  // Function to handle admin replies to questions
  const handleAdminReply = async (questionId: string, replyText: string) => {
    if (!user || !isAdmin) return

    try {
      setIsSubmitting(true)
      console.log("Submitting admin reply for question:", questionId)
      
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
      
      // Refresh questions after submission
      fetchQuestions()
    } catch (error: any) {
      console.error("Error submitting admin reply:", error)
      setSubmitMessage({ type: "error", text: error.message || "Failed to submit reply" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <AMAForm 
        showForm={showForm}
        onShowFormChange={setShowForm}
        onSubmitSuccess={handleSubmitSuccess}
        onSubmitError={handleSubmitError}
      />

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

      <AMAEntries 
        questions={questions}
        isLoading={isLoading}
        onAdminReply={handleAdminReply}
      />

      {/* We could keep the auth modal for future functionality, but make it optional */}
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
