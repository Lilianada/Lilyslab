"use client"


import React, { useState } from 'react';
import type { ChangelogEntry } from "@/lib/notion";

interface ChangelogListProps {
  changelogs: ChangelogEntry[];
}

// Individual changelog entry component
const ChangelogItem = ({ entry }: { entry: ChangelogEntry }) => {
    console.log(entry, 'entry')
    
  const [expanded, setExpanded] = useState(false);
  
  // Format date to more readable format
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Set badge color based on changelog type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      case 'fix':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-8 border-b pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <h3 className="text-xl font-medium text-gray-900">{entry.title}</h3>
        <div className="flex items-center mt-2 md:mt-0">
          <span className="text-sm text-gray-500 mr-3">{formattedDate}</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getBadgeColor(entry.type)}`}>
            {entry.type}
          </span>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Category:</span> {entry.category}
      </div>
      
      {!expanded && (
        <div className="prose prose-sm max-w-none line-clamp-3">
          <div dangerouslySetInnerHTML={{ __html: entry.content.substring(0, 150) + '...' }} />
        </div>
      )}
      
      {expanded && (
        <div className="prose prose-sm max-w-none mt-4">
          <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          
          {entry.media && entry.media.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {entry.media.map((item, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={`${entry.title} media ${index}`} 
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <video 
                      src={item.url} 
                      controls 
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center"
      >
        {expanded ? 'Show less' : 'Read more'} 
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
    </div>
  );
};

// Filter component
const ChangelogFilter = ({ 
  categories, 
  selectedCategory,
  onCategoryChange,
  types,
  selectedType,
  onTypeChange
}: { 
  categories: string[],
  selectedCategory: string,
  onCategoryChange: (category: string) => void,
  types: string[],
  selectedType: string,
  onTypeChange: (type: string) => void
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1">
        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          id="type-filter"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Search component
const ChangelogSearch = ({ searchQuery, onSearchChange }: { searchQuery: string, onSearchChange: (query: string) => void }) => {
  return (
    <div className="mb-6">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
        Search
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 pr-3 border"
          placeholder="Search changelogs..."
        />
      </div>
    </div>
  );
};

// Main changelog component
const ChangelogList: React.FC<ChangelogListProps> = ({ changelogs }) => {
    console.log(changelogs, 'changelogs')
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Extract unique categories and types for filters
  const categories = Array.from(new Set(changelogs.map(log => log.category)));
  const types = Array.from(new Set(changelogs.map(log => log.type)));
  
  // Filter changelogs based on selected filters and search query
  const filteredChangelogs = changelogs.filter(changelog => {
    const matchesCategory = selectedCategory === '' || changelog.category === selectedCategory;
    const matchesType = selectedType === '' || changelog.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      changelog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      changelog.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Product Changelog</h1>
        <p className="mt-2 text-lg text-gray-600">
          Stay up to date with the latest updates and improvements
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ChangelogSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <ChangelogFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          types={types}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
        
        {filteredChangelogs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No changelogs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredChangelogs.map((changelog) => (
              <ChangelogItem key={changelog.id} entry={changelog} />
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Subscribe to our newsletter to get changelog updates directly to your inbox.
        </p>
        <div className="mt-3 max-w-md mx-auto">
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 min-w-0 px-3 py-2 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogList;