"use client";

import Link from "next/link";

interface Topic {
  title: string;
  completed?: boolean;
  url?: string;
}

export function TopicsList() {
  const topics: Topic[] = [
    {
      title: "Digital Garden",
      completed: true,
      url: "/garden/essays/digital-garden",
    },
    { title: "My Digital Garden", completed: true, url: "/garden/essays/my-digital-garden" },
    { title: "My Website is a House", completed: true, url: "/garden/essays/my-website-is-a-house" },
    { title: "Why I Write", completed: true, url: "/garden/essays/why-i-write" },
    {
      title: "Information Diet",
      completed: true,
      url: "/garden/essays/information-diet",
    },
    { title: "Rabbitholes", completed: true, url: "/garden/essays/rabbit-holes" },
    {
      title: "Digital Minimalism",
      completed: true,
      url: "/garden/notes/digital-minimalism",
    },
    {
      title: "Digital Zettelkasten",
      completed: true,
      url: "/garden/essays/digital-zettelkasten",
    },
    {
      title: "A Letter to the One We Lost",
      completed: true,
      url: "/garden/essays/a-letter-to-the-one-we-lost",
    },
    {
      title: "How I Take My Notes",
      completed: true,
      url: "/garden/essays/how-i-take-my-notes",
    },
    {
      title: "Commonplace book",
      completed: true,
      url: "/garden/essays/commonplace-book",
    },
    {
      title: "Personal knowledge management",
      completed: true,
      url: "/garden/notes/personal-knowledge-management",
    },
    { title: "IndieWeb Manifesto", completed: true, url: "/manifesto" },
  ];

  return (
    <div className="py-2">
      <h3 className="text-sm font-medium mb-3">
        Some of my favorite essays and notes:
      </h3>

      <ol className="space-y-1.5 list-decimal pl-6">
        {topics
          .filter((topic) => topic.completed === true || topic.url)
          .map((topic, index) => (
            <li key={index} className="pl-1 relative">
              {topic.completed && topic.url && (
                <Link href={topic.url} className="text-codeRed hover:underline flex items-center gap-2">
                  <>
                    {topic.title}

                    <div className="mx-2 flex-grow border-b border-dashed border-muted-foreground/30"></div>
                    <span className="text-xs text-muted-foreground">Read</span>
                  </>
                </Link>
              )}
            </li>
          ))}
      </ol>
    </div>
  );
}
