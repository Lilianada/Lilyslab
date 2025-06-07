"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-input bg-muted p-2 text-sm font-medium ring-offset-muted transition-colors hover:bg-accent hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Toggle theme"
    >
      {mounted ? (
        theme === "dark" ? <Sun className="" /> : <Moon className="" />
      ) : (
        // Optionally render nothing or a neutral icon while mounting
        <span className="w-5 h-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}