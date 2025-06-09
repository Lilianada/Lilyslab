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
          
          // Extract frontmatter and content - more permissive pattern
          const match = content.match(/^---([\s\S]*?)---([\s\S]*)$/);
          
          if (!match) {
            console.log(`Invalid format for file: ${file}`);
            return null;
          }
          
          
          const frontmatter = match[1];
          const responseContent = match[2].trim();
          
          // Parse frontmatter
          const meta: Record<string, string> = {};
          frontmatter.split("\n").forEach(line => {
            const [key, ...rest] = line.split(":");
            if (key && rest.length > 0) {
              const value = rest.join(":").trim();
              meta[key.trim()] = value.replace(/^"|"$/g, "");
            }
          });
          
          return {
            id: file.replace(/\.md$/, ""),
            name: meta.name || "Anonymous",
            email: meta.email || "",
            date: meta.date || "",
            question: meta.question || "",
            response: responseContent || "",
            filename: file
          };
        })
    );
    
    // Filter out null values and sort by date (most recent first)
    const validQuestions = questions.filter(q => q !== null);
  
    
    validQuestions.sort((a, b) => {
      const dateA = a?.date ? new Date(a.date).getTime() : 0;
      const dateB = b?.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    
    return NextResponse.json({ questions: validQuestions });
  } catch (error: unknown) {
    console.error("API: Error fetching AMA questions:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Failed to fetch questions", details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, photoURL, question, questionId, adminResponse } = body;
    
    // Handle admin response to an existing question
    if (questionId && adminResponse) {
      console.log("Processing admin reply for question ID:", questionId);
      
      try {
        // Find the correct file by filename
        const files = await fs.readdir(AMA_DIR);
        console.log("Available files:", files);
        
        // Handle both cases: if questionId already includes .md extension or not
        const targetFile = files.find(file => 
          file === questionId || 
          file === `${questionId}.md` ||
          file.replace(/\.md$/, "") === questionId
        );
        
        if (!targetFile) {
          console.error(`File not found for question ID: ${questionId}`);
          return NextResponse.json({ error: `Question file not found: ${questionId}` }, { status: 404 });
        }
        
        const filePath = path.join(AMA_DIR, targetFile);
        console.log("Found question file at path:", filePath);
        
        // Read the existing file
        const content = await fs.readFile(filePath, "utf-8");
        
        // Extract frontmatter
        const match = content.match(/^---(\s\S*?)---/);
        if (!match) {
          console.error("Failed to match frontmatter pattern");
          return NextResponse.json({ error: "Invalid question format" }, { status: 400 });
        }
        
        // Simply write the admin response as the content body
        const frontmatter = match[1];
        const updatedContent = `---${frontmatter}---\n${adminResponse}`;
        
        console.log("Writing updated content to file:", filePath);
        
        // Write the updated content back to the file
        await fs.writeFile(filePath, updatedContent, "utf-8");
        
        return NextResponse.json({ success: true, questionId });
      } catch (error: unknown) {
        console.error("API: Error updating question with admin response:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
          { error: "Failed to update question with admin response", details: errorMessage },
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
    
    // Store question in frontmatter, leave content empty for admin response
    const md = `---\nname: "${name || "Anonymous"}"\nemail: "${email || ""}"\ndate: "${now}"\nquestion: "${question.replace(/"/g, '\\"')}"\n---\n`;
    
    await fs.writeFile(path.join(AMA_DIR, filename), md, "utf-8");
    return NextResponse.json({ success: true, filename });
  } catch (error: unknown) {
    console.error("API: Error submitting AMA question:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Failed to submit question", details: errorMessage }, { status: 500 });
  }
}
