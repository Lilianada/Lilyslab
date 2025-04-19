"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Book,
    Film,
    PenTool,
    Images,
    Zap,
    Plus,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export default function LeafletHome() {
    const router = useRouter()
    const { user } = useAuth()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isLoaded, setIsLoaded] = useState(true)

    const handleLogout = () => {
        // TODO: Implement actual logout logic here
        router.push("/") // Redirect to landing page
    }

    // Get current time of day for greeting
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    const cards = [
        { title: "Reading List", icon: Book, href: "/digital-garden/reading-list" },
        { title: "Movie List", icon: Film, href: "/digital-garden/movie-list" },
        { title: "Pic-Pins", icon: Images, href: "/digital-garden/pic-pins" },
        { title: "Quick Notes", icon: Zap, href: "/digital-garden/quick-notes" },
    ]

    const buttonData = [
        {
            label: 'Recommend a Book',
            icon: Book,
            href: '/leaflets/reading/new',
        },
        {
            label: 'Suggest a Movie',
            icon: Film,
            href: '/leaflets/movies/new',
        },
        {
            label: 'Write Reflection',
            icon: PenTool,
            href: '/leaflets/reflections/new',
        },
        {
            label: 'Quick Note',
            icon: Zap,
            href: '/leaflets/notes/new',
        },
    ]

    return (
        <div className={`max-w-2xl mx-auto px-6 py-12 max-h-screen ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
            {/* Main Content Area (60% width) */}
            <main className="">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                        <h1 className="mb-1 text-xl font-medium">Digital Garden</h1>
                        <p className="text-sm text-muted-foreground">
                            A growing collection of thoughts, ideas, and knowledge I’ve gathered from various topics that spark my curiosity.
                        </p>
                    </div>
                </header>

                {/* Search Bar */}
                <SearchBar
                    placeholder="Search across my books, movies, reflections..."
                    onSearch={() => { }}
                    className="mb-8"
                />


                <Card className="p-6 mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-medium">Suggest</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Plus className="w-4 h-4 mr-1" /> Make a Suggestion
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Item</DialogTitle>
                                    <DialogDescription>
                                        What would you like to suggest?
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-2">
                                    {buttonData.map(({ label, icon: Icon, href }) => (
                                        <Button
                                            key={label}
                                            variant="outline"
                                            onClick={() => router.push(href)}
                                            className="flex items-center"
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card>

                {/* Card Grid */}
                <div className="grid grid-cols-2 gap-4 ">
                    {cards.map((card) => (
                        <Card
                            key={card.title}
                            className="p-6 hover:bg-accent/50 transition-colors cursor-pointer rounded-lg"
                            onClick={() => router.push(card.href)}
                        >
                            <div className="flex items-start flex-col gap-2">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <card.icon className="w-6 h-6 stroke-1 text-gray-400" />
                                </div>
                                <h3 className="font-semibold text-base">{card.title}</h3>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* <Card className="p-6 mt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-medium">Up Next</h2>
                    </div>
                </Card> */}
            </main>

        </div>
    )
} 