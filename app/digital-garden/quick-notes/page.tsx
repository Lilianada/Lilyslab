import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { getPublishedArticles } from "@/lib/notion"
import { Annoyed } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 3600 // Revalidate every hour

export default async function QuickNotesPage() {
  let notes: any[] = []
  let error: string | null = null

  try {
    console.log("Fetching published articles for quick notes")
    notes = await getPublishedArticles()
    console.log(`Fetched ${notes.length} notes`)
  } catch (err: any) {
    console.error("Error in QuickNotesPage:", err)
    error = err.message || "An error occurred while fetching notes"
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in px-6 py-8">
      <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Quick Notes</h1>
            <p className="text-sm text-muted-foreground">
            A collection of quick thoughts, ideas, and learnings.
            </p>
          </div>
        </header>

      {error ? (
        <div className="text-center py-8 border rounded-lg p-8">
          <h2 className="text-base font-medium mb-2">Error Loading Notes</h2>
          <p className="text-muted-foreground mb-4 text-sm">{error}</p>
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {notes.map((note, index) => (
            <Link 
              key={note.id} 
              href={`/digital-garden/quick-notes/${note.slug}`}
              className="block transition-transform duration-300 hover:-translate-y-1"
            >
              <Card 
                className="h-full opacity-0 animate-slide-up hover:border-primary transition-colors duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{note.title || "Untitled"}</CardTitle>
                  <CardDescription>
                   
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.excerpt || "No excerpt available"}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-primary hover:text-muted-foreground">Click to read more</div>
                  <time className="text-xs text-muted-foreground">
                      {note.date ? formatDate(note.date) : "No date"}
                    </time>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg p-8 grid place-items-center">
          <Annoyed size={16} />
          <h2 className="mt-2 text-base font-medium mb-2">No Notes Found</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            There are no published notes in your Notion database yet.
          </p>
        </div>
      )}
    </div>
  )
}
