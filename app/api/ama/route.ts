import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const AMA_DIR = path.join(process.cwd(), "Content", "amaQuestions");

export async function GET() {
  try {
    // Read all questions as objects
    await fs.mkdir(AMA_DIR, { recursive: true });
    const files = await fs.readdir(AMA_DIR);
    const questions = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const filePath = path.join(AMA_DIR, file);
          const content = await fs.readFile(filePath, "utf-8");
          // Extract frontmatter and question
          const match = content.match(/^---([\s\S]*?)---\s*([\s\S]*)$/);
          type AMAQuestion = {
            name: string;
            email: string;
            date: string;
            response: string;
            question: string;
            filename: string;
          };
          let meta: Partial<AMAQuestion> = {}, question = "";
          if (match) {
            const yaml = match[1];
            question = match[2].trim();
            yaml.split("\n").forEach(line => {
              const [key, ...rest] = line.split(":");
              if (key && rest.length > 0) meta[key.trim() as keyof AMAQuestion] = rest.join(":").trim().replace(/^"|"$/g, "");
            });
          }
          return {
            name: meta.name || "Anonymous",
            email: meta.email || "",
            date: meta.date || "",
            response: meta.response || "",
            question,
            filename: file
          };
        })
    );
    // Most recent first
    questions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("API: Error fetching AMA questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, question } = body;
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    await fs.mkdir(AMA_DIR, { recursive: true });
    const files = await fs.readdir(AMA_DIR);
    const nums = files
      .map(f => parseInt(f.replace(/\.md$/, ""), 10))
      .filter(n => !isNaN(n));
    const nextNum = (nums.length > 0 ? Math.max(...nums) : 0) + 1;
    const filename = String(nextNum).padStart(3, "0") + ".md";
    const now = new Date().toISOString();
    const md = `---\nname: "${name || "Anonymous"}"\nemail: "${email || ""}"\ndate: "${now}"\nresponse: ""\n---\n${question}\n`;
    await fs.writeFile(path.join(AMA_DIR, filename), md, "utf-8");
    return NextResponse.json({ success: true, filename });
  } catch (error: any) {
    console.error("API: Error submitting AMA question:", error);
    return NextResponse.json({ error: "Failed to submit question", details: error.message }, { status: 500 });
  }
}
