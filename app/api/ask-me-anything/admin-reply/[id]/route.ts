import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const AMA_DIR = path.join(process.cwd(), "Content", "amaQuestions");

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const body = await request.json();
    const { adminResponse, adminEmail } = body;

    if (!questionId || !adminResponse) {
      return NextResponse.json(
        { error: "Question ID and admin response are required" },
        { status: 400 }
      );
    }

    // Verify this is an admin (you should add proper auth check here)
    const filePath = path.join(AMA_DIR, `${questionId}.md`);

    try {
      // Read the existing file
      const content = await fs.readFile(filePath, "utf-8");

      // Extract frontmatter and question content
      const match = content.match(/^---([\s\S]*?)---\s*([\s\S]*)$/);
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

      // Create the updated markdown content with the response
      const updatedContent = `---${updatedFrontmatter}---\n${questionContent}\n\n"Response": ${adminResponse}`;

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
  } catch (error: any) {
    console.error("API: Error handling admin reply:", error);
    return NextResponse.json(
      { error: "Failed to process admin reply", details: error.message },
      { status: 500 }
    );
  }
}
