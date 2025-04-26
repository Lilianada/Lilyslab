const fs = require("fs");
const path = require("path");

// Helper to parse the markdown table
function parseToolsMarkdownTable(md) {
  const lines = md.split("\n").filter(l => l.trim().length > 0);
  // Find header and separator lines
  const headerIdx = lines.findIndex(line => line.includes("| Name"));
  if (headerIdx === -1) throw new Error("No header row found");
  const headers = lines[headerIdx].split("|").map(h => h.trim()).filter(Boolean);
  const dataRows = lines.slice(headerIdx + 2);
  const tools = [];
  for (const row of dataRows) {
    const cols = row.split("|").map(c => c.trim());
    if (cols.length < headers.length) continue;
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = cols[i + 1] || "";
    });
    tools.push(obj);
  }
  return tools;
}

function main() {
  const toolsMdPath = path.join(process.cwd(), "Content/tools/Tools.md");
  const toolsDir = path.join(process.cwd(), "Content/tools");
  const md = fs.readFileSync(toolsMdPath, "utf8");
  const tools = parseToolsMarkdownTable(md);
  let idx = 1;
  for (const tool of tools) {
    if ((tool["Category"] || "").toLowerCase() === "productivity") {
      const num = idx.toString().padStart(3, "0");
      const toolFile = path.join(toolsDir, `${num}.md`);
      const frontmatter = `---\nname: ${tool["Names"] || tool["Name"] || ""}\ndescription: ${tool["Description"] || ""}\nplatforms: ${tool["Platforms"] || ""}\nurl: ${tool["URL"] || ""}\ncategory: ${tool["Category"] || ""}\nlogo: ${tool["Logo"] || ""}\n---\n`;
      fs.writeFileSync(toolFile, frontmatter);
      idx++;
    }
  }
  console.log(`Exported ${idx - 1} productivity tools to individual markdown files.`);
}

main();
