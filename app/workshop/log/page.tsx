import { ArrowUpRight, Lock, Badge } from "lucide-react";
import Link from "next/link";

const projects = [
  // Accessible links (arrow icon)
  {
    number: "01",
    title: "Viewport",
    desc: "Catalog your creative process with ease",
    category: "Design tools",
    url: "#",
    new: true,
    accessible: true,
  },
  {
    number: "02",
    title: "Arcade Labs",
    desc: "Solo design agency and venture studio",
    category: "Services",
    url: "#",
    accessible: true,
  },
  {
    number: "03",
    title: "Rolodex",
    desc: "Platform for top freelance designers",
    category: "Marketplace",
    url: "#",
    accessible: true,
  },
  // Confidential/inaccessible (lock icon)
  {
    number: "04",
    title: "Confidential",
    desc: "A new app for tasks and notes",
    category: "Productivity",
    accessible: false,
  },
  // Accessible newsletter, directory, lifestyle
  {
    number: "05",
    title: "HI-FIVE",
    desc: "Sharing top design inspiration each week",
    category: "Newsletter",
    url: "#",
    accessible: true,
  },
  {
    number: "06",
    title: "Dead Simple Sites",
    desc: "Curating the most minimal websites",
    category: "Directory",
    url: "#",
    accessible: true,
  },
  {
    number: "07",
    title: "DETØURED",
    desc: "Outdoor travel storytelling",
    category: "Lifestyle",
    url: "#",
    accessible: true,
  },
  // Dead Simple Supply (NEW)
  {
    number: "08",
    title: "Dead Simple Supply",
    desc: "Website simplification service",
    category: "Services",
    url: "#",
    new: true,
    accessible: true,
  },
  // Inaccessible (lock icon)
  {
    number: "09",
    title: "Vanlife",
    desc: "A mini modular office on wheels",
    category: "Space",
    accessible: false,
  },
  {
    number: "10",
    title: "Confidential",
    desc: "Collapsible storage solution",
    category: "Product",
    accessible: false,
  },
  {
    number: "11",
    title: "Confidential",
    desc: "Modular mobility",
    category: "Transport",
    accessible: false,
  },
  // Books, audiobook, article, ecommerce
  {
    number: "12",
    title: "101 Essays",
    desc: "By Brianna Wiest",
    category: "Book",
    url: "#",
    accessible: true,
  },
  {
    number: "13",
    title: "A Field Guide to Getting Lost",
    desc: "By Rebecca Solnit",
    category: "Book",
    url: "#",
    accessible: true,
  },
  {
    number: "14",
    title: "Inventions",
    desc: "By James Dyson",
    category: "Audiobook",
    url: "#",
    accessible: true,
  },
  {
    number: "15",
    title: "Studio tour",
    desc: "Featured on Workspaces",
    category: "Article",
    url: "#",
    accessible: true,
  },
  {
    number: "16",
    title: "Cure Collection",
    desc: "Automotive apparel that gives back",
    category: "Ecommerce",
    url: "#",
    accessible: true,
  },
];

export default function WorkshopLogPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <header className="mb-8">
        <h1 className="mb-2 text-xl font-medium">Project Log</h1>
        <p className="text-xs text-muted-foreground">Too many ideas, not enough <span className="line-through">time </span>focus.</p>
      </header>
      <div className="divide-y divide-border overflow-hidden bg-background/70">
        {projects.map((item, i) => {
          const isConfidential = !item.accessible;
          return (
            <div
              key={item.number + item.title}
              className={`group grid grid-cols-12 items-center gap-4 py-5 px-4 sm:px-8 transition-colors duration-150 ${
                isConfidential
                  ? "opacity-60 text-muted-foreground cursor-not-allowed"
                  : "hover:bg-muted/40 cursor-pointer"
              }`}
            >
              {/* Number & Title */}
              <div className="col-span-12 sm:col-span-4 flex items-center gap-2">
                <span className="w-6 text-xs tabular-nums text-muted-foreground mr-2">{item.number}</span>
                <span className={`font-medium ${isConfidential ? "text-muted-foreground" : "text-foreground"}`}>{item.title}</span>
                {item.new && (
                  <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] rounded font-bold tracking-wider">NEW</span>
                )}
              </div>
              {/* Description */}
              <div className="col-span-12 sm:col-span-6 text-sm">{item.desc}</div>
              {/* Category & Icon */}
              <div className="col-span-12 sm:col-span-2 flex items-center gap-2 justify-end">
                <span className="text-xs font-mono tracking-tight mr-2 text-muted-foreground">{item.category}</span>
                {item.accessible ? (
                  item.url ? (
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${item.title} externally`}
                      className="transition-colors"
                    >
                      <ArrowUpRight size={16} strokeWidth={2} className="text-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ) : null
                ) : (
                  <span title="Confidential" aria-label="Confidential">
                    <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-ban w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
