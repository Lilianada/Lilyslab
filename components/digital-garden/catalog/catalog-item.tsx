"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface CatalogItemProps {
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
  link: string;
  date?: string;
  isExternal?: boolean;
}

export default function CatalogItem({
  title,
  description,
  image,
  tags,
  link,
  date,
  isExternal = false,
}: CatalogItemProps) {
  const content = (
    <Card className="h-full flex flex-col overflow-hidden group hover:border-primary transition-colors duration-200">
      {image && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="p-4 pb-2">
        <h3 className="text-base font-medium group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 items-center">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        {date && <span className="text-xs text-muted-foreground ml-auto">{date}</span>}
      </CardFooter>
    </Card>
  );

  if (isExternal) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link} className="block h-full">
      {content}
    </Link>
  );
}
