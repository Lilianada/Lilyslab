"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Tag } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { LogData } from "@/lib/logs"
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

interface LogsClientComponentProps {
  logsData: LogData[];
}

export default function LogsClientComponent({ logsData }: LogsClientComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState<LogData[]>(logsData)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setIsLoaded(true)
    setFilteredLogs(logsData)
  }, [logsData])

  useEffect(() => {
    const filtered = logsData.filter((log) => {
      const title = log.frontmatter.title ?? ""
      const tags = log.frontmatter.tags?.join(" ") ?? ""
      const search = searchQuery.toLowerCase()

      const matchesSearch =
        title.toLowerCase().includes(search) ||
        tags.toLowerCase().includes(search)
      return matchesSearch
    })
    setFilteredLogs(filtered)
  }, [searchQuery, logsData])

  const isLoading = !isLoaded

  return (
    <div className={`w-full ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <div className="mb-6">
        <SearchBar
          placeholder="Search logs by title or tag..."
          onSearch={setSearchQuery}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
          {[...Array(logsData.length || 6)].map((_, i) => (
            <div key={i} className="h-40 bg-muted rounded-lg"></div>
          ))}
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
          {filteredLogs.map((log, index) => (
            <Link key={log.slug} href={`/workshop/logs/${log.slug}`} passHref legacyBehavior>
              <a className="block opacity-0 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="rounded-lg border h-full flex flex-col hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{log.frontmatter.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{log.frontmatter.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Optionally display a snippet or other info here */}
                  </CardContent>
                  <CardFooter className="pt-2">
                     <div className="flex flex-wrap gap-1">
                        {log.frontmatter.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                      </div>
                  </CardFooter>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-sm text-muted-foreground">No logs found matching your search.</p>
        </div>
      )}
    </div>
  )
}
