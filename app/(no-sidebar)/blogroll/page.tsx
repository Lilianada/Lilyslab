"use client";

import React, { useState } from "react";
import Link from "next/link";
import localFont from 'next/font/local';

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

// Mock data for now - you can replace this with actual data later
const mockLinks = [
  {
    id: 1,
    title: "Kenan.fyi",
    url: "https://kenan.fyi/",
    category: "digital-gardens"
  },
  {
    id: 2,
    title: "Maggie Appleton",
    url: "https://maggieappleton.com/",
    category: "digital-gardens"
  },
  {
    id: 3,
    title: "Tom Critchlow",
    url: "https://tomcritchlow.com/",
    category: "digital-gardens"
  },
  {
    id: 4,
    title: "Andy Matuschak",
    url: "https://notes.andymatuschak.org/",
    category: "personal-wikis"
  },
  {
    id: 5,
    title: "Gwern",
    url: "https://www.gwern.net/",
    category: "personal-wikis"
  }
];

const categories = [
  { value: "postrolls", label: "Postrolls" },
  { value: "portfolios", label: "Portfolios" },
  { value: "web-directories", label: "Web Directories" },
  { value: "digital-gardens", label: "Digital Gardens" },
  { value: "personal-wikis", label: "Personal Wikis" },
  { value: "personal-websites", label: "Personal Websites" },
  { value: "miscellaneous", label: "Miscellaneous" }
];

export default function BlogrollPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("postrolls");

  const filteredLinks = selectedCategory 
    ? mockLinks.filter(link => link.category === selectedCategory)
    : mockLinks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ linkInput, titleInput, categoryInput });
    // Reset form
    setLinkInput("");
    setTitleInput("");
    setCategoryInput("postrolls");
  };

  return (
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-[368px_1fr] bg-[#f5f5f5] gap-4 ${nitti.className}`}>
      {/* Sidebar */}
      <header className="bg-[#0f02d0] border-[1.5px] border-[#69a4ff] max-h-screen h-screen overflow-y-auto p-6 sticky top-0 left-0 w-full lg:w-[368px] z-100 scrollbar-none">
        <h2 className="text-white text-xl font-bold tracking-wider mb-8 underline decoration-[#fe3902] decoration-[6px] underline-offset-[-5px]">
          BLOGROLL
        </h2>
        
        <nav className="grid gap-8 mt-8">
          {/* Categories */}
          <div className="flex flex-col lg:flex-row gap-10">
            <div>
              <p className="text-white uppercase text-base mb-4">Categories</p>
              <ul className="flex flex-col space-y-1">
                {categories.map((category) => (
                  <li key={category.value}>
                    <button
                      onClick={() => setSelectedCategory(selectedCategory === category.value ? null : category.value)}
                      className={`text-white text-sm px-2 py-1 hover:underline hover:decoration-[#fe3902] transition-colors text-left ${
                        selectedCategory === category.value ? 'underline decoration-[#fe3902]' : ''
                      }`}
                    >
                      {category.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="hidden lg:flex flex-col gap-3.5">
            <label htmlFor="link" className="text-sm text-white font-bold tracking-[0.3px]">
              Leave a link
            </label>
            <input
              id="link"
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="px-3 py-2.5 border-[1.5px] border-[#69a4ff] bg-transparent rounded text-[#0f02d0] transition-all outline-none focus:border-[#fe3902] focus:bg-[#f5f5f5]"
              placeholder="https://yoursite.com/"
            />

            <label htmlFor="title" className="text-sm text-white font-bold tracking-[0.3px]">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="px-3 py-2.5 border-[1.5px] border-[#69a4ff] bg-transparent rounded text-[#0f02d0] transition-all outline-none focus:border-[#fe3902] focus:bg-[#f5f5f5]"
              placeholder="Your site name"
            />

            <label htmlFor="category" className="text-sm text-white font-bold tracking-[0.3px]">
              Category
            </label>
            <select
              id="category"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="px-3 py-2.5 border-[1.5px] border-[#69a4ff] bg-[#f5f5f5] rounded text-[#0f02d0] transition-all outline-none focus:border-[#fe3902]"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="py-2.5 bg-[#fe3902] text-white border-none rounded cursor-pointer font-bold tracking-[0.5px] mt-2 transition-all hover:bg-[#f5f5f5] hover:text-[#fe3902] focus:outline-none"
            >
              Submit
            </button>
          </form>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-4 relative w-full overflow-y-auto grid gap-6">
        {/* About Section */}
        <section className="border border-[#69a4ff] rounded relative h-fit">
          <span className="absolute -top-3.5 left-[18px] bg-[#f5f5f5] px-3 font-bold text-base text-[#fe3902] tracking-[1px]">
            About
          </span>
          <details className="w-full p-2 relative" open>
            <summary className="relative p-2 bg-[#0f02d0] text-white select-none list-none cursor-pointer transition-colors py-3.5 px-[38px] before:content-['-'] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:transition-all before:text-xl before:text-[#69a4ff] before:pl-2 before:inline-block">
              Read
            </summary>
            <div className="p-2 bg-[#f5f5f5] text-[#0f02d0] max-h-[500px] opacity-100 transition-all">
              <p className="leading-relaxed">
                My latest obsession of late has been{" "}
                <span className="text-[#fe3902]">spreading</span> the word about the
                indie-web movement, exploring the internet, going down{" "}
                <span className="text-[#fe3902]">rabbitholes</span> to find websites that
                genuinely <span className="text-[#fe3902]">interest</span> me.
                <br />
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
            </div>
          </details>
        </section>

        {/* Links Section */}
        <section className="border border-[#69a4ff] rounded relative h-fit">
          <span className="absolute -top-3.5 left-[18px] bg-[#f5f5f5] px-3 font-bold text-base text-[#fe3902] tracking-[1px]">
            Links {selectedCategory && `- ${categories.find(c => c.value === selectedCategory)?.label}`}
          </span>
          <div className="p-4">
            <table className="w-full border-collapse text-sm bg-[#f5f5f5] text-[#0f02d0] mx-auto rounded overflow-hidden">
              <thead>
                <tr className="bg-[#0f02d0] text-white">
                  <th className="p-2 text-left font-normal w-[70px]">S/N</th>
                  <th className="p-2 text-left font-normal">Title</th>
                  <th className="p-2 text-left font-normal w-[90px]">Link</th>
                </tr>
              </thead>
              <tbody className="border border-[#69a4ff]">
                {filteredLinks.map((link, index) => (
                  <tr key={link.id} className="border-b border-[#69a4ff] border-r border-[#69a4ff] transition-colors hover:bg-[#fe3902] hover:text-white">
                    <td className="p-2">{String(index + 1).padStart(3, '0')}</td>
                    <td className="p-2">{link.title}</td>
                    <td className="p-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0f02d0] no-underline font-normal text-sm transition-colors hover:text-white hover:underline"
                      >
                        Visit →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
