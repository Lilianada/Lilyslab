import fs from "fs";
import path from "path";
/**
 * Parses the markdown table in Content/tools/Tools.md and returns an array of tool objects.
 */
export function parseToolsMarkdown(): any[] {
  const filePath = path.join(process.cwd(), "Content/tools/Tools.md");
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").filter(Boolean);
  // Find the table header row
  const headerIdx = lines.findIndex((line) => line.trim().startsWith("| Name"));
  if (headerIdx === -1) return [];
  // Get header columns
  const headers = lines[headerIdx]
    .split("|")
    .map((h) => h.trim())
    .filter((h) => h.length > 0);
  // Data rows start after the separator (---) row
  const dataRows = lines.slice(headerIdx + 2);
  const tools = dataRows.map((row) => {
    const cols = row.split("|").map((c) => c.trim());
    if (cols.length < headers.length) return null;
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = cols[i + 1] || "";
    });
    // Normalize fields for ToolCard
    return {
      name: obj["Names"] || obj["Name"],
      description: obj["Description"],
      logo: obj["Logo"],
      url: obj["URL"].replace(/^\[(.*?)\]\((.*?)\)$/, "$2").replace(/\[(.*?)\]\((.*?)\)/, "$2").replace(/^\[(.*?)\]\((.*?)\)/, "$2").replace(/^\[(.*?)\]\((.*?)\)/, "$2"),
      platforms: (obj["Platforms"] || "").split(/(?=[A-Z])/).filter(Boolean),
      category: obj["Category"] || "",
      published: obj["Published"] || "",
      isNew: obj["New"] || "",
    };
  });
  return tools.filter(Boolean);
}
