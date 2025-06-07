export default function NoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-10 flex flex-col min-h-screen" role="region" aria-label="Main content"> 
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}