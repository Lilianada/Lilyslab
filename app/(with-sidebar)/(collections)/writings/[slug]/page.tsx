import { readMarkdownFile } from '@/lib/markdown-utils';
import MarkdownRenderer from '@/components/markdown';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { Footer } from '@/components/layout/footer';

interface WritingPageProps {
  params: {
    slug: string;
  };
}

export default function WritingPage({ params }: WritingPageProps) {
  // In a real implementation, you would fetch the specific file based on the slug
  // For this example, we'll read a sample file from the Content directory
  
  // Example path - you would replace this with actual path based on the slug
  const filePath = `Content/writings/sample-essay.md`;
  
  // In a real implementation, handle this with proper error handling
  // and show a 404 if the file doesn't exist
  let content = "# Example Essay\n\nThis is a placeholder for when the actual file is not found.";
  let frontmatter: Record<string, any> = { title: "Example Essay", date: new Date().toISOString() };
  
  try {
    const markdownFile = readMarkdownFile(filePath);
    content = markdownFile.content;
    frontmatter = markdownFile.frontmatter || frontmatter;
  } catch (error) {
    // In development, we'll use a fallback content
    // In production, you might want to redirect to a 404 page
    console.error("File not found or error reading file:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <ScrollProgress 
        color="bg-primary" 
        height={3} 
        glow={true}
        glowColor="rgba(var(--primary), 0.6)"
        glowIntensity="12px"
      />
      <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{frontmatter.title}</h1>
          {frontmatter.date && (
            <p className="text-sm text-muted-foreground">
              {formatDate(frontmatter.date)}
            </p>
          )}
        </header>
        
        <article className="mb-12">
          <MarkdownRenderer content={content} className="text-lg" />
        </article>
        
        <Footer />
      </div>
    </>
  );
}
