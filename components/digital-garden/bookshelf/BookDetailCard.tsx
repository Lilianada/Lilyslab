import React from "react";

interface NoteDetailCardProps {
  slug: string;
  path: string;
  body: string;
  frontmatter: {
    created: string;
    edited: string;
    description: string;
  };
  previousTitle?: string;
  nextTitle?: string;
  category?: string;
  onClose: () => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
}

const NoteDetailCard: React.FC<NoteDetailCardProps> = ({
  slug,
  path,
  body,
  frontmatter,
  previousTitle,
  nextTitle,
  category,
  onClose,
}) => {
  const title = slug.endsWith(".md") ? slug.replace(/\.md$/, "") : slug;
  const createdDate = formatDate(frontmatter.created);
  const editedDate = formatDate(frontmatter.edited);

  // For markdown rendering, you can use a library like react-markdown or similar
  // Here we'll render as plain text for the mock/demo

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative mt-8 w-full max-w-3xl p-2 md:p-4 bg-white rounded-lg shadow-xl" style={{ background: '#F4E8C8' }}>
        <button
          className="absolute top-4 right-4 text-lg font-bold text-gray-600 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="texture" />
        <div className="border px-4 pb-24 pt-4 md:px-10 md:pt-6">
          <div className="mx-auto mt-4 max-w-[65ch] text-[1.2rem]">
            <h1 className="font-sans text-[2.5rem] font-black leading-[1.15] md:text-[3.5rem]">{title}</h1>
            <div className="my-4 border-b border-black" />
          </div>
          <div className="prose prose-sm md:prose-base mb-6">
            {/* Replace with markdown renderer if needed */}
            <p>{body}</p>
          </div>
        </div>
        <div className="mx-auto border-b border-l border-r bg-white rounded-b-lg">
          <div className="flex">
            <span className="flex w-1/3 flex-col items-center gap-2 border-r p-3 md:flex-row">
              <span>Created:</span>
              <span className="font-script text-[20px] sm:text-[24px]">{createdDate}</span>
            </span>
            <span className="flex w-1/3 flex-col items-center gap-2 border-r p-3 md:flex-row">
              <span>Edited:</span>
              <span className="font-script text-[20px] sm:text-[24px]">{editedDate}</span>
            </span>
            <div className="flex w-1/3 flex-col items-center gap-2 p-3 md:flex-row">
              <span>Topic:</span>
              <span className="font-script text-[20px] sm:text-[24px]">{category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailCard;
