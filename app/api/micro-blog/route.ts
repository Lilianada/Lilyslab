import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { safeFormatDate } from '@/lib/utils';

// Define MicroBlog interface
interface MicroBlog {
  id: string;
  title: string;
  content: string;
  date: string;
  likeCount: number;
  slug: string;
}

export async function GET() {
  try {
    const microBlogPath = path.join(process.cwd(), "Content/microBlog");
    const microBlogs: MicroBlog[] = [];

    let files;
    try {
      files = await fs.readdir(microBlogPath);
    } catch (error) {
      console.warn("MicroBlog folder not found:", microBlogPath);
      return NextResponse.json([]);
    }

    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

      const filePath = path.join(microBlogPath, file);
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const published = data.published !== false; // Default to true if not specified
      
      // Skip unpublished micro-blogs
      if (!published) continue;
      
      // Handle dates safely
      const createdAtValue = data.createdAt || data.date;
      const date = safeFormatDate(createdAtValue);

      microBlogs.push({
        id: file.replace(/\.mdx?$/, ''),
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        content,
        date,
        likeCount: data.likeCount || 0,
      });
    }

    // Sort by date (newest first)
    microBlogs.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(microBlogs);
  } catch (error) {
    console.error("Error reading micro-blog entries:", error);
    return NextResponse.json({ error: 'Failed to load micro-blog data' }, { status: 500 });
  }
}

// POST handler for user submissions (goes to Firestore) and like functionality
export async function POST(request: Request) {
  try {
    const { id, action, title, content } = await request.json();
    
    // Handle new micro-blog post submission (save to Firestore for user-generated content)
    if (title && content) {
      const docData = {
        title,
        content,
        date: new Date().toISOString(),
        likeCount: 0,
        createdAt: serverTimestamp(),
        type: 'user-submission' // Mark as user submission
      };

      const docRef = await addDoc(collection(db, 'micro-blog-submissions'), docData);
      return NextResponse.json({ success: true, id: docRef.id });
    }
    
    // Handle like/unlike action (this would be for the static content from markdown files)
    if (!id || !action || (action !== 'like' && action !== 'unlike')) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // For static content likes, you might want to store in a separate collection
    // This is just a placeholder - implement based on your needs
    return NextResponse.json({ success: true, message: 'Like functionality for static content needs implementation' });
  } catch (error) {
    console.error("Error updating micro-blog:", error);
    return NextResponse.json({ error: 'Failed to update micro-blog' }, { status: 500 });
  }
}
