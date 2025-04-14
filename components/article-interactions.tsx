"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart, MessageSquare, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import AuthSignInModal from "@/components/auth-sign-in-modal"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Update the Comment interface to include status
interface Comment {
  id: string
  name: string
  email?: string | null
  comment: string
  date: string
  photoURL?: string | null
  reply?: string | null
  replies: Comment[]
  status?: string // Add status field
}

interface ArticleInteractionsProps {
  slug: string
  initialLikes: number
}

export default function ArticleInteractions({ slug, initialLikes }: ArticleInteractionsProps) {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authAction, setAuthAction] = useState<"like" | "comment" | null>(null)
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Check if user has liked the article from localStorage
  useEffect(() => {
    const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "{}")
    setHasLiked(!!likedArticles[slug])
    fetchComments()
  }, [slug])

  // Clear message after timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true)
      const response = await fetch(`/api/articles/${slug}/comments`)

      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
      setMessage({ type: "error", text: "Failed to load comments" })
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      setAuthAction("like")
      setIsAuthModalOpen(true)
      return
    }

    try {
      const action = hasLiked ? "decrement" : "increment"
      const response = await fetch(`/api/articles/${slug}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Failed to update likes")
      }

      const data = await response.json()
      setLikes(data.likes)

      // Update localStorage
      const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "{}")
      if (hasLiked) {
        delete likedArticles[slug]
      } else {
        likedArticles[slug] = true
      }
      localStorage.setItem("likedArticles", JSON.stringify(likedArticles))

      setHasLiked(!hasLiked)
    } catch (error) {
      console.error("Error updating likes:", error)
      setMessage({ type: "error", text: "Failed to update likes" })
    }
  }

  const handleComment = () => {
    if (!user) {
      setAuthAction("comment")
      setIsAuthModalOpen(true)
      return
    }

    setShowCommentForm(true)
    setReplyToId(null)
  }

  const handleReply = (commentId: string) => {
    if (!user) {
      setAuthAction("comment")
      setIsAuthModalOpen(true)
      return
    }

    setShowCommentForm(true)
    setReplyToId(commentId)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      console.log(`Submitting comment for article: ${slug}`)
      const response = await fetch(`/api/articles/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          comment: commentText,
          photoURL: user.photoURL,
          parentCommentId: replyToId,
        }),
      })

      console.log("Submission response status:", response.status)
      const data = await response.json()
      console.log("Submission response data:", data)

      if (response.ok) {
        setCommentText("")
        setShowCommentForm(false)
        setReplyToId(null)
        setMessage({ type: "success", text: "Comment submitted successfully!" })
        // Fetch updated comments
        fetchComments()
      } else {
        const errorMessage = data.error || "Failed to submit comment. Please try again."
        const errorDetails = data.details ? ` (${data.details})` : ""
        setMessage({ type: "error", text: errorMessage + errorDetails })
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      setMessage({ type: "error", text: `An error occurred: ${error.message}. Please try again.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
    if (authAction === "like") {
      handleLike()
    } else if (authAction === "comment") {
      setShowCommentForm(true)
    }
    setAuthAction(null)
  }

  const handleAdminReply = async (commentId: string, replyText: string) => {
    if (!user || !isAdmin) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      console.log("Submitting admin reply:", { commentId, replyText, adminEmail: user.email })

      const response = await fetch(`/api/articles/${slug}/comments/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply: replyText,
          adminEmail: user.email,
        }),
      })

      const data = await response.json()
      console.log("Admin reply response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit reply")
      }

      toast({
        title: "Reply submitted",
        description: "Your reply has been posted successfully.",
        duration: 3000,
      })

      setMessage({ type: "success", text: "Reply submitted successfully!" })
      // Fetch updated comments
      fetchComments()
    } catch (error) {
      console.error("Error submitting admin reply:", error)
      toast({
        title: "Reply failed",
        description: error.message || "Failed to submit reply. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
      setMessage({ type: "error", text: "Failed to submit reply. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 border-t pt-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-2 ${hasLiked ? "text-pink-500" : ""}`}
        >
          <Heart size={16} className={hasLiked ? "fill-pink-500" : ""} />
          <span>
            {likes} like{likes !== 1 ? "s" : ""}
          </span>
        </Button>

        <Button variant="ghost" size="sm" onClick={handleComment} className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span>Leave a comment</span>
        </Button>
      </div>

      {message && (
        <div
          className={`mb-4 text-xs p-3 rounded animate-fade-in ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {showCommentForm && user && (
        <div className="mb-6 rounded-lg border p-4 animate-fade-in bg-white dark:bg-background">
          <h3 className="text-sm font-medium mb-3">{replyToId ? "Reply to comment" : "Leave a comment"}</h3>
          <form className="space-y-3" onSubmit={handleSubmitComment}>
            <div className="flex items-center space-x-2">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL || "/placeholder.svg"}
                  alt={user.displayName || "User"}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-xs text-muted-foreground">{user.displayName}</span>
            </div>
            <div>
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[100px] text-xs resize-none bg-white dark:bg-black"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCommentForm(false)
                  setReplyToId(null)
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-sm font-medium">
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </h3>

        {isLoadingComments ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onAdminReply={handleAdminReply}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>

      <AuthSignInModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string) => void
  isReply?: boolean
  onAdminReply?: (commentId: string, replyText: string) => Promise<void>
  isAdmin?: boolean
}

// Update the CommentItem component to display status and improve profile picture
function CommentItem({ comment, onReply, isReply = false, onAdminReply, isAdmin = false }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !onAdminReply) return

    setIsSubmitting(true)
    try {
      await onAdminReply(comment.id, replyText)
      setReplyText("")
      setShowReplyForm(false)
    } catch (error) {
      console.error("Error submitting admin reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`space-y-2 ${isReply ? "ml-8 mt-4" : "border-b pb-4"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {comment.photoURL ? (
            <Image
              src={comment.photoURL || "/placeholder.svg"}
              alt={comment.name}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
              {comment.name.charAt(0)}
            </div>
          )}
          <h4 className="text-xs font-medium">{comment.name}</h4>
        </div>
        <span className="text-[10px] text-muted-foreground">{formatDate(comment.date)}</span>
      </div>

      <p className="text-xs">{comment.comment}</p>

      <div className="flex space-x-2">
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => !comment.reply && setShowReplyForm(!showReplyForm)}
            className="h-6 px-2 text-[10px] text-purple-500 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/20"
          >
            {comment.reply ? "Replied" : "Admin Reply"}
          </Button>
        )}
      </div>

      {/* Admin reply form */}
      {isAdmin && showReplyForm && (
        <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md animate-fade-in">
          <form onSubmit={handleAdminReply}>
            <div className="mb-2">
              <Textarea
                placeholder="Write your admin reply..."
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
                onClick={() => setShowReplyForm(false)}
                className="text-[10px] h-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-[10px] h-6 bg-purple-500 hover:bg-purple-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Reply"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {comment.reply && (
        <div className="ml-8 mt-4 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-medium text-purple-700 dark:text-purple-400 flex items-center">
              <Crown size={12} className="mr-1" /> Author's Reply
            </h4>
            <span className="text-[10px] text-muted-foreground">{formatDate(comment.date)}</span>
          </div>
          <p className="text-xs text-purple-800 dark:text-purple-300">{comment.reply}</p>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              isReply
              onAdminReply={onAdminReply}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Add a helper function to get the appropriate color for each status
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "text-yellow-500 dark:text-yellow-400"
    case "approved":
      return "text-green-500 dark:text-green-400"
    case "answered":
      return "text-blue-500 dark:text-blue-400"
    case "rejected":
      return "text-red-500 dark:text-red-400"
    default:
      return "text-muted-foreground"
  }
}
