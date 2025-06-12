'use client';

import Link from "next/link";

interface Topic {
  title: string;
  completed?: boolean;
  url?: string;
}

export function TopicsList() {
  const topics: Topic[] = [
    { title: "Digital Garden", completed: false, url: "/garden/writings/digital-garden" },
    { title: "Digital Zettelkasten", completed: false, url: "/garden/writings/digital-zettelkasten" },
    { title: "Digital Library", completed: false },
    { title: "Commonplace book", completed: false, url: "/garden/writings/commonplace-book" },
    { title: "Relationship between Digital Garden and Zettelkasten or how they are similar", completed: false },
    { title: "Journalling", completed: false },
    { title: "Indie web", completed: false },
    { title: "Indie developer", completed: false },
    { title: "Personal wiki", completed: false },
    { title: "Minimalism", completed: false },
    { title: "Personal knowledge management", completed: false, url: "/garden/writings/personal-knowledge-management" },
    { title: "Atomic notes", completed: false },
    { title: "Seedlings", completed: false },
    { title: "Budding notes", completed: false },
    { title: "Evergreen notes", completed: false },
    { title: "How I Take My Notes", completed: false, url: "/garden/writings/how-i-take-my-notes" },
    { title: "How to create your digital garden", completed: false },
    { title: "Social Media peformance", completed: false },
    { title: "Rabbitholes", completed: false, url: "/garden/writings/rabbitholes" },
    { title: "Content curation", completed: false },
    { title: "50 things I know", completed: false },
    { title: "How I Create My Wikis", completed: false },
    { title: "Why Start a Digital Garden?", completed: false },
    { title: "Map of Content", completed: false },
    { title: "HTML over Jekyll for static websites", completed: false },
    { title: "HTML and CSS", completed: false },
    { title: "Javascript", completed: false },
    { title: "Projects as Seedlings", completed: false, url: "/garden/writings/projects-as-seedlings" },
    { title: "Digital Minimalism", completed: false },
    { title: "My Chi", completed: false },
    { title: "My Name", completed: false },
    { title: "Why I Read", completed: false },
    { title: "Why I Write", completed: false },
  ];
  
  return (
    <div className="py-2">
      <h3 className="text-sm font-medium mb-3">Here are a few of my favourite seedlings:</h3>
      
      <ol className="space-y-1.5 list-decimal pl-6">
       {topics.map((topic, index) => (
          <li key={index} className="pl-1 relative">
            <div className="flex items-center gap-2">
              {topic.completed && topic.url ? (
                <Link href={topic.url} className="text-primary dark:text-codeRed hover:underline">
                  {topic.title}
                </Link>
              ) : (
                <span className="text-muted-foreground">
                  {topic.title}
                </span>
              )}
              <div className="mx-2 flex-grow border-b border-dashed border-muted-foreground/30"></div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                2025-00-00
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
