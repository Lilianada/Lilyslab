"use client"

import { useState } from "react"
import { Crown } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"

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

interface AMAEntriesProps {
  questions: Question[]
  isLoading: boolean
  onAdminReply: (questionId: string, replyText: string) => Promise<void>
}

export default function AMAEntries({ questions, isLoading, onAdminReply }: AMAEntriesProps) {
  const { user, isAdmin } = useAuth()

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch (error) {
      return "Unknown date"
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-sm font-medium">Previous Questions</h2>
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q, id) => (
            <div key={id} className="p-4 border rounded-lg space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-300" data-question-id={q.filename}>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {q.photoURL ? (
                    <Image
                      src={q.photoURL || "/placeholder.svg"}
                      alt={q.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                  )}
                  <h3 className="text-sm font-medium">{q.name}</h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  {q.date || q.dateSubmitted ? formatDate(String(q.date || q.dateSubmitted)) : "Unknown date"}
                </span>
              </div>
              <p className="text-sm">{q.question}</p>

              {isAdmin && q.response === "" && (
                <div className="mt-3 pt-2 border-t">
                  <Disclosure>
                    {({ close }) => (
                      <div className="w-full">
                        <DisclosureButton className="py-1 px-2 text-[10px] rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/40 flex items-center transition-colors duration-300">
                          <Crown size={12} className="mr-1" /> Respond as Admin
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                          <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
                            <AdminReplyForm 
                              questionId={q.filename || ''} 
                              onSubmit={onAdminReply} 
                              onCancel={() => close()}
                            />
                          </div>
                        </DisclosurePanel>
                      </div>
                    )}
                  </Disclosure>
                </div>
              )}

              {q.response && q.response.trim() !== "" ? (
                <div className="mt-2 pt-2 border-t">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <div className="flex items-center mb-1">
                      <Crown size={12} className="mr-1 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Lily's response</span>
                    </div>
                    <p className="text-xs">{q.response}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground italic">This question is awaiting an answer.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg animate-in fade-in duration-300">
          <p className="text-sm text-muted-foreground">No questions yet. Be the first to ask!</p>
        </div>
      )}
    </section>
  )
}

interface AdminReplyFormProps {
  questionId: string
  onSubmit: (id: string, text: string) => Promise<void>
  onCancel?: () => void
}

function AdminReplyForm({ questionId, onSubmit, onCancel }: AdminReplyFormProps) {
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(questionId, replyText)
      setReplyText("")
      // Close the form after successful submission
      if (onCancel) onCancel()
    } catch (error) {
      console.error("Error in admin reply form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setReplyText("")
    if (onCancel) onCancel()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <Textarea
          placeholder="Write your response..."
          className="min-h-[80px] text-xs resize-none bg-white dark:bg-black"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleCancel} 
          className="text-[10px] h-7 transition-all duration-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="text-[10px] h-7 bg-primary hover:bg-extra-lavender transition-all duration-300 hover:shadow-md"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : "Submit Response"}
        </Button>
      </div>
    </form>
  )
}
