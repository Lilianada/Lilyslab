export default function LoadingDraftsPage() {
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container max-w-3xl mx-auto px-0 sm:px-4 py-8">
        <div className="flex flex-col mb-8">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mb-1" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-baseline py-2">
              <span className="w-28 h-4 bg-muted animate-pulse rounded mr-2" />
              <span className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
