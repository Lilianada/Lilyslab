import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NoteRouteParams, SlugParams } from "@/lib/types/route-params"
import { NotesClientWrapper } from "./client-wrapper"
import { NotesMarkdownWrapper } from "./markdown-wrapper"
import { Footer } from "@/components/layout/footer"
import { getAllNotesData } from "@/lib/notes"
import { ScrollProgress } from "@/components/ui/scroll-progress"

/**
 * Get note content by slug
 * 
 * @param slug The note slug to retrieve
 * @returns The note content or null if not found
 */
async function getNotesContent(slug: string) {
  try {
    const notesDir = path.join(process.cwd(), 'Content/notes')
    const filePath = path.join(notesDir, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    
    return {
      content,
      title: data.title || slug,
      date: data.date ? formatDate(data.date) : null,
      tags: data.tags || [],
      excerpt: data.excerpt || null
    }
  } catch (error) {
    console.error(`Error getting note content for ${slug}:`, error)
    return null
  }
}

/**
 * Generate metadata for the note page
 */
export async function generateMetadata({ params }: NoteRouteParams) {
  // Params is already a Promise in the updated type definition
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const note = await getNotesContent(slug);
  
  if (!note) {
    return {
      title: "Notes Not Found"
    }
  }
  
  return {
    title: note.title,
    description: note.excerpt
  }
}

/**
 * Generate static paths for all markdown files in the notes directory
 * This follows Next.js's convention for static site generation with dynamic routes
 */
export function generateStaticParams(): SlugParams[] {
  try {
    const notesDir = path.join(process.cwd(), 'Content/notes')
    const files = fs.readdirSync(notesDir)
    
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        slug: file.replace(/\.md$/, '')
      }))
  } catch (error) {
    console.error('Error generating static params for notes:', error)
    return []
  }
}

/**
 * Notes page component
 */
export default async function NotesPage({ params }: NoteRouteParams) {
  // Params is already a Promise in the updated type definition
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const note = await getNotesContent(slug);
  
  if (!note) {
    notFound()
  }
  
  // Get all notes for navigation
  const allNotes = getAllNotesData();
  
  // Find current note index
  const currentIndex = allNotes.findIndex(note => note.slug === slug);
  
  // Get previous and next notes for navigation
  const previousPost = currentIndex > 0 ? {
    title: allNotes[currentIndex - 1].frontmatter.title,
    slug: allNotes[currentIndex - 1].slug,
    path: "/garden/notes"
  } : undefined;
  
  const nextPost = currentIndex < allNotes.length - 1 ? {
    title: allNotes[currentIndex + 1].frontmatter.title,
    slug: allNotes[currentIndex + 1].slug,
    path: "/garden/notes"
  } : undefined;
  
  return (
    <NotesClientWrapper>
      <ScrollProgress 
        color="bg-extra-green" 
        height={3} 
        glow={true} 
        glowColor="rgba(var(--extra-green), 0.6)" 
        glowIntensity="12px" 
      />
      <div className="max-w-3xl mx-auto sm:px-6 py-12 animate-fade-in">
      <Link 
            href="/garden/notes" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back 
          </Link>
       
        <div className="mb-8">
          <header className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-foreground">{note.title}</h1>
            <div className="flex flex-col gap-2">
              {note.date && <p className="text-xs text-muted-foreground">Last updated: {note.date}</p>}
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* <Separator /> */}
          <NotesMarkdownWrapper content={note.content} />

        </div>
        <Footer
          prevPost={previousPost ? { title: previousPost.title, slug: previousPost.slug } : undefined}
          nextPost={nextPost ? { title: nextPost.title, slug: nextPost.slug } : undefined}
          contentType="garden/notes"
        />
      </div>
    </NotesClientWrapper>
  )
}
