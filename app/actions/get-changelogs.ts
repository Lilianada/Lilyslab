"use server"

import { getChangelogs } from "@/lib/notion"
import { cache } from "react"

export const getChangelogEntries = cache(async () => {
  try {
    const changelogs = await getChangelogs()
    return { changelogs }
  } catch (error) {
    console.error("Error fetching changelogs:", error)
    return { error: "Failed to fetch changelogs" }
  }
}) 