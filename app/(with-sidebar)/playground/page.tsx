import Link from "next/link";
import { PLAYGROUND_TOYS } from "@/lib/playground-toys";

export const metadata = {
  title: "Playground",
  description: "Games, toys and interactive experiments to poke at.",
};

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="sm:container max-w-3xl mx-auto sm:px-4 pt-16 pb-8">
        <header className="mb-12">
          <h1 className="mb-2 text-xl font-medium">Playground</h1>
          <p className="text-sm text-muted-foreground">
            A space for experimental web interactions, mini-projects, and interactive demos. These are small exercises,
            proof-of-concepts, and digital toys I've created while exploring new technologies.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {PLAYGROUND_TOYS.map(({ href, icon: Icon, title, description }, index) => (
            <div key={href} className="opacity-0 animate-slide-up" style={{ animationDelay: `${index * 60}ms` }}>
              <Link
                href={href}
                className="group flex items-center gap-3 rounded-md border p-4 h-full transition-all duration-200 hover:bg-accent hover:-translate-y-0.5"
              >
                <Icon size={20} className="text-primary flex-shrink-0 transition-transform group-hover:scale-110 group-hover:-rotate-6" />
                <div>
                  <h2 className="font-medium text-sm">{title}</h2>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-muted-foreground text-center font-mono">
          ✳︎ psst. there are secrets outside the playground too. try typing my name. ✳︎
        </p>
      </div>
    </div>
  );
}
