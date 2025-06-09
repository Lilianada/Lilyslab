import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const AMA_DIR = path.join(process.cwd(), "Content", "amaQuestions");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, adminResponse } = body;
    
    if (!questionId || !adminResponse) {
      return NextResponse.json(
        { error: "Question ID and admin response are required" },
        { status: 400 }
      );
    }
    
    
    // Normalize the questionId to ensure it has .md extension
    const normalizedId = questionId.endsWith(".md") ? questionId : `${questionId}.md`;
    const filePath = path.join(AMA_DIR, normalizedId);
    
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json({ error: `Question file not found: ${normalizedId}` }, { status: 404 });
    }
    
    // Read file content
    const fileContent = await fs.readFile(filePath, "utf-8");
    
    // Find the end of frontmatter using string operations (more reliable than regex)
    if (!fileContent.startsWith("---")) {
      return NextResponse.json({ error: "Invalid file format: missing frontmatter start" }, { status: 400 });
    }
    
    const endOfFrontmatter = fileContent.indexOf("---", 3);
    if (endOfFrontmatter === -1) {
      return NextResponse.json({ error: "Invalid file format: missing frontmatter end" }, { status: 400 });
    }
    
    // Extract frontmatter section (including the markers)
    const frontmatterSection = fileContent.substring(0, endOfFrontmatter + 3);
    
    // Create updated content with admin response
    const updatedContent = `${frontmatterSection}\n\n${adminResponse}`;
    
    // Write updated content back to file
    await fs.writeFile(filePath, updatedContent, "utf-8");
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error handling admin reply:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to process admin reply", details: errorMessage },
      { status: 500 }
    );
  }
}
