"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// Import only the icons we need, but in a TypeScript-compatible way
import {
  Home,
  BookOpen,
  MessageSquare,
  Layers,
  Bookmark,
  Clock,
  FileText,
  BriefcaseBusiness,
  WalletCards,
  ArrowUpRight,
  Store,
  History,
  Wrench,
  BadgeCheck,
  Image as ImageIcon,
  BookHeart as BookHeartIcon,
  Calculator,
  NotepadText,
  CalendarDaysIcon,
  PersonStandingIcon,
  Timer,
  Shield,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"
import { UserProfileSection } from "./user-profile-section"
import { Separator } from "./ui/separator"
import { useAuth } from "@/contexts/auth-context"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
  template?: boolean
  hasNotification?: boolean
  onClick?: () => void
  delay?: number
}

const NavItem = ({ href, icon, label, external = false, template = false, hasNotification = false, onClick, delay = 0 }: NavItemProps) => {
  const pathname = usePathname() || ''
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        onClick={onClick}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {icon}
        <span>{label}</span>
        <span className="ml-auto text-sm opacity-60">
          <ArrowUpRight size={16} />
        </span>
      </a>
    )
  }

  if (template) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-all duration-300",
          isActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        )}
        onClick={onClick}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {icon}
        <span>{label}</span>
        <span className="ml-auto text-sm opacity-60">
          <Store size={16} />
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-all duration-300",
        isActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
      onClick={onClick}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div >
        {icon}
      </div>
      <span className="relative">{label}
        {hasNotification && (
          <span className="absolute -top-1 -right-2 w-2 h-2 bg-mellow rounded-full" />
        )}
      </span>
    </Link>
  )
}

const SectionTitle = ({ title, delay = 0 }: { title: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`px-3 py-2 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="text-xs font-medium text-foreground">{title}</h3>
    </div>
  )
}

export default function Sidebar({ mobile = false, onNavClick }: { mobile?: boolean; onNavClick?: () => void }) {
  const { user, userRoles } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (user && userRoles) {
      setIsAdmin(userRoles.includes('admin'))
    } else {
      setIsAdmin(false)
    }
  }, [user, userRoles])

  return (
    <aside
      className={cn(
        "border-r bg-card shadow-none transition-all duration-300",
        mobile ? "w-full" : "hidden w-60 lg:block"
      )}
      style={{ minHeight: '100vh', boxShadow: '0 0 0 0 transparent' }}
    >
      <div className={cn("p-4", mobile ? "" : "sticky top-0 h-screen flex flex-col justify-between")}>
        {!mobile && (
          <div className="mb-4 animate-fade-in">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/12.png" alt="Lily's Lab Logo" width={24} height={24} className="rounded-md" />

              <h1 className="text-sm font-medium">Lily's Lab</h1>
            </Link>
          </div>
        )}

        <nav className={cn("space-y-6 custom-scrollbar", mobile ? "" : "flex-1 overflow-y-auto")}>
          <div className="space-y-1">
            <NavItem href="/" icon={<Home size={16} />} label="Home" onClick={onNavClick} delay={100} />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Me" delay={150} />
            <NavItem href="/about" icon={<PersonStandingIcon size={16} />} label="About" onClick={onNavClick} delay={200} />
            <NavItem href="/writing" icon={<BookOpen size={16} />} label="Writing" onClick={onNavClick} delay={250} />
            <NavItem href="/now" icon={<Clock size={16} />} label="Now" onClick={onNavClick} delay={300} />
            <NavItem href="/someday" icon={<FileText size={16} />} label="Someday" onClick={onNavClick} delay={400} />
            <NavItem href="/stack" icon={<Layers size={16} />} label="Stack" onClick={onNavClick} delay={350} />
            <NavItem href="/ama" icon={<MessageSquare size={16} />} label="AMA" onClick={onNavClick} delay={450} />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Digital Garden" delay={500} />
            <NavItem href="/digital-garden/bucket-list" icon={<BadgeCheck size={16} />} label="Bucket List" onClick={onNavClick} delay={550} />
            <NavItem href="/digital-garden/bookshelf" icon={<BookOpen size={16} />} label="Bookshelf" onClick={onNavClick} delay={600} />
            <NavItem href="/digital-garden/bookmarks" icon={<Bookmark size={16} />} label="Bookmarks" onClick={onNavClick} delay={650} />
            <NavItem href="/digital-garden/catalog" icon={<ImageIcon size={16} />} label="Catalog" onClick={onNavClick} delay={700} />
            <NavItem href="/digital-garden/notes" icon={<BookHeartIcon size={16} />} label="Notes" onClick={onNavClick} delay={750} />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Workshop" delay={800} />
            <NavItem href="/workshop/projects" icon={<BriefcaseBusiness size={16} />} label="Projects" onClick={onNavClick} delay={850} />
            <NavItem href="/workshop/logs" icon={<Clock size={16} />} label="Logs" onClick={onNavClick} delay={900} /> 
            <NavItem href="/workshop/tools" icon={<Wrench size={16} />} label="Tools" onClick={onNavClick} delay={950} />
            <NavItem href="/workshop/resources" icon={<WalletCards size={16} />} label="Resources" onClick={onNavClick} delay={1000} />
            {/* <NavItem href="/workshop/shop" icon={<ShoppingCart size={16} />} label="Shop" onClick={onNavClick} delay={1050} />
           */}
          </div>

          <div className="space-y-1">
            <SectionTitle title="Playground" delay={1100} />
            <NavItem href="/playground/music-player" icon={<BookHeartIcon size={16} />} label="Music Player" onClick={onNavClick} delay={1150} />
            <NavItem href="/playground/digital-clock" icon={<Timer size={16} />} label="Digital Clock" onClick={onNavClick} delay={1200} />
            <NavItem href="/playground/calculator" icon={<Calculator size={16} />} label="Calculator App" onClick={onNavClick} delay={1250} />
            <NavItem href="/playground/note-widgets" icon={<NotepadText size={16} />} label="Note Widgets" onClick={onNavClick} delay={1300} />
          </div>

          <Separator />

          <div className="space-y-1">
            <NavItem href="/colophon" icon={<WalletCards size={16} />} label="Colophon" onClick={onNavClick} delay={1350} />
            <NavItem href="/changelog" icon={<History size={16} />} label="Changelog" onClick={onNavClick} delay={1400} hasNotification={true} />
            {isAdmin && (
              <NavItem href="/ctrl-room" icon={<Shield size={16} />} label="CTRL Room" onClick={onNavClick} delay={1450} />
            )}
          </div>



          {!mobile && (
            <div className="bg-card sticky bottom-0 space-y-1 pt-2 flex items-center justify-between gap-2">
              <ThemeToggle />
              <UserProfileSection />
            </div>
          )}
        </nav>

      </div>
      
      
      <style jsx global>{`
      .custom-scrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }
      .custom-scrollbar::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
      .custom-scrollbar {
        overscroll-behavior: contain;
        background: transparent;
      }
      .custom-scrollbar > * {
        margin-bottom: 0.25rem;
      }
      .custom-scrollbar a, .custom-scrollbar .flex.items-center {
        border-radius: 0.5rem;
        transition: background 0.18s, color 0.18s, box-shadow 0.18s;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        min-height: 2.5rem;
        align-items: center;
      }
    `}</style>
    </aside>
  )
}
