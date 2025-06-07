"use client"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { Coffee } from "lucide-react"

interface BuyMeCoffeeDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function BuyMeCoffeeDialog({
  isOpen,
  onOpenChange
}: BuyMeCoffeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Premium Content</DialogTitle>
          <DialogDescription>
            This track is available for supporters who buy me a coffee.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          <Coffee size={48} className="text-amber-500 mb-4" />
          <p className="text-center mb-4">
            Support my work by buying me a coffee to unlock premium content including downloads and exclusive tracks.
          </p>
          <Button 
            onClick={() => window.open("https://www.buymeacoffee.com/lilian.ada", "_blank")}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Buy Me A Coffee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
