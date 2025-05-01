"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, CheckSquare, Square, Mail, Linkedin, Sprout, ArrowUpNarrowWide, Blocks, HeartHandshake, Sparkles, CreditCard } from "lucide-react";
import Image from "next/image";

// Interface for the bucket list item data (should match API)
interface BucketListItem {
  id: string;
  slug: string;
  title: string;
  checked: boolean;
}

// Interface for the role specifications
interface Spec {
  category: string;
  details: string;
}

const specifications: Spec[] = [
  {
    category: "Roles",
    details: "Associate Product Manager / Engineering Manager / Project Manager",
  },
  {
    category: "Countries",
    details: "USA / UK / Mexico / Canada / France / Germany",
  },
];

const lookingForItems = [
  {
    title: "A Place to Learn and Grow",
    description:
      "I'm prioritizing learning in my next role. I haven't had the opportunity to receive consistent feedback or mentorship, so I'm looking for a team where I can learn from people more experienced than me — through direct feedback, shadowing, and honest conversations.",
      icon: <Sprout className="text-extra-green" size={16} />
  },
  {
    title: "Mentorship and Leadership",
    description:
      "I've often found myself in leadership roles, and while I'm grateful for those experiences, I'd love to be in a space where I'm led — where I can be guided, challenged, and supported to grow stronger in my craft and career path.",
      icon: <ArrowUpNarrowWide className="text-extra-peach" size={16} />
  },
  {
    title: "Structure and Stability",
    description:
      "I'm looking for a company with clear systems and structures in place — especially around onboarding, performance management, and team collaboration. I thrive better when there's direction, expectations, and rhythm.",
      icon: <Blocks className="text-extra-steelBlue" size={16} />
  },
  {
    title: "A Healthy, Supportive Work Culture",
    description:
      "I want to work in an environment where people are kind, collaborative, and open. A place that values both individuality and teamwork. Somewhere I can belong, not just fit in.",
      icon: <HeartHandshake className="text-extra-pink" size={16} />
  },
  {
    title: "A Product I Can Be Proud Of",
    description:
      "I'd love to contribute to building or supporting a product that solves real problems or inspires people — something innovative, meaningful, or simply delightful.",
      icon: <Sparkles className="text-extra-lavender" size={16} />
  },
  {
    title: "Great Compensation and Benefits",
    description:
      "While a competitive salary is important, I also value holistic benefits like: Health insurance, Paid leave and mental health days, Work-from-home support (laptop, desk setup, internet), Learning stipends or development budgets.", 
      icon: <CreditCard className="text-extra-paleYellow" size={16} />
  },
];

// --- Skeleton Component --- //
const BucketListItemSkeleton: React.FC = () => (
  <li className="flex items-center p-3 border rounded-md bg-card animate-pulse">
    <div className="mr-3 h-5 w-5 rounded bg-muted"></div> {/* Skeleton for checkbox */}
    <div className="flex-1 h-4 bg-muted rounded"></div> {/* Skeleton for text */}
  </li>
);

// --- Main Page Component --- //
export default function BucketListPage() {
  const [bucketListItems, setBucketListItems] = useState<BucketListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBucketList() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/bucket-list");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to load bucket list' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: BucketListItem[] = await response.json();
        // Simulate loading delay for skeleton visibility (remove in production)
        // await new Promise(resolve => setTimeout(resolve, 1500));
        setBucketListItems(data);
      } catch (err) {
        console.error("Failed to load bucket list:", err);
        const message = err instanceof Error ? err.message : "Failed to load bucket list.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadBucketList();
  }, []);

  // Render loading state with skeletons
  const renderLoading = () => (
    <ul className="space-y-3 list-none pl-0">
      {Array.from({ length: 3 }).map((_, index) => (
        <BucketListItemSkeleton key={`skel-${index}`} />
      ))}
    </ul>
  );

  const renderError = () => (
    <div className="text-center py-10 text-red-500 border border-destructive/50 bg-destructive/10 rounded-lg p-4">
      {error}
    </div>
  );

  // Custom Checkbox Component
  const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
    return checked ? (
      <CheckSquare className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
    ) : (
      <Square className="mr-3 h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
    );
  };

  return (
    <div className="min-h-screen animate-fade-in">
    <div className="container max-w-3xl mx-auto p-0 sm:px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="mb-1 text-xl font-medium">Career Bucket List
          </h1>
          <p className="text-sm text-muted-foreground">
            My aspirations and target companies for the next step.
          </p>
        </div>
        </header>

        <div className="w-full h-40 bg-extra-yellow/50 rounded-lg border border-extra-peach/50 mb-8">
          <Image 
          src='/walpaper.jpeg'
          alt='walpaper'
          width={100}
          height={100}
          className="object-cover"
          />
        </div>

        <section className="mb-16">
          <h2 className="text-base font-medium tracking-tight mb-6 border-b pb-3 text-foreground">What I&apos;m Looking For</h2>
          <ol className="space-y-8 list-none pl-0">
            {lookingForItems.map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="text-sm font-mono">{index + 1}.</span>
                <div>
                  <h3 className="font-medium text-sm mb-1.5 text-foreground flex gap-2">{item.title} {item.icon}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16">
            <h2 className="text-base font-medium tracking-tight mb-6 border-b pb-3 text-foreground">Target Companies</h2>
            {isLoading ? renderLoading() : error ? renderError() : (
                <ul className="space-y-3 list-none pl-0">
                    {bucketListItems.length > 0 ? bucketListItems.map((item) => (
                        <li key={item.id} className="flex items-center p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                             <CustomCheckbox checked={item.checked} />
                             <span className={`flex-1 text-sm ${item.checked ? 'text-muted-foreground line-through decoration-muted-foreground/80' : 'text-card-foreground'}`}>
                                {item.title}
                             </span>
                         </li>
                    )) : (
                        <p className="text-muted-foreground italic text-center py-4">No target companies listed yet.</p>
                    )}
                 </ul>
            )}
        </section>

        <section className="mb-16">
          <h2 className="text-base font-medium tracking-tight mb-6 border-b pb-3 text-foreground">Specifications</h2>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium text-muted-foreground w-1/4">Category</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {specifications.map((spec) => (
                  <tr key={spec.category} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-card-foreground align-top">{spec.category}</td>
                    <td className="p-4 text-muted-foreground">{spec.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="text-center border-t pt-10 mt-16">
         <h2 className="text-base font-medium tracking-tight mb-4 text-foreground">Referrals Appreciated!</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto leading-relaxed">
            If you know someone working at any of these places who might be able to provide a referral or a friendly recommendation, I&apos;d be incredibly grateful. Please feel free to reach out!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="mailto:your-email@lilianokeke.ca@gmail.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <Mail className="mr-2 h-4 w-4" /> Email Me
            </Link>
            <Link href="https://www.linkedin.com/in/lilianada/"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
} 