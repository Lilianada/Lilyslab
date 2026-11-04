"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  MessageSquare,
  Layers,
  Bookmark,
  Clock,
  FileText,
  BriefcaseBusiness,
  WalletCards,
  History,
  Wrench,
  BadgeCheck,
  BookHeart as BookHeartIcon,
  Calculator,
  Timer,
  Terminal,
  Shield,
  MessageCircleHeart,
  Heart,
  Calendar,
  Smile,
  Flower,
  ListCheck,
  ScrollText,
  MessageCircleCodeIcon,
  ShipWheel,
  Loader,
  CalendarArrowDown,
  Quote,
  Palette,
  Sparkles,
  Pencil,
  Gamepad2,
  Shapes,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface NavEntry {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NAV_SECTIONS: { title?: string; items: NavEntry[] }[] = [
  {
    items: [
      { href: "/", icon: <Flower size={16} />, label: "Home" },
      { href: "/hello", icon: <Loader size={16} />, label: "Hello" },
    ],
  },
  {
    title: "Me",
    items: [
      { href: "/about", icon: <Smile size={16} />, label: "About" },
      { href: "/now", icon: <Clock size={16} />, label: "Now" },
      { href: "/someday", icon: <Calendar size={16} />, label: "Someday" },
      { href: "/daily-logs", icon: <Heart size={16} />, label: "Daily Logs" },
      { href: "/wants-to-do", icon: <ListCheck size={16} />, label: "100 Wants" },
      { href: "/bucket-list", icon: <ListCheck size={16} />, label: "Career Bucket List" },
    ],
  },
  {
    title: "For You",
    items: [
      { href: "/guestbook", icon: <MessageCircleHeart size={16} />, label: "Guestbook" },
      { href: "/ask-me-anything", icon: <MessageSquare size={16} />, label: "AMA" },
      { href: "/uses", icon: <Layers size={16} />, label: "Uses" },
      { href: "/resources", icon: <WalletCards size={16} />, label: "Resources" },
    ],
  },
  {
    title: "Garden",
    items: [
      { href: "/garden/essays", icon: <FileText size={16} />, label: "Essays" },
      { href: "/garden/notes", icon: <BookHeartIcon size={16} />, label: "Notes" },
      { href: "/garden/bookmarks", icon: <Bookmark size={16} />, label: "Bookmarks" },
      { href: "/garden/bookshelf", icon: <BookOpen size={16} />, label: "Bookshelf" },
      { href: "/garden/micro-blog", icon: <MessageCircleCodeIcon size={16} />, label: "Micro-blog" },
      { href: "/garden/poems", icon: <Flower size={16} />, label: "Poems" },
      { href: "/garden/word-of-the-day", icon: <ScrollText size={16} />, label: "Word of the Day" },
    ],
  },
  {
    title: "Workshop",
    items: [
      { href: "/projects", icon: <BriefcaseBusiness size={16} />, label: "Projects" },
      { href: "/tools", icon: <Wrench size={16} />, label: "Tools" },
      { href: "/todo", icon: <BadgeCheck size={16} />, label: "Todo" },
    ],
  },
  {
    title: "Playground",
    items: [
      { href: "/playground/petal-catch", icon: <Gamepad2 size={16} />, label: "Petal Catch" },
      { href: "/playground/doodle", icon: <Pencil size={16} />, label: "Doodle Pad" },
      { href: "/playground/color-theory", icon: <Palette size={16} />, label: "Color Theory" },
      { href: "/playground/animation-lab", icon: <Sparkles size={16} />, label: "Animation Lab" },
      { href: "/playground/digital-clock", icon: <Timer size={16} />, label: "Digital Clock" },
      { href: "/playground/calculator", icon: <Calculator size={16} />, label: "Calculator" },
      { href: "/playground/terminal", icon: <Terminal size={16} />, label: "Terminal" },
      { href: "/playground", icon: <Shapes size={16} />, label: "All experiments" },
    ],
  },
  {
    title: "IndieWeb",
    items: [
      { href: "/manifesto", icon: <Shield size={16} />, label: "Manifesto" },
      { href: "/webroll", icon: <ScrollText size={16} />, label: "Webroll" },
      { href: "/webrings", icon: <ShipWheel size={16} />, label: "Webrings" },
    ],
  },
  {
    title: "Collections",
    items: [
      { href: "/commonplace-book", icon: <BookOpen size={16} />, label: "Commonplace Book" },
      { href: "/quotes", icon: <Quote size={16} />, label: "Quotes" },
      { href: "/archives", icon: <History size={16} />, label: "Archives" },
      { href: "/then", icon: <CalendarArrowDown size={16} />, label: "Then" },
    ],
  },
];

const NavItem = ({ href, icon, label, onClick }: NavEntry & { onClick?: () => void }) => {
  const pathname = usePathname() || "";
  const isActive = pathname === href || (href !== "/playground" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "nav-link flex items-center gap-3 rounded-md px-3 py-2.5 text-sm relative group transition-all duration-200",
        isActive
          ? "bg-accent/70 text-foreground font-medium shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      <div
        className={cn(
          "text-accent-foreground transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6",
          isActive && "scale-110"
        )}
      >
        {icon}
      </div>
      <span>{label}</span>
      {isActive && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-foreground rounded-full" />}
    </Link>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <div className="px-3 py-2">
    <div className="flex items-center gap-2">
      <h3 className="text-xs font-semibold text-foreground">{title}</h3>
      <div className="h-[1px] flex-grow bg-gradient-to-r from-accent/90 to-transparent opacity-70"></div>
    </div>
  </div>
);

export default function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const { user, isAdmin } = useAuth();
  const sections =
    user && isAdmin
      ? [
          ...NAV_SECTIONS,
          {
            title: "Admin",
            items: [{ href: "/ctrl-room", icon: <Shield size={16} />, label: "CTRL Room" }],
          },
        ]
      : NAV_SECTIONS;

  return (
    <aside className="border-r bg-gradient-to-b from-card to-card/95 w-full min-h-screen">
      <nav className="p-4 space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
        {sections.map((section, index) => (
          <div key={section.title ?? index} className="space-y-1.5 mb-2">
            {section.title && <SectionTitle title={section.title} />}
            {section.items.map((item) => (
              <NavItem key={item.href} {...item} onClick={onNavClick} />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
