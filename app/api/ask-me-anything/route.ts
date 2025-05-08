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
    const { name, email, question, questionId, adminResponse } = body;
    
    // Handle admin response to an existing question
    if (questionId && adminResponse) {
      // Verify this is an admin (you should add proper auth check here)
      const filePath = path.join(AMA_DIR, `${questionId}.md`);
      
      try {
        // Read the existing file
        const content = await fs.readFile(filePath, "utf-8");
        
        // Extract frontmatter and question content
        const match = content.match(/^---(\s\S*?)---\s*([\s\S]*)$/);
        if (!match) {
          return NextResponse.json({ error: "Invalid question format" }, { status: 400 });
        }
        
        // Get the frontmatter and question content
        const frontmatter = match[1];
        const questionContent = match[2].trim();
        
        // Update the frontmatter with the response
        const updatedFrontmatter = frontmatter.replace(
          /response: ".*"/,
          `response: "${adminResponse.replace(/"/g, '\\"')}"`
        );
        
        // Format the question content and response
        let formattedContent = questionContent;
        if (!formattedContent.startsWith("Question:")) {
          formattedContent = `Question: ${formattedContent}`;
        }
        
        // Create the updated markdown content with the response
        const updatedContent = `---${updatedFrontmatter}---\n${formattedContent}\n\nResponse: ${adminResponse}`;
        
        // Write the updated content back to the file
        await fs.writeFile(filePath, updatedContent, "utf-8");
        
        return NextResponse.json({ success: true, questionId });
      } catch (error: any) {
        console.error("API: Error updating question with admin response:", error);
        return NextResponse.json(
          { error: "Failed to update question with admin response", details: error.message },
          { status: 500 }
        );
      }
    }
    
    // Handle new question submission
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
    const md = `---\nname: "${name || "Anonymous"}"\nemail: "${email || ""}"\ndate: "${now}"\nresponse: ""\n---\n${question}`;
    await fs.writeFile(path.join(AMA_DIR, filename), md, "utf-8");
    return NextResponse.json({ success: true, filename });
  } catch (error: any) {
    console.error("API: Error submitting AMA question:", error);
    return NextResponse.json({ error: "Failed to submit question", details: error.message }, { status: 500 });
  }
}
