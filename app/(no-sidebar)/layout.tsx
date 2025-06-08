export default function NoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <div className="flex-1 flex flex-col min-h-screen" role="region" aria-label="Main content"> 
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}