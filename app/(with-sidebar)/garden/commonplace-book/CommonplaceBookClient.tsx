"use client";

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

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
  }, [selectedTags, searchQuery]);

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
      default:
        return item.author ? `By ${item.author}` : '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-purple-50/40 rounded-lg p-6 backdrop-blur-sm border border-purple-100/50">
              {/* Navigation Categories */}
              <nav className="mb-8">
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          category.active || selectedCategory === category.name
                            ? 'bg-orange-400 text-white'
                            : 'text-gray-700 hover:bg-purple-100/60'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100/60 transition-colors flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Topics List */}
              <div className="mb-8">
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {topics.map((topic) => (
                    <div
                      key={topic.name}
                      className="flex justify-between items-center px-2 py-1 text-sm hover:bg-purple-100/40 rounded cursor-pointer"
                    >
                      <span className="text-gray-700">{topic.name}</span>
                      <span className="text-gray-400 text-xs">{topic.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Tag Filters */}
              <div className="flex flex-wrap gap-2">
                {['DESIGN', 'AESTHETICS', 'WEB', 'CRAFT', 'TOOLS', 'WORK', 'BEAUTY', 'ART'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`w-6 h-6 rounded-full transition-all ${
                      selectedTags.includes(tag)
                        ? 'ring-2 ring-offset-2 ring-orange-400'
                        : ''
                    } ${
                      tag === 'DESIGN' ? 'bg-orange-400' :
                      tag === 'AESTHETICS' ? 'bg-purple-400' :
                      tag === 'WEB' ? 'bg-blue-400' :
                      tag === 'CRAFT' ? 'bg-green-400' :
                      tag === 'TOOLS' ? 'bg-red-400' :
                      tag === 'WORK' ? 'bg-yellow-400' :
                      tag === 'BEAUTY' ? 'bg-pink-400' :
                      'bg-indigo-400'
                    }`}
                    title={tag}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {selectedCategory === 'Spaces' ? 'Aesthetics' : selectedCategory}
              </h1>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Content Grid */}
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <header className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {getTypeLabel(item)}
                    </p>
                    {item.source && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {item.source}
                      </span>
                    )}
                  </header>

                  {item.image && (
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Image placeholder</span>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed italic">
                      {item.content}
                    </p>
                  </div>

                  <footer className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded hover:bg-orange-50 hover:text-orange-700 cursor-pointer transition-colors"
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </footer>
                </article>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No items found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Commonplace Book</h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search titles, content, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => setSearchOpen(false)}
                className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
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
