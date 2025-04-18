import { useEffect, useState } from "react"

interface ChangelogNotification {
  lastViewedTimestamp: number
  latestChangeTimestamp: number
}

export function useChangelogNotification() {
  const [hasNotification, setHasNotification] = useState(false)

  useEffect(() => {
    // Load notification state from localStorage
    const loadNotificationState = () => {
      const storedState = localStorage.getItem("changelog-notification")
      if (!storedState) {
        return {
          lastViewedTimestamp: 0,
          latestChangeTimestamp: Date.now()
        }
      }
      return JSON.parse(storedState) as ChangelogNotification
    }

    // Check if there's a new changelog entry
    const checkForNewChanges = () => {
      const state = loadNotificationState()
      const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const timeSinceLastChange = Date.now() - state.latestChangeTimestamp

      // Show notification if:
      // 1. User hasn't viewed the changelog since the last change
      // 2. The change was made within the last 24 hours
      setHasNotification(
        state.lastViewedTimestamp < state.latestChangeTimestamp &&
        timeSinceLastChange <= twentyFourHours
      )
    }

    // Mark changelog as viewed
    const markAsViewed = () => {
      const state = loadNotificationState()
      const newState = {
        ...state,
        lastViewedTimestamp: Date.now()
      }
      localStorage.setItem("changelog-notification", JSON.stringify(newState))
      setHasNotification(false)
    }

    // Update notification state when a new change is logged
    const logNewChange = () => {
      const state = loadNotificationState()
      const newState = {
        ...state,
        latestChangeTimestamp: Date.now()
      }
      localStorage.setItem("changelog-notification", JSON.stringify(newState))
      checkForNewChanges()
    }

    // Check for notifications on mount
    checkForNewChanges()

    // Check for new notifications periodically
    const interval = setInterval(checkForNewChanges, 60000) // Check every minute

    return () => {
      clearInterval(interval)
    }
  }, [])

  return { hasNotification }
} 