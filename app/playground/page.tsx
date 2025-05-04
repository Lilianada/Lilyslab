import Link from "next/link";
import { Calculator, Pencil, Sparkles, Flame, Timer } from "lucide-react";

export const metadata = {
  title: "Playground | Lilyslab",
  description: "Interactive web experiments and small projects to explore ideas and technologies.",
};

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-3xl mx-auto sm:px-4 py-12">
        <header className="mb-12">
          <h1 className="mb-2 text-xl font-medium">Playground</h1>
          <p className="text-sm text-muted-foreground">
            A space for experimental web interactions, mini-projects, and interactive demos. 
            These are small exercises, proof-of-concepts, and digital toys I've created while exploring new technologies.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Calculator */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms" }}>
            <Link
              href="/playground/calculator"
              className="flex items-center gap-3 rounded-md border p-4 transition-colors hover:bg-accent"
            >
              <Calculator size={20} className="text-primary" />
              <div>
                <h2 className="font-medium text-sm">Calculator</h2>
                <p className="text-xs text-muted-foreground">
                  A simple calculator with basic arithmetic operations
                </p>
              </div>
            </Link>
          </div>

          {/* Note Widgets */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Link
              href="/playground/note-widgets"
              className="flex items-center gap-3 rounded-md border p-4 transition-colors hover:bg-accent"
            >
              <Pencil size={20} className="text-primary" />
              <div>
                <h2 className="font-medium text-sm">Note Widgets</h2>
                <p className="text-xs text-muted-foreground">
                  Interactive widgets for creating and managing notes
                </p>
              </div>
            </Link>
          </div>
          
          {/* Digital Clock */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/playground/digital-clock"
              className="flex items-center gap-3 rounded-md border p-4 transition-colors hover:bg-accent"
            >
              <Timer size={20} className="text-primary" />
              <div>
                <h2 className="font-medium text-sm">Digital Clock</h2>
                <p className="text-xs text-muted-foreground">
                  A responsive digital clock with timer functionality
                </p>
              </div>
            </Link>
          </div>

          {/* Coming Soon: Animation Playground */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-3 rounded-md border p-4 bg-muted/50">
              <Sparkles size={20} className="text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-sm">Animation Playground</h2>
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">Coming Soon</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Interactive experiments with CSS and JavaScript animations
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon: Color Theory */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-3 rounded-md border p-4 bg-muted/50">
              <Flame size={20} className="text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-sm">Color Theory</h2>
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">Coming Soon</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Explore color relationships, palettes, and accessibility
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 p-6 border border-dashed rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            More playground experiments coming soon! Check back regularly for new additions.
          </p>
        </div>
      </div>
    </div>
  );
}
