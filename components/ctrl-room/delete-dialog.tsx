"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { AlertTriangle, RefreshCw, Trash } from "lucide-react"
import { AudioTrack } from "@/lib/audio/howler-service"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackToDelete: AudioTrack | null
  isDeleting: boolean
  onDelete: () => Promise<void>
  isBatch?: boolean
  selectedCount?: number
}

export function DeleteDialog({
  open,
  onOpenChange,
  trackToDelete,
  isDeleting,
  onDelete,
  isBatch = false,
  selectedCount = 0
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm {isBatch ? "Batch " : ""}Deletion
          </DialogTitle>
          <DialogDescription>
            {isBatch 
              ? `Are you sure you want to delete ${selectedCount} selected tracks? This action cannot be undone.`
              : `Are you sure you want to delete "${trackToDelete?.title}"? This action cannot be undone.`
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Delete {isBatch ? `${selectedCount} Tracks` : "Track"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
