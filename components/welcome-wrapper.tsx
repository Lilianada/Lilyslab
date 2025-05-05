"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import WelcomePage to avoid SSR issues with localStorage
const WelcomePage = dynamic(() => import('@/components/welcomepage'), { ssr: false })

export default function WelcomeWrapper() {
  const [showWelcome, setShowWelcome] = useState(true)
  
  return (
    <WelcomePage 
      isOpen={showWelcome} 
      onClose={() => setShowWelcome(false)} 
    />
  )
}
