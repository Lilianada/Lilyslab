import { NextResponse } from "next/server"
import { checkUserIsAdmin } from "@/lib/admin-service"
import path from "path"
import fs from "fs/promises"
import matter from "gray-matter"

export async function POST(request: Request, { params }: { params: { questionId: string } }) {
  try {
    const { answer, adminEmail } = await request.json()

    // Verify this is an admin request
    const isAdmin = await checkUserIsAdmin(adminEmail)
    if (!isAdmin) {
      console.error("Unauthorized admin answer attempt from:", adminEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!answer) {
      return NextResponse.json({ error: "Answer text is required" }, { status: 400 })
    }

    // Update the question in Obsidian-managed markdown file
    try {
      // Assume questionId is the filename, e.g., '001' for '001.md'. Adjust if needed.
      const fileName = `${params.questionId}.md`;
      const filePath = path.join(process.cwd(), "Content", "amaQuestions", fileName);
      let fileContent;
      try {
        fileContent = await fs.readFile(filePath, "utf8");
      } catch (readErr) {
        return NextResponse.json({ error: `Question file not found: ${fileName}` }, { status: 404 });
      }

      const { data, content } = matter(fileContent);
      // Update the response field
      data.response = answer;
      const newFile = matter.stringify(content, data);
      await fs.writeFile(filePath, newFile, "utf8");

      return NextResponse.json({
        success: true,
        message: "Answer submitted successfully",
      });
    } catch (fileError) {
      console.error("Error updating AMA question file:", fileError);
      let errorMessage = "Unknown error";
      if (fileError && typeof fileError === "object" && "message" in fileError) {
        errorMessage = (fileError as { message?: string }).message || errorMessage;
      }
      return NextResponse.json(
        {
          error: "Failed to update question file",
          details: errorMessage,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing admin answer:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 });
    }
  }
}
