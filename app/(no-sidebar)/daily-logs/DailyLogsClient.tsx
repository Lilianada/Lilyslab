'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DailyLog } from '@/lib/daily-logs';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import { Markdown } from '@/components/comps/markdown';
import { LayoutGrid, List, ArrowLeft } from 'lucide-react';

interface DailyLogsPageProps {
  logs: DailyLog[];
}

export default function DailyLogsClient({ logs }: DailyLogsPageProps) {
  const [sortedLogs, setSortedLogs] = useState<DailyLog[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [windowWidth, setWindowWidth] = useState(0);
  const [explanationLog, setExplanationLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    // Sort logs by date (newest first)
    const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSortedLogs(sorted);

    // Find the explanation log
    const whyLog = logs.find(log => 
      log.content.toLowerCase().includes("why i keep logs") || 
      log.slug.toLowerCase().includes("why")
    );
    
    if (whyLog) {
      setExplanationLog(whyLog);
    }
    
    // Set window width for responsive design
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [logs]);
  
  // Calculate columns based on width
  const getColumnCount = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };
  
  // Format date to display in a clean style
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Truncate content to maintain consistent card sizes
  const truncateContent = (content: string, maxLength: number = 280) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Daily Logs</h1>
            {explanationLog && (
              <Link 
                href={`#${explanationLog.slug}`} 
                className="text-orange-500 hover:text-orange-600 underline text-lg font-medium transition-colors"
              >
                why?
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-2 border-2 border-black">
            <button 
              className={`p-3 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`p-3 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        {viewMode === 'grid' ? (
          <Masonry
            breakpointCols={{
              default: 3,
              1024: 2,
              640: 1
            }}
            className="flex gap-6"
            columnClassName="flex flex-col gap-6"
          >
            {sortedLogs.map((log) => {
              const isExplanationLog = explanationLog && log.id === explanationLog.id;
              
              return (
                <motion.article
                  key={log.id}
                  id={isExplanationLog ? log.slug : undefined}
                  className="border-2 border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  {/* Card Header */}
                  <header className="border-b-2 border-black p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold leading-tight">{log.slug}</h2>
                      <time className="text-sm text-gray-600 whitespace-nowrap">
                        #{sortedLogs.findIndex(l => l.id === log.id) + 1}, {formatDate(log.createdAt)}
                      </time>
                    </div>
                  </header>
                  
                  {/* Card Content */}
                  <div className="p-4">
                    <div className="prose prose-sm max-w-none">
                      <Markdown content={truncateContent(log.content)} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </Masonry>
        ) : (
          <div className="space-y-4">
            {sortedLogs.map((log, index) => (
              <motion.article 
                key={log.id}
                id={explanationLog && log.id === explanationLog.id ? log.slug : undefined}
                className="border-2 border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{log.slug}</h2>
                    <p className="text-gray-600 text-sm">
                      {truncateContent(log.content.replace(/[#*`]/g, ''), 150)}
                    </p>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-sm text-gray-600">#{index + 1}</div>
                    <time className="text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </time>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black mt-16 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Decorative line */}
            <div className="w-24 h-1 bg-black"></div>
            
            {/* Back link */}
            <motion.div 
              className="border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/" 
                className="flex items-center gap-2 px-6 py-3 font-bold text-lg"
              >
                <ArrowLeft size={20} />
                Back to Lily's Lab
              </Link>
            </motion.div>
            
            {/* Copyright */}
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              © {new Date().getFullYear()} • Daily Logs Archive
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
