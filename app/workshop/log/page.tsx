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
      <h1 className="text-2xl font-bold mb-10 tracking-tight">Workshop Log</h1>
      <div className="divide-y divide-border rounded-xl overflow-hidden bg-background/70">
        {projects.map((item, i) => {
          const isConfidential = !item.accessible;
          return (
            <div
              key={item.number + item.title}
              className={`grid grid-cols-12 items-center gap-4 py-5 px-4 sm:px-8 transition-colors duration-150 ${
                isConfidential ? "opacity-60 text-muted-foreground" : "hover:bg-muted/40"
              }`}
            >
              {/* Number & Title */}
              <div className="col-span-12 sm:col-span-4 flex items-center gap-2">
                <span className="w-6 text-xs tabular-nums text-muted-foreground">{item.number}</span>
                <span className={`font-medium ${isConfidential ? "text-muted-foreground" : "text-foreground"}`}>{item.title}</span>
                {item.new && (
                  <span className="ml-2 px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] rounded font-bold tracking-wider">NEW</span>
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
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ArrowUpRight size={16} strokeWidth={2} />
                    </Link>
                  ) : null
                ) : (
                  <Lock size={16} className="text-muted-foreground" aria-label="Locked" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
