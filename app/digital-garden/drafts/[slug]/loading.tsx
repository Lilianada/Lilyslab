export default function LoadingDraftSlugPage() {
  return (
    <div className="prose dark:prose-invert max-w-2xl mx-auto py-12 px-4">
      <div className="h-8 w-1/2 bg-muted animate-pulse rounded mb-4" />
      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-8" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
