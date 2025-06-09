"use client"

import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface AMAFormProps {
  showForm: boolean
  onShowFormChange: (show: boolean) => void
  onSubmitSuccess: () => void
  onSubmitError: (message: string) => void
}

export default function AMAForm({ showForm, onShowFormChange, onSubmitSuccess, onSubmitError }: AMAFormProps) {
  const [question, setQuestion] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const handleAskButtonClick = () => {
    onShowFormChange(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/ask-me-anything", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.displayName || (name.trim() ? name.trim() : "Anonymous"),
          email: user?.email || "",
          photoURL: user?.photoURL || "",
          question: question.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit question")
      }

      onSubmitSuccess()
      setQuestion("")
      onShowFormChange(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      onSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <header className="mb-8 space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Ask Me Anything</h1>
          <Button
            onClick={handleAskButtonClick}
            size="sm"
            className="text-xs bg-primary hover:bg-extra-lavender transition-all duration-300"
          >
            <MessageSquare size={14} />
            Ask / Comment
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Have a question? I'll do my best to answer it here. You can also leave a comment if you have any.
          You can ask questions or leave comments anonymously - no sign in required!
        </p>
      </header>

      {showForm && (
        <section className="mb-8 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium">Craft something</h2>
            <Button
              onClick={() => onShowFormChange(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={14} />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {user ? (
                <>
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm">{user.displayName || "User"}</span>
                </>
              ) : (
                <div className="w-full">
                  <input 
                    type="text" 
                    placeholder="Your Name (optional)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-2 p-2 text-sm rounded border border-input bg-background placeholder:text-muted-foreground focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to post anonymously</p>
                </div>
              )}
            </div>
            
            <Textarea
              placeholder="What would you like to know or say?"
              className="min-h-[80px] text-sm resize-none bg-white dark:bg-black w-full mb-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="sm" 
                disabled={isSubmitting} 
                className="text-sm bg-primary hover:bg-extra-lavender transition-all duration-300 hover:shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : "Submit Question"}
              </Button>
            </div>
          </form>
        </section>
      )}
    </>
  )
}
