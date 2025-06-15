"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Book, ListCheckIcon, Lightbulb, NotepadText, Bookmark, PenBox } from "lucide-react"
import { SuggestionSidebar } from "@/components/workshop/suggestions/SuggestionSidebar"

export default function DigitalGardenHome() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isSuggestionSidebarOpen, setIsSuggestionSidebarOpen] = useState(false);

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const sections = [
        {
            title: "Writings",
            description: "",
            href: "/garden/writings",
            icon: ListCheckIcon
        },
        {
            title: "Notes",
            description: "Fleeting thoughts, ideas, and learnings.",
            href: "/garden/notes/",
            icon: NotepadText
        },
        {
            title: "Bookshelf",
            description: "Books I've read, am reading, or plan to read.",
            href: "/garden/bookshelf",
            icon: Book
        },
        {
            title: "Bookmarks",
            description: "A collection of my favorite reads, tools, and discoveries.",
            href: "/garden/bookmarks",
            icon: Bookmark
        },
        {
            title: "Microblog",
            description: "Short thoughts, updates, and musings.",
            href: "/garden/micro-blog",
            icon: PenBox
        }
    ]

    return (
        <>
            <div className={`max-w-3xl mx-auto sm:px-4 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="mb-1 text-lg md:text-2xl font-bold tracking-tight">Digital Garden</h1>
                        <p className="text-sm text-muted-foreground">
                        My Digital Garden is a growing collection of thoughts, ideas, and knowledge I’ve gathered from various topics that spark my curiosity.
                        {" "}
                        <a href="/digital-garden/writings/digital-garden" className="text-extra-steelBlue underline hover:text-extra-peach">What is a digital garden?</a>
                        </p>
                    </div>
                </header> 
                {/* <div className="hidden sm:grid grid-cols-1 mb-8 w-1/2">
                    <Button
                        variant="outline"
                        onClick={() => setIsSuggestionSidebarOpen(true)}
                    >
                        <Lightbulb size={16} className="mr-2" /> Suggest Something
                    </Button>
                </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
                    {sections.map((section, index) => (
                        <Link key={section.title} href={section.href} className="block group">
                            <Card
                                className={`p-4 hover:border-primary/80 transition-colors duration-200 cursor-pointer rounded-lg opacity-0 animate-slide-up h-full flex flex-row items-end justify-between`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="p-0">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                        <section.icon className="w-5 h-5 stroke-1 text-primary" />
                                    </div>
                                    <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
                                </CardHeader>
                                <CardFooter className="p-0">
                                    <span className="text-xs text-primary group-hover:underline flex items-center">
                                        Explore <ArrowUpRight size={12} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    </span>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            <SuggestionSidebar
                isOpen={isSuggestionSidebarOpen}
                onClose={() => setIsSuggestionSidebarOpen(false)}
            />
        </>
    )
} 