"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft, ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/markdown/markdown-renderer';

interface CommonplaceItem {
  id: string;
  title: string;
  type: 'article' | 'book' | 'quote' | 'thought' | 'device' | 'response';
  author?: string;
  source?: string;
  url?: string;
  content: string;
  tags: string[];
  date: string;
  image?: string;
}

// Mock data - in a real app, this would come from an API
const mockData: CommonplaceItem[] = [
  {
    id: '1',
    title: 'The Nature & Aesthetics of Design',
    type: 'book',
    author: 'David Pye',
    source: 'books.google.com',
    url: 'https://books.google.com',
    content: 'Any imaginable shape / Useless work on useful things / Presentable / The principle of arrangement / The minimum condition / More real than living man / That which requires caring / The informing idea of functionalism / The Mathematical Basis of the Arts',
    tags: ['DESIGN', 'AESTHETICS', 'MAKING', 'STYLE', 'CRAFT', 'BEAUTY'],
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Why does everything online look the same?',
    type: 'article',
    author: 'Caitlin Dewey',
    source: 'thinkingdirectly.substack.com',
    url: 'https://thinkingdirectly.substack.com',
    content: 'An exploration of visual homogenization in digital design and the forces that drive convergence in online aesthetics.',
    tags: ['WEB', 'DESIGN', 'CULTURE'],
    date: '2024-03-10',
  },
  {
    id: '3',
    title: 'Websites as gardens of the Internet ecosystem',
    type: 'response',
    author: 'Tracy Durnell',
    source: 'tracydurnell.com',
    url: 'https://tracydurnell.com',
    content: 'Internet gardening evokes thoughts of the other side of the web: where you are on your own land, cultivating the thoughts on your mind. Letting ideas grow.',
    tags: ['INTERNET', 'GARDENS', 'MICROSITES', 'PERSONALITY', 'AESTHETICS', 'WEB', 'INDIEWEB'],
    date: '2024-03-05',
  },
  {
    id: '4',
    title: 'Teenage Engineering TP–7',
    type: 'device',
    author: 'Teenage Engineering',
    source: 'teenage.engineering',
    url: 'https://teenage.engineering',
    content: 'Google\'s Product Sans (in black) laid on top of Airbnb\'s Cereal (in green). Companies including TikTok, Google, Netflix and Airbnb have trumpeted "new," bespoke fonts that are essentially Proxima Nova.',
    tags: ['DESIGN', 'TYPOGRAPHY', 'BRANDING'],
    date: '2024-02-28',
    image: '/images/tp7.jpg',
  },
  {
    id: '5',
    title: 'On Tools and the Aesthetics of Work',
    type: 'article',
    author: 'Cal Newport',
    source: 'calnewport.com',
    url: 'https://calnewport.com',
    content: 'The modern computer, with its generic styling and overloaded activity, creates a working environment defined by urgent, bland, Sisyphean widget cranking — work as endless Slack and email and Zoom.',
    tags: ['WORK', 'TOOLS', 'AESTHETICS', 'PRODUCTIVITY'],
    date: '2024-02-20',
  },
];

const categories = [
  { name: 'Index', count: mockData.length, active: false },
  { name: 'Extracts', count: 12, active: false },
  { name: 'Creators', count: 8, active: false },
  { name: 'Spaces', count: 24, active: true },
];

const topics = [
  { name: 'art', count: 216 },
  { name: 'Austin Kleon', count: 46 },
  { name: 'beauty', count: 109 },
  { name: 'Bill Mollison', count: 31 },
  { name: 'Boris Müller', count: 5 },
  { name: 'Paul Victor', count: 67 },
  { name: 'Brian Eno', count: 13 },
  { name: 'Brian Hayes', count: 7 },
  { name: 'business', count: 91 },
  { name: 'C. Wright Mills', count: 9 },
  { name: 'Charles Broskoski', count: 4 },
  { name: 'Christopher Alexander', count: 147 },
  { name: 'cities', count: 98 },
  { name: 'code', count: 142 },
  { name: 'collections', count: 61 },
  { name: 'color', count: 89 },
  { name: 'commonplace', count: 26 },
  { name: 'composition', count: 53 },
  { name: 'connection', count: 62 },
  { name: 'construction', count: 23 },
  { name: 'cosmos', count: 12 },
  { name: 'craft', count: 139 },
];

export default function CommonplaceBookClient() {
  const [selectedCategory, setSelectedCategory] = useState('Spaces');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState<CommonplaceItem[]>(mockData);
  const [filteredItems, setFilteredItems] = useState<CommonplaceItem[]>(mockData);
  const [loading, setLoading] = useState(true);
  const [columnCount, setColumnCount] = useState(3); // Start with 3 instead of 4
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle responsive column count and sidebar
useEffect(() => {
  function handleResize() {
    const width = window.innerWidth;
    let columns = 1;

    if (width >= 1400) {
      columns = 3;
    } else if (width >= 1024) {
      columns = 2;
    } else if (width >= 640) {
      columns = 2;
    } // else columns = 1

    setColumnCount(columns);

    // Optionally, handle sidebar logic
    if (width < 640) setSidebarOpen(false);

    console.log('Window width:', width, 'Column count set to:', columns);
  }

  // Run once on mount
  handleResize();

  // Add event listener
  window.addEventListener("resize", handleResize);

  // Cleanup
  return () => window.removeEventListener("resize", handleResize);
}, []);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/commonplace-book');
        if (response.ok) {
          const data = await response.json();
          const combinedItems = [...mockData, ...data.items];
          setAllItems(combinedItems);
          setFilteredItems(combinedItems);
        }
      } catch (error) {
        console.error('Failed to fetch commonplace book data:', error);
        // Fall back to mock data
        setAllItems(mockData);
        setFilteredItems(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allItems;
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredItems(filtered);
  }, [selectedTags, searchQuery, allItems]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getTypeLabel = (item: CommonplaceItem) => {
    switch (item.type) {
      case 'book':
        return `A book by ${item.author}`;
      case 'article':
        return `An article by ${item.author}`;
      case 'device':
        return `A device by ${item.author}`;
      case 'response':
        return `A response by ${item.author}`;
      case 'quote':
        return `A quote by ${item.author}`;
      case 'thought':
        return 'A thought';
      default:
        return item.author ? `By ${item.author}` : '';
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Left Sidebar - Fixed Full Height */}
        <div className={`w-64 fixed left-0 top-0 h-screen bg-muted/10 border-r border-dashed border-muted-foreground/20 overflow-y-auto z-50 transform transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-4">
            {/* Mobile Close Button */}
            <div className="md:hidden mb-4 flex justify-end">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Back Arrow and Navigation Categories */}
            <nav className="mb-6">
              <ul className="space-y-1">
                <li className="mb-3">
                  <Link 
                    href="/"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-2 py-1 text-xs font-medium transition-colors ${
                        category.active || selectedCategory === category.name
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-full text-left px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Search className="w-3 h-3" />
                    Search
                  </button>
                </li>
              </ul>
            </nav>

            {/* Topics List */}
            <div className="mb-6">
              <div className="space-y-0.5">
                {topics.map((topic) => (
                  <div
                    key={topic.name}
                    className="flex justify-between items-center px-1 py-0.5 text-xs hover:bg-muted/30 cursor-pointer"
                  >
                    <span className="text-muted-foreground">{topic.name}</span>
                    <span className="text-muted-foreground/60 text-xs">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {selectedTags.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">Active filters:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground border border-dashed border-muted-foreground/30 text-xs hover:bg-muted/80"
                    >
                      #{tag}
                      <X className="w-2 h-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - With Left Margin for Sidebar */}
        <div className="flex-1 md:ml-64">
          <div className="px-6 py-6">
            {/* Mobile Menu Button */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-muted/30 border border-dashed border-muted-foreground/30 text-xs text-muted-foreground hover:text-foreground"
              >
                <Search className="w-3 h-3" />
                Menu
              </button>
            </div>
            
            {/* Section Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-foreground mb-1">
                {selectedCategory === 'Spaces' ? 'Aesthetics' : selectedCategory}
              </h1>
            </div>

            {/* Content Grid - Masonry Layout */}
            <div 
              className="masonry-grid"
              style={{
                columnCount: columnCount,
                columnGap: '1rem',
                columnFill: 'balance'
              }}
            >
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-background border border-dashed border-muted-foreground/20 p-4 hover:bg-muted/10 transition-colors mb-4 break-inside-avoid"
                  style={{ 
                    width: '100%',
                    display: 'inline-block'
                  }}
                >
                  <header className="mb-3">
                    <h2 className="text-sm font-medium text-foreground mb-1 leading-tight">
                      {item.url ? (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-2">
                      {getTypeLabel(item)}
                    </p>
                    {item.source && (
                      <a
                        href={item.url || `https://${item.source}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center w-fit px-2 py-0.5 bg-muted/50 text-muted-foreground text-xs border border-dashed border-muted-foreground/30 hover:text-foreground hover:bg-muted/70 transition-colors"
                      >
                        {item.source} <ArrowUpRightIcon className='h-3 w-3' />
                      </a>
                    )}
                  </header>

                  {item.image && (
                    <div className="mb-3">
                      <div className="w-full h-32 bg-muted/30 border border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">Image placeholder</span>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <div className="text-[13px] text-muted-foreground leading-relaxed">
                      <MarkdownRenderer content={item.content} />
                    </div>
                  </div>

                  <footer className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="inline-block px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </footer>
                </article>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">No items found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-background border border-dashed border-muted-foreground/20 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Search Commonplace Book</h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search titles, content, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-muted/30 border border-dashed border-muted-foreground/30 text-sm focus:outline-none focus:border-foreground"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={() => setSearchOpen(false)}
                className="px-3 py-1 bg-foreground text-background text-xs hover:bg-muted-foreground"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
