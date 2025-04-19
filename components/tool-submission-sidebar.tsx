import { useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const TOOLS_CATEGORIES = ["Development", "Design", "Productivity", "AI & ML", "Other"]

const PLATFORMS = ["iOS", "Web", "Android", "macOS", "Windows", "Linux"]

interface ToolSubmissionSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ToolSubmissionSidebar({ isOpen, onClose }: ToolSubmissionSidebarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    url: "",
    category: "",
    platforms: [] as string[],
  })
  const { toast } = useToast()

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform].slice(0, 4)
      return { ...prev, platforms }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/tools/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          published: false,
          new: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit tool")
      }

      toast({
        title: "Success",
        description: "Your tool suggestion has been submitted for review.",
      })

      // Reset form and close sidebar
      setFormData({
        name: "",
        description: "",
        logo: "",
        url: "",
        category: "",
        platforms: [],
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit tool",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background border-l animate-in slide-in-from-right">
      <div className="h-full flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Submit a Tool</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Tool Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter tool name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <div className="relative">
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the tool (max 250 characters)"
                maxLength={120}
                required
                className="resize-none"
                rows={4}
              />
              <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {formData.description.length}/120
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Website URL
            </label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Enter website URL"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="logo" className="text-sm font-medium">
              Logo URL
            </label>
            <Input
              id="logo"
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="Enter logo URL"
              required
            />
          </div>

          {formData.logo && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo Preview</label>
              <div className="relative">
                <img 
                  src={formData.logo} 
                  alt="Logo Preview" 
                  className="w-24 h-24 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/96?text=Invalid+URL"
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {TOOLS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Platforms (max 4)
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <Badge
                  key={platform}
                  variant={formData.platforms.includes(platform) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handlePlatformToggle(platform)}
                >
                  {platform}
                </Badge>
              ))}
            </div>
            {formData.platforms.length === 4 && (
              <p className="text-xs text-muted-foreground">
                Maximum 4 platforms selected
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || formData.platforms.length === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Tool"}
          </Button>
        </form>
      </div>
    </div>
  )
} 