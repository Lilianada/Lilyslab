import type { Metadata } from "next"
import { getAllPoems } from "@/lib/garden/poems"
import PoemLayoutClient from "./PoemLayoutClient"

export const metadata: Metadata = {
  title: "Poems",
  description: "A small book of poems from Lily's garden.",
}

export default function PoemsPage() {
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="mx-auto w-full max-w-xl pb-8 pt-16 sm:px-4">
        <header className="mb-12">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="text-xl font-medium">Poems</h1>
        </header>

        <PoemLayoutClient poems={getAllPoems()} />
      </div>
    </div>
  )
}
