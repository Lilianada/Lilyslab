import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import { RssIcon, FileJson, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'RSS Feeds',
  description: 'Subscribe to Lilyslab RSS feeds to stay updated with the latest content',
};

export default function RssPage() {
  const siteURL = process.env.SITE_URL || 'https://lilyslab.xyz';
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in sm:px-6 py-12">
      <header className="mb-6">
        <h1 className="mb-1 text-xl font-medium">RSS Feeds</h1>
        <p className="text-sm text-muted-foreground">
          Subscribe to stay updated with the latest content from Lilyslab
        </p>
      </header>

      <Separator className="my-6" />

      <div className="prose dark:prose-invert max-w-none">
        <p>
          Lilyslab offers RSS feeds to help you stay updated with the latest content. 
          The feeds include writings, notes, daily logs, micro blog posts, word of the day entries, 
          and logs from the digital garden and workshop.
        </p>

        <h2 className="text-lg font-medium mt-8">Available Feed Formats</h2>
        
        <div className="grid gap-4 mt-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border">
            <div className="mt-1">
              <RssIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-medium">RSS Feed</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Standard RSS 2.0 format, compatible with most feed readers.
              </p>
              <div className="flex gap-2">
                <a 
                  href="/feed" 
                  className="text-sm flex items-center gap-1 text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View RSS Feed</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border">
            <div className="mt-1">
              <RssIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-medium">Atom Feed</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Atom format, an alternative to RSS with some additional features.
              </p>
              <a 
                href="/feed?format=atom" 
                className="text-sm flex items-center gap-1 text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Atom Feed</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border">
            <div className="mt-1">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-medium">JSON Feed</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Modern JSON format for feeds, easier to parse for developers.
              </p>
              <a 
                href="/feed?format=json" 
                className="text-sm flex items-center gap-1 text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View JSON Feed</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-medium mt-8">How to Use</h2>
        <p>
          To subscribe to these feeds, you can use any RSS reader such as:
        </p>
        <ul>
          <li>Feedly</li>
          <li>Inoreader</li>
          <li>NewsBlur</li>
          <li>Feedbin</li>
          <li>NetNewsWire (for macOS/iOS)</li>
        </ul>
        <p>
          Simply add the feed URL to your reader of choice to start receiving updates.
        </p>
      </div>
    </div>
  );
}
