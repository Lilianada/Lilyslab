"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
  CalendarDaysIcon,
  Timer,
  Shield,
  MessageCircleHeart,
  Link2,
  Heart,
  Mail,
  Instagram,
  Linkedin,
  Twitter,
  Package,
  Boxes,
  Network,
  Calendar,
  UserSquare2,
  PaintBucketIcon,
  Smile,
  Flower,
  ListCheck,
  ScrollText,
  LineChart,
  MessageCircleCodeIcon,
} from "lucide-react"
import { ThemeToggle } from "../theme/theme-toggle"
import { useEffect, useState } from "react"
import { UserProfileSection } from "../auth/user-profile-section"
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
  const [isHovered, setIsHovered] = useState(false)

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
        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        onClick={(e) => {
          // Call the onClick callback if provided
          if (onClick) onClick();
        }}
        style={{ transitionDelay: `${delay}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`transition-transform duration-200 ${isHovered ? "scale-110" : ""}`}>
          {icon}
        </div>
        <span>{label}</span>
        <span className="ml-auto text-sm opacity-60">
          <ArrowUpRight size={16} />
        </span>
      </a>
    )
  }

  if (template) {
    return (    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent/50 transition-all duration-300",
        isActive ? "bg-accent/70 text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
      onClick={(e) => {
        // Call the onClick callback if provided, but don't prevent default navigation
        if (onClick) onClick();
      }}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`transition-transform duration-200 ${isHovered ? "scale-110" : ""}`}>
          {icon}
        </div>
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
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-300 relative group",
        isActive 
          ? "bg-accent/70 text-foreground font-medium shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
      onClick={(e) => {
        // Call the onClick callback if provided, but don't prevent default navigation
        if (onClick) onClick();
      }}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`text-accent-foreground transition-transform duration-200 ${isHovered || isActive ? "scale-110" : ""}`}>
        {icon}
      </div>
      <span className="relative">
        {label}
        {hasNotification && (
          <span className="absolute -top-1 -right-2 w-2 h-2 bg-mellow rounded-full animate-pulse" />
        )}
      </span>
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-foreground rounded-full" />
      )}
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
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-accent/90 to-transparent opacity-70"></div>
      </div>
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
        "border-r bg-gradient-to-b from-card to-card/95 shadow-none transition-all duration-300",
        mobile ? "w-full" : "hidden w-64 "
      )}
      style={{ minHeight: '100vh', boxShadow: '0 0 0 0 transparent' }}
    >
      <div className={cn("p-4", mobile ? "" : "sticky top-0 h-screen flex flex-col justify-between")}>
        {!mobile && (
          <div className="mb-6 animate-fade-in">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity p-1">
              <div className="p-1.5 rounded-md bg-gradient-to-br from-accent/30 to-accent/10 shadow-sm backdrop-blur-sm">
                <Image src="/images/12.png" alt="Lily's Garden Logo" width={24} height={24} className="rounded-md" />
              </div>

              <h1 className="text-sm font-medium">Lily's Garden</h1>
            </Link>
          </div>
        )}

        <nav className={cn("space-y-6 custom-scrollbar", mobile ? "" : "flex-1 overflow-y-auto pt-2")}>
          <div className="space-y-1.5 mb-2">
            <NavItem href="/" icon={<Flower size={16} />} label="Home" onClick={onNavClick} delay={100} />
          </div>

          <div className="space-y-1.5 mb-2">
            <SectionTitle title="Me" delay={150} />
            <NavItem href="/about" icon={<Smile size={16} />} label="About" onClick={onNavClick} delay={200} />
            <NavItem href="/now" icon={<Clock size={16} />} label="Now" onClick={onNavClick} delay={200} />
            <NavItem href="/someday" icon={<Calendar size={16} />} label="Someday" onClick={onNavClick} delay={250} />
            {/* <NavItem href="/wants" icon={<Heart size={16} />} label="Wants" onClick={onNavClick} delay={300} /> */}
            <NavItem href="/bucket-list" icon={<ListCheck size={16} />} label="Bucket List" onClick={onNavClick} delay={350} />
          </div>

          <div className="space-y-1.5 mb-2">
            <SectionTitle title="For You" delay={400} />
            <NavItem href="/guestbook" icon={<MessageCircleHeart size={16} />} label="Guestbook" onClick={onNavClick} delay={450} />
            <NavItem href="/ask-me-anything" icon={<MessageSquare size={16} />} label="AMA" onClick={onNavClick} delay={500} />
            <NavItem href="/uses" icon={<Layers size={16} />} label="Uses" onClick={onNavClick} delay={550} />
            <NavItem href="/resources" icon={<WalletCards size={16} />} label="Resources" onClick={onNavClick} delay={600} />
          </div>

          <div className="space-y-1.5 mb-2">
            <SectionTitle title="Garden" delay={650} />
            <NavItem href="/garden/writings" icon={<FileText size={16} />} label="Essays" onClick={onNavClick} delay={700} />
            <NavItem href="/garden/notes" icon={<BookHeartIcon size={16} />} label="Notes" onClick={onNavClick} delay={750} />
            <NavItem href="/garden/bookshelf" icon={<BookOpen size={16} />} label="Bookshelf" onClick={onNavClick} delay={800} />
            <NavItem href="/garden/threads" icon={<MessageCircleCodeIcon size={16} />} label="Threads" onClick={onNavClick} delay={750} />
          </div>



          <div className="space-y-1.5 mb-2">
            <SectionTitle title="Workshop" delay={850} />
            <NavItem href="/projects" icon={<BriefcaseBusiness size={16} />} label="Projects" onClick={onNavClick} delay={900} />
            <NavItem href="/logs" icon={<Clock size={16} />} label="Logs" onClick={onNavClick} delay={950} /> 
            <NavItem href="/tools" icon={<Wrench size={16} />} label="Tools" onClick={onNavClick} delay={1000} />
            <NavItem href="/todo" icon={<BadgeCheck size={16} />} label="Todo" onClick={onNavClick} delay={1050} />
          </div>

          <div className="space-y-1.5 mb-2">
            <SectionTitle title="Playground" delay={1100} />
            <NavItem href="/playground/digital-clock" icon={<Timer size={16} />} label="Digital Clock" onClick={onNavClick} delay={1150} />
            <NavItem href="/playground/calculator" icon={<Calculator size={16} />} label="Calculator" onClick={onNavClick} delay={1200} />
          </div>
          
          <div className="space-y-1.5 mb-2">
            <SectionTitle title="Collections" delay={1250} />
            <NavItem href="/bookmarks" icon={<Bookmark size={16} />} label="Bookmarks" onClick={onNavClick} delay={1300} />
            <NavItem href="/100pics" icon={<ImageIcon size={16} />} label="100Pics" onClick={onNavClick} delay={1350} />
            <NavItem href="/365days" icon={<CalendarDaysIcon size={16} />} label="365days" onClick={onNavClick} delay={1400} />
          </div>

          <div className="space-y-1.5 mb-2">
            <SectionTitle title="IndieWeb" delay={1450} />
            <NavItem href="/manifesto" icon={<Shield size={16} />} label="Manifesto" onClick={onNavClick} delay={1500} />
            <NavItem href="/webroll" icon={<ScrollText size={16} />} label="Webroll" onClick={onNavClick} delay={1550} />
            <NavItem href="/webrings" icon={<Network size={16} />} label="Webrings" onClick={onNavClick} delay={1600} />
          </div>


          {isAdmin && (
            <div className="space-y-1.5 mb-2">
              <SectionTitle title="Admin" delay={1950} />
              <NavItem href="/ctrl-room" icon={<Shield size={16} />} label="CTRL Room" onClick={onNavClick} delay={2000} />
            </div>
          )}
        </nav>

        {!mobile && (
          <div className="pt-4 mt-2 border-t border-accent/20 flex justify-between items-center">
            <UserProfileSection />
              <ThemeToggle />
          </div>
        )}
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
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .custom-scrollbar a:hover {
        transform: translateY(-1px);
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
    `}</style>
    </aside>
  )
}