import React from "react";
import { X } from "lucide-react";

interface NoteDetailCardProps {
  slug: string;
  path: string;
  body: string;
  frontmatter: {
    title?: string;
    created: string;
    edited: string;
    description: string;
    category?: string;
  };
  previousTitle?: string;
  nextTitle?: string;
  category?: string;
  onClose: () => void;
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string received: ${dateString}`);
      return 'Invalid Date';
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  } catch (e) {
    console.error(`Error formatting date: ${dateString}`, e);
    return 'Error Date';
  }
}

const BookDetailCard: React.FC<NoteDetailCardProps> = ({
  slug,
  path,
  body,
  frontmatter,
  previousTitle,
  nextTitle,
  category: propCategory,
  onClose,
}) => {
  const title = frontmatter.title || (slug.endsWith(".md") ? slug.replace(/\.md$/, "").replace(/-/g, ' ') : slug.replace(/-/g, ' '));
  const createdDate = formatDate(frontmatter.created);
  const editedDate = formatDate(frontmatter.edited);
  const displayCategory = frontmatter.category || propCategory || 'N/A';

  const renderBody = () => {
    if (!body) {
        return <p className="italic text-muted-foreground">(No description available)</p>;
    }
    return body.split('\n').map((paragraph, index) => (
        paragraph.trim() ? <p key={index}>{paragraph}</p> : null
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] m-4 bg-card border border-border rounded-lg shadow-xl flex flex-col">
        <button
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-6 border-b border-border pb-4">
            <h1 className="font-sans text-2xl md:text-3xl font-bold leading-tight text-foreground">{title}</h1>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 mb-8">
            {renderBody()}
          </div>
        </div>
        <div className="border-t border-border bg-muted/50 rounded-b-lg p-4 text-xs text-muted-foreground">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div>
              <span className="block font-medium text-foreground">Created</span>
              <span>{createdDate}</span>
            </div>
            <div>
              <span className="block font-medium text-foreground">Edited</span>
              <span>{editedDate}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block font-medium text-foreground">Category</span>
              <span>{displayCategory}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailCard;
