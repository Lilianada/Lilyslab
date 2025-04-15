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
  Twitter,
  Mail,
  Github,
  Linkedin,
  Scissors,
  Leaf,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  Dices,
  BriefcaseBusiness,
  Dumbbell,
  ShoppingCart,
  WalletCards,
  CreditCard,
  ArrowUpRight,
  LogOut,
  Crown,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"
import { UserProfileSection } from "./user-profile-section"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
  onClick?: () => void
  delay?: number
}

const NavItem = ({ href, icon, label, external = false, onClick, delay = 0 }: NavItemProps) => {
  const pathname = usePathname()
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
        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
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
      className={`px-3 py-2 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="text-xs font-medium text-foreground">{title}</h3>
    </div>
  )
}

export default function Sidebar({ mobile = false, onNavClick }: { mobile?: boolean; onNavClick?: () => void }) {
  const { user, signOut, isAdmin } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { toast } = useToast()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <aside className={cn("sidebar border-r", mobile ? "w-full" : "hidden w-64 md:block")}>
      <div className={cn("p-4", mobile ? "" : "sticky top-0 h-screen flex flex-col")}>
        {!mobile && (
          <div className="mb-8 animate-fade-in">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Lily's Lab Logo" width={40} height={40} className="rounded-md" />
              <h1 className="text-sm font-medium">Lily's Lab</h1>
            </Link>
          </div>
        )}

        <nav className={cn("space-y-6", mobile ? "" : "flex-1 overflow-y-auto")}>
          <div className="space-y-1">
            <NavItem href="/" icon={<Home size={16} />} label="Home" onClick={onNavClick} delay={100} />
            <NavItem href="/writing" icon={<BookOpen size={16} />} label="Writing" onClick={onNavClick} delay={150} />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Me" delay={200} />
            <NavItem href="/now" icon={<Clock size={16} />} label="Now" onClick={onNavClick} delay={250} />
            <NavItem href="/ama" icon={<MessageSquare size={16} />} label="AMA" onClick={onNavClick} delay={300} />
            <NavItem href="/stack" icon={<Layers size={16} />} label="Stack" onClick={onNavClick} delay={350} />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Case Studies" delay={400} />
            <NavItem
              href="https://codedbabe.notion.site/Leaflet-App-Case-Study-19ef441cd2fd80689b50c8ed3360b150?pvs=74"
              icon={<Leaf size={16} />}
              label="Leaflet"
              external
              onClick={onNavClick}
              delay={450}
            />
            <NavItem
              href="https://codedbabe.notion.site/Plannr-App-Product-Strategy-Requirements-Doc-PSRD-185f441cd2fd80a9b4ede8d73cd5570c"
              icon={<Calendar size={16} />}
              label="Plannr"
              external
              onClick={onNavClick}
              delay={500}
            />
            <NavItem
              href="https://codedbabe.notion.site/Upmonie-AI-Powered-Fintech-Startup-192f441cd2fd8049b9f8d575efc08cf6?pvs=74"
              icon={<TrendingUp size={16} />}
              label="Upmonie"
              external
              onClick={onNavClick}
              delay={550}
            />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Live Apps" delay={600} />
            <NavItem
              href="https://wordix-v1.vercel.app/"
              icon={<Dices size={16} />}
              label="Wordix"
              external={true}
              onClick={onNavClick}
              delay={650}
            />
            <NavItem
              href="https://lilianada.com/"
              icon={<BriefcaseBusiness size={16} />}
              label="LilianAda"
              external={true}
              onClick={onNavClick}
              delay={700}
            />
            <NavItem
              href="https://firmco-admin.vercel.app/"
              icon={<WalletCards size={16} />}
              label="Firmco Admin"
              external={true}
              onClick={onNavClick}
              delay={750}
            />
            <NavItem
              href="https://firmco-client.app/"
              icon={<CreditCard size={16} />}
              label="Firmco Client"
              external={true}
              onClick={onNavClick}
              delay={800}
            />
            <NavItem
              href="https://www.beblended.ca/v2/"
              icon={<ShoppingCart size={16} />}
              label="Beblended"
              external={true}
              onClick={onNavClick}
              delay={850}
            />
            <NavItem
              href="https://the-fitcreatives.vercel.app/"
              icon={<Dumbbell size={16} />}
              label="Fitcreatives"
              external={true}
              onClick={onNavClick}
              delay={900}
            />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Playground" delay={950} />
            <NavItem
              href="/playground/app-dissection"
              icon={<Scissors size={16} />}
              label="App Dissection"
              onClick={onNavClick}
              delay={1000}
            />
            <NavItem
              href="/playground/resources"
              icon={<FileText size={16} />}
              label="Resources"
              onClick={onNavClick}
              delay={1050}
            />
            <NavItem
              href="/playground/tools"
              icon={<Layers size={16} />}
              label="Tools"
              onClick={onNavClick}
              delay={1100}
            />
          </div>

          <div className="space-y-1">
            <SectionTitle title="Online" delay={1150} />
            <NavItem
              href="https://linkedin.com/in/lilianada"
              icon={<Linkedin size={16} />}
              label="LinkedIn"
              external
              onClick={onNavClick}
              delay={1200}
            />
            <NavItem
              href="https://github.com/lilianada"
              icon={<Github size={16} />}
              label="GitHub"
              external
              onClick={onNavClick}
              delay={1250}
            />
            <NavItem
              href="mailto:lilianokeke.ca@gmail.com"
              icon={<Mail size={16} />}
              label="Email"
              external
              onClick={onNavClick}
              delay={1300}
            />
            <NavItem
              href="https://twitter.com/lilian_okeke_"
              icon={<Twitter size={16} />}
              label="Twitter"
              external
              onClick={onNavClick}
              delay={1150}
            />
          </div>

          {user && !mobile && (
            <div className="space-y-1 opacity-0 animate-slide-up" style={{ animationDelay: "1350ms" }}>
              {isAdmin && (
                <div className="mb-2 flex items-center justify-center">
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full px-2 py-1 flex items-center text-xs">
                    <Crown size={12} className="mr-1" /> Admin
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <>
                    <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} className="mr-2" />
                    <span>Sign out</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </nav>

        {!mobile && (
          <div className="flex items-center justify-between gap-2">
            <ThemeToggle />
            <UserProfileSection />
          </div>
        )}
      </div>
    </aside>
  )
}
