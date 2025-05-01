import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

// Allowed categories and platforms (adjust if needed)
const ALLOWED_CATEGORIES = ['Development', 'Design', 'Productivity', 'AI & ML', 'Other'] as const;
const PLATFORMS = ['iOS', 'Web', 'Android', 'macOS', 'Windows', 'Linux'] as const;

type ToolSubmission = z.infer<typeof ToolSubmissionSchema>;
const ToolSubmissionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  logo: z.string().url().optional(),
  url: z.string().url(),
  category: z.enum(ALLOWED_CATEGORIES),
  platforms: z.array(z.enum(PLATFORMS)).min(1).max(4)
    .refine(arr => new Set(arr).size === arr.length, 'Duplicate platforms not allowed'),
  published: z.boolean().optional(),
});

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
  }
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  let submission: ToolSubmission;
  try {
    submission = ToolSubmissionSchema.parse(payload);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    throw err;
  }

  // Write submission to Content/tools/submissions
  const submissionsDir = path.join(process.cwd(), 'Content', 'tools', 'submissions');
  await fs.mkdir(submissionsDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeName = submission.name.replace(/\W+/g, '-').toLowerCase();
  const fileName = `${timestamp}-${safeName}.json`;
  const filePath = path.join(submissionsDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(submission, null, 2), 'utf-8');

  return NextResponse.json({ success: true, file: fileName }, { status: 201 });
}
