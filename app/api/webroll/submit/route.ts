import { NextResponse } from "next/server";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

const SubmissionSchema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z.string().trim().url().regex(/^https?:\/\//i).max(500),
  category: z.string().trim().min(1).max(50),
});

// Saved to Firestore because the filesystem is read-only once deployed.
export async function POST(request: Request) {
  let submission: z.infer<typeof SubmissionSchema>;
  try {
    submission = SubmissionSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Please check the title and link and try again" }, { status: 400 });
  }

  try {
    await addDoc(collection(db, "webroll-submissions"), {
      ...submission,
      createdAt: serverTimestamp(),
      reviewed: false,
    });
    return NextResponse.json({ message: "Submission saved successfully" });
  } catch (error) {
    console.error("Error saving webroll submission:", error);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
