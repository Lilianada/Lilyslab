'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"


export const BuyMeCoffee = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buyMeUrl = "https://www.buymeacoffee.com/Lilian.ada"

  const handleButtonClick = () => {
    setIsOpen(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleButtonClick()
    }
  }

  return (
    <>
      <button
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#fcd700] shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#fcd700] focus:ring-offset-2"
        aria-label="Buy me a coffee"
        tabIndex={0}
      >
        <Image
          src="/images/bmc-logo.png"
          alt="Buy Me a Coffee"
          width={30}
          height={30}
          className="h-7 w-7 object-contain"
        />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle className="flex flex-col items-center justify-center space-y-4 p-6 font-normal">
            <Image
              src="/images/bmc-logo.png"
              alt="Buy Me a Coffee"
              width={60}
              height={60}
              className="h-14 w-14 object-contain"
            />
            <h2 className="text-lg font-semibold">Support My Work</h2>
            <p className="text-center text-muted-foreground text-sm">
              Hiiiii❤️, thank you for checking out this website. You can now support my work by buying me a cup of coffee☕️
            </p>
            <a
              href={buyMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-[#fcd700] px-8 py-3 font-medium text-sm text-black transition-colors hover:bg-[#fcd700]/90 focus:outline-none focus:ring-2 focus:ring-[#fcd700] focus:ring-offset-2"
            >
              Buy me a coffee
            </a>
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  )
} 