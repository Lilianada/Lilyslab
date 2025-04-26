// Mock notes for bento grid tests
import { colors } from "@/components/digital-garden/bookshelf/BookCard";

export type NoteCategory = "Productivity" | "Focus" | "Creativity" | "Career";

export interface MockNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  created: string;
  image: string;
  author: string;
  authorImage: string;
  year: number;
}

export const mockNotes: MockNote[] = [
  {
    id: "1",
    title: "Succession",
    content: "A deep dive into power dynamics and family relationships in a modern media empire.",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=60",
    author: "Benjamin Roy",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    year: 2023,
    category: "Focus",
    tags: ["quick"],
    created: "2025-04-20",
  },
  {
    id: "2",
    title: "The Bear",
    content: "An intense look at the high-pressure world of fine dining and family legacy.",
    image: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=800&auto=format&fit=crop&q=60",
    category: "Productivity",
    tags: ["routine"],
    created: "2025-04-21",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    year: 2022,
  },
  
  {
    id: "4",
    title: "Poor Things",
    content: "A Victorian tale with a feminist twist and stunning visual storytelling.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60",
    category: "Career",
    tags: ["career", "growth"],
    created: "2025-04-22",
    author: "Emma Stone",
    authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
    year: 2023,
  },
  {
    id: "5",
    title: "Spider-Man: Across the Spider-Verse",
    image: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=800&auto=format&fit=crop&q=60",
    category: "Creativity",
    content: `
   You are a **Senior Front-End Developer** and an **Expert in ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS** and modern **UI/UX frameworks (e.g., TailwindCSS, Shadcn, Radix).**/n
1\. Follow the user’s requirements carefully & to the letter.
2. First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
3. Confirm, then write code!
4. Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines.
5. Focus on easy and readability code, over being performant.
`,
    tags: ["focus", "Career"],
    created: "2025-04-24",
    author: "Phil Lord",
    authorImage: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&auto=format&fit=crop&q=60",
    year: 2023,
  },
  {
    id: "6",
    title: "Barbie",
    content: `You are a Senior Front-End Developer and an Expert in ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS and modern UI/UX frameworks (e.g., TailwindCSS, Shadcn, Radix). \n
    - Follow the user’s requirements carefully & to the letter.\n
    - First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.\n
    - Confirm, then write code!\n
    - Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines.\n
    - Focus on easy and readability code, over being performant.
    `,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&auto=format&fit=crop&q=60",
    category: "Focus",
    tags: ["focus", "Career"],
    created: "2025-04-24",
    author: "Greta Gerwig",
    authorImage: "https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?w=100&auto=format&fit=crop&q=60",
    year: 2023,
  },
  {
    id: "7",
    title: "Oppenheimer",
    content: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    category: "Productivity",
    tags: ["focus", "Career"],
    created: "2025-04-24",
    author: "Christopher Nolan",
    authorImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&auto=format&fit=crop&q=60",
    year: 2023,
  },
  {
    id: "8",
    title: "The Last of Us",
    content: "In a post-apocalyptic world, Joel and Ellie must survive brutal circumstances and ruthless killers.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&auto=format&fit=crop&q=60",
    category: "Career",
    tags: ["drama", "apocalypse", "adaptation"],
    author: "Craig Mazin",
    authorImage: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?w=100&auto=format&fit=crop&q=60",
    year: 2023,
    created: "2025-03-02",
  },
  {
    id: "9",
    title: "Past Lives",
    content: "Nora and Hae Sung, two deeply connected childhood friends, are wrest apart after Nora's family emigrates from South Korea.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&auto=format&fit=crop&q=60",
    category: "Productivity",
    tags: ["romance", "drama", "indie"],
    author: "Celine Song",
    authorImage: "https://images.unsplash.com/photo-1465101178521-c1a9136a3c91?w=100&auto=format&fit=crop&q=60",
    year: 2023,
    created: "2025-04-24",
  },
  
];