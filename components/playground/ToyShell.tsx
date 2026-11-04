/** The page frame every playground toy shares. */
export function ToyShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in font-mono">
      <div className="max-w-2xl w-full mx-auto pt-16">
        <h1 className="text-xl font-medium mb-1">{title}</h1>
        <p className="text-xs text-muted-foreground mb-8">{intro}</p>
        {children}
      </div>
    </div>
  );
}
