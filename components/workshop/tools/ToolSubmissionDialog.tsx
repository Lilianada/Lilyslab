import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ToolSubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; url: string }) => void
}

export default function ToolSubmissionDialog({ open, onOpenChange, onSubmit }: ToolSubmissionDialogProps) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    onSubmit({ name, url })
    setSubmitting(false)
    setName("")
    setUrl("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit a Tool</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tool-name" className="block text-sm font-medium mb-1">App Name</label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter app name"
              required
            />
          </div>
          <div>
            <label htmlFor="tool-url" className="block text-sm font-medium mb-1">Website URL</label>
            <Input
              id="tool-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
