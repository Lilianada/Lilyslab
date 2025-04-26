
import { mockNotes } from "./mockNotes"
import { NotionAPI } from "notion-client"
import NotesMasonry from "@/components/digital-garden/notes/NotesMasonry"


export default async function NotesListPage() {
  const notion = new NotionAPI()
  const notesWithContent = await Promise.all(
    mockNotes.map(async (note) => {
      const formattedPageId = note.id.replace(/-/g, '')
      let recordMap = null
      try {
        recordMap = await notion.getPage(formattedPageId)
      } catch (e) {}
      return { ...note, recordMap }
    })
  )

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-xl font-medium">Notes</h1>
            <p className="text-sm text-muted-foreground">
              A collection of notes I've written recently, with some thoughts.
            </p>
          </div>
        </header>

        <NotesMasonry notes={notesWithContent} />
      </div>
    </div>
  )}