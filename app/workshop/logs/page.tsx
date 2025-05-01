"use client";

import React from 'react';
import { CheckSquare, Square, Circle } from 'lucide-react'; // Using icons for checkboxes
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export default function DailyLogPage() {
  const [dailyLogData, setDailyLogData] = useState<{ sections: any[], footer: any }>({ sections: [], footer: { tags: [], lastUpdated: [] } });

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then((data: { sections: any[] }) => {
        setDailyLogData({
          sections: data.sections,
          footer: {
            tags: ['#daily', '#agenda'],
            lastUpdated: data.sections.length > 0 ? [{ text: data.sections[0].date + ' Log' }] : []
          }
        });
      });
  }, []);

  // Helper to render list items remains largely the same but uses theme colors
  const renderListItem = (item: any, index: number) => {
    const bulletColor = "text-blue-500 dark:text-blue-400";

    return (
      <li key={index} className="mb-1 flex flex-col">
        <div className="flex items-start">
          {/* Checkbox or Bullet */}
          {item.hasOwnProperty('checked') ? (
            item.checked ? (
              <CheckSquare size={16} className="mr-2 mt-[3px] text-green-600 dark:text-green-400 flex-shrink-0" aria-label="Checked" />
            ) : (
              <Square size={16} className="mr-2 mt-[3px] text-muted-foreground flex-shrink-0" aria-label="Unchecked" />
            )
          ) : (
            <span className={`mr-2 mt-[6px] text-xs ${bulletColor} flex-shrink-0`} aria-hidden="true">
              <Circle className="w-2 h-2" />
            </span>
          )}

          {/* Text Content */}
          <span className="flex-1 break-words text-foreground text-sm">
            {/* Bold label */}
            {item.label && item.bold ? (
              <>
                <strong>{item.label}:</strong>{' '}
                {item.text}
              </>
            ) : item.linkText && item.link ? (
              <a
                href={item.link}
                className="text-blue-500 dark:text-blue-400 underline"
                aria-label={item.linkText}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.linkText}
              </a>
            ) : (
              item.text
            )}
            {/* Tag */}
            {item.tag && <span className="ml-2 text-gray-400 italic">{item.tag}</span>}
          </span>
        </div>

        {/* Sub Items */}
        {item.subItems && item.subItems.length > 0 && (
          <ul className="ml-8 mt-1 list-none">
            {item.subItems.map((subItem: any, subIndex: number) =>
              renderListItem(subItem, subIndex)
            )}
          </ul>
        )}
      </li>
    );
  };


  return (
    <div className="min-h-screen text-foreground sm:p-8 ">
      <div className="max-w-3xl mx-auto sm:p-6">
        {/* Main Heading - Using theme colors */}
        <header className="mb-8">
          <h1 className="mb-2 text-xl font-medium">Project Logs</h1>
          <p className="text-sm text-zinc-500">A build log of all my new projects.</p>
        </header>

        {/* Sections */}
        {dailyLogData.sections.length === 0 ? (
          // Loading skeletons
          <div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-6">
                <div className="flex items-center mb-3">
                  <Skeleton className="mr-2 h-3 w-3 rounded-full bg-extra-yellow" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <ul className="ml-2 border-l border-border pl-8">
                  {[...Array(3)].map((_, j) => (
                    <li key={j} className="mb-2 flex items-center">
                      <Skeleton className="mr-2 h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-48" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          dailyLogData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-base font-semibold text-primary mb-3 flex items-center">
                <span className="mr-2 h-3 w-3 rounded-full bg-extra-yellow"></span> {/* Bullet for section title */}
                {section.title}
              </h3>
              <ul className="ml-1  border-l border-border pl-8"> {/* Indentation for section items */}
                {section.items.map(renderListItem)}
              </ul>
            </div>
          ))
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border text-sm text-gray-400">
          <div className="mb-2">
            <span className="font-semibold mr-2">tags:</span>
            {dailyLogData.footer.tags.map((tag: string, i: number) => (
              <a key={i} href="#" className="text-blue-400 hover:underline mr-2">
                {tag}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">last updated:</span>
            {dailyLogData.footer.lastUpdated.map((text: { text: string }, i: number) => (
              <React.Fragment key={i}>
                <p className="text-neutral-300 hover:underline">
                  {text.text}
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}