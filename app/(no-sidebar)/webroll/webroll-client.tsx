"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import localFont from 'next/font/local';
import { WebrollLink } from '@/lib/webroll';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const nitti = localFont({
  src: [
    {
      path: '../../../public/fonts/Nitti-Normal.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Nitti-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nitti',
  display: 'swap',
});

const categories = [
  { value: "all", label: "All" },
  { value: "digital-gardens", label: "Digital Gardens" },
  { value: "personal-wikis", label: "Personal Wikis" },
  { value: "portfolios", label: "Portfolios" },
  { value: "web-directories", label: "Web Directories" },
  { value: "512kb", label: "512kb Websites" },
  { value: "misc", label: "Miscellaneous" }
];

interface WebrollClientProps {
  initialLinks: WebrollLink[];
}

export default function WebrollClient({ initialLinks }: WebrollClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [linkInput, setLinkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("digital-gardens");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const filteredLinks = selectedCategory === "all" 
    ? initialLinks
    : initialLinks.filter(link => link.category === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch('/api/webroll/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleInput,
          url: linkInput,
          category: categoryInput,
        }),
      });

      if (response.ok) {
        setSubmitMessage("Thank you! Your submission has been submitted.");
        setLinkInput("");
        setTitleInput("");
        setCategoryInput("digital-gardens");
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitMessage("");
        }, 3000);
      } else {
        setSubmitMessage("Failed to submit. Please try again.");
      }
    } catch (error) {
      setSubmitMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-[368px_1fr] bg-[#f5f5f5] gap-0 lg:gap-4 ${nitti.className}`}>
      {/* Sidebar */}
      <header className="bg-[#0f02d0] border-[1.5px] border-[#69a4ff] lg:max-h-screen lg:h-screen overflow-y-auto p-4 md:p-6 lg:sticky top-0 left-0 w-full lg:w-[368px] z-100 scrollbar-none">
        {/* Back arrow and title */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link 
            href="/" 
            className="text-white hover:text-[#fe3902] transition-colors"
            title="Back to home"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-white text-xl font-bold tracking-wider underline decoration-[#fe3902] decoration-[6px] underline-offset-[-5px]">
            Webroll
          </h2>
        </div>
        
        <nav className="grid gap-6 lg:gap-8">
          {/* Categories */}
          <div>
            <p className="text-white uppercase font-semibold mb-3 md:mb-4 text-sm">Categories</p>
            <ul className="flex flex-wrap gap-x-3 gap-y-2 md:flex-col md:space-y-1 md:gap-0">
              {categories.map((category) => (
                <li key={category.value}>
                  <button
                    onClick={() => setSelectedCategory(category.value)}
                    className={`text-white text-xs md:text-sm py-1 hover:underline hover:decoration-[#fe3902] transition-colors text-left ${
                      selectedCategory === category.value ? 'underline decoration-[#fe3902]' : ''
                    }`}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="link" className="text-xs md:text-sm text-white font-bold tracking-[0.3px]">
              Leave a link
            </label>
            <input
              id="link"
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="px-3 py-2 md:py-2.5 border-[1.5px] border-[#69a4ff] bg-transparent rounded text-white transition-all outline-none focus:border-[#fe3902] focus:bg-[#f5f5f5] focus:text-[#0f02d0] placeholder:text-[#69a4ff] text-sm"
              placeholder="https://yoursite.com/"
              required
            />

            <label htmlFor="title" className="text-xs md:text-sm text-white font-bold tracking-[0.3px]">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="px-3 py-2 md:py-2.5 border-[1.5px] border-[#69a4ff] bg-transparent rounded text-white transition-all outline-none focus:border-[#fe3902] focus:bg-[#f5f5f5] focus:text-[#0f02d0] placeholder:text-[#69a4ff] text-sm"
              placeholder="Your site name"
              required
            />

            <label htmlFor="category" className="text-xs md:text-sm text-white font-bold tracking-[0.3px]">
              Category
            </label>
            <select
              id="category"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="px-3 py-2 md:py-2.5 border-[1.5px] border-[#69a4ff] bg-[#f5f5f5] rounded text-[#0f02d0] transition-all outline-none focus:border-[#fe3902] text-sm"
            >
              {categories.filter(cat => cat.value !== 'all').map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 md:py-2.5 bg-[#fe3902] text-white border-none rounded cursor-pointer font-bold tracking-[0.5px] mt-2 transition-all hover:bg-[#f5f5f5] hover:text-[#fe3902] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            {submitMessage && (
              <p className={`text-sm mt-2 ${submitMessage.includes('Thank you') ? 'text-green-300' : 'text-red-300'}`}>
                {submitMessage}
              </p>
            )}
          </form>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 relative w-full overflow-y-auto grid gap-4 md:gap-6">
        {/* About Section */}
        <section className="border border-[#69a4ff] rounded relative h-fit">
          <span className="absolute -top-3.5 left-[18px] bg-[#f5f5f5] px-3 font-bold text-sm md:text-base text-[#fe3902] tracking-[1px]">
            About
          </span>
          <div className="w-full p-2 relative">
            <Accordion type="single" collapsible defaultValue="about-item" className="w-full">
              <AccordionItem value="about-item" className="border-none">
                <AccordionTrigger className="relative bg-[#0f02d0] text-white select-none cursor-pointer transition-colors py-3.5 px-[38px] hover:no-underline [&>svg]:hidden before:content-['-'] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:transition-all before:text-xl before:text-[#69a4ff] before:pl-2 before:inline-block data-[state=closed]:before:content-['+'] data-[state=open]:before:content-['-']">
                  Read
                </AccordionTrigger>
                <AccordionContent className="p-2 bg-[#f5f5f5] text-[#0f02d0] transition-all">
                  <p className="leading-relaxed">
                    My latest obsession of late has been{" "}
                    <span className="text-[#fe3902]">spreading</span> the word about the
                    indie-web movement, exploring the internet, going down{" "}
                    <span className="text-[#fe3902]">rabbitholes</span> to find websites that
                    genuinely <span className="text-[#fe3902]">interest</span> me.
                    <br />
                    This is a collection of links to digital gardens, personal wikis,
                    portfolios, commonplace books, and web directories that I have
                    found and loved overtime. I have been curating these links for a
                    while now and I do check on them from time to time to make sure
                    they're not <span className="text-[#fe3902]">broken</span>.
                    <br />
                    <br />
                    Feel free to <span className="text-[#fe3902]">leave me a link</span> to
                    your own site if you want it to appear amongst the list.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Links Section */}
        <section className="border border-[#69a4ff] rounded relative h-fit">
          <span className="absolute -top-3.5 left-[18px] bg-[#f5f5f5] px-3 font-bold text-sm md:text-base text-[#fe3902] tracking-[1px]">
            Links {selectedCategory !== "all" && `- ${categories.find(c => c.value === selectedCategory)?.label}`}
          </span>
          <div className="p-2 md:p-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full border-collapse text-sm bg-[#f5f5f5] text-[#0f02d0] mx-auto rounded overflow-hidden">
                <thead>
                  <tr className="bg-[#0f02d0] text-white py-2">
                    <th className="p-2 text-left font-bold w-[70px] tracking-wide">S/N</th>
                    <th className="p-2 text-left font-bold tracking-wide">Title</th>
                    <th className="p-2 text-left font-bold w-[90px] tracking-wide">Link</th>
                  </tr>
                </thead>
                <tbody className="border border-[#69a4ff] border-t-white">
                  {filteredLinks.map((link, index) => (
                    <tr key={link.id} className="border-b border-[#69a4ff] transition-colors hover:bg-[#fe3902] hover:text-white group">
                      <td className="p-2 font-mono">{String(index + 1).padStart(3, '0')}</td>
                      <td className="p-2">
                        {link.title} {link.notes && <span className="text-[#fe3902] group-hover:text-white">{link.notes}</span>}
                      </td>
                      <td className="p-2">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0f02d0] no-underline font-normal text-sm transition-colors group-hover:text-white hover:underline"
                        >
                          Visit →
                        </a>
                      </td>
                    </tr>
                  ))}
                  {filteredLinks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No links found for this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
              {filteredLinks.map((link, index) => (
                <div key={link.id} className="border border-[#69a4ff] rounded bg-[#f5f5f5] p-3 transition-colors hover:bg-[#fe3902] hover:text-white group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs text-[#0f02d0] group-hover:text-white">
                      {String(index + 1).padStart(3, '0')}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0f02d0] text-xs font-medium transition-colors group-hover:text-white hover:underline flex-shrink-0"
                    >
                      Visit →
                    </a>
                  </div>
                  <div className="text-sm text-[#0f02d0] group-hover:text-white">
                    {link.title} {link.notes && <span className="text-[#fe3902] group-hover:text-white">{link.notes}</span>}
                  </div>
                </div>
              ))}
              {filteredLinks.length === 0 && (
                <div className="border border-[#69a4ff] rounded bg-[#f5f5f5] p-4 text-center text-gray-500">
                  No links found for this category.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
