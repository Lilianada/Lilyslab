const fs = require("fs");
const path = require("path");

const toolsDir = path.join(process.cwd(), "Content/tools");
const files = fs.readdirSync(toolsDir).filter(f => /^(\d{3})\.md$/.test(f));

// Helper to convert [text](url) or [url](url) to just url
function extractUrl(val) {
  if (!val) return "";
  const match = val.match(/\[(.*?)\]\((.*?)\)/);
  if (match) return match[2];
  return val;
}
// Helper to convert [name](...) to just name
function extractName(val) {
  if (!val) return "";
  const match = val.match(/\[(.*?)\]/);
  if (match) return match[1];
  return val;
}

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  let inFrontmatter = false;
  const newLines = [];
  for (let line of lines) {
    if (line.trim() === '---') {
      newLines.push(line);
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) {
      if (line.startsWith('name:')) {
        let val = line.slice(5).trim();
        val = extractName(val);
        line = `name: ${val}`;
      }
      if (line.startsWith('url:')) {
        let val = line.slice(4).trim();
        val = extractUrl(val);
        line = `url: ${val}`;
      }
      if (line.startsWith('logo:')) {
        let val = line.slice(5).trim();
        val = extractUrl(val);
        line = `logo: ${val}`;
      }
    }
    newLines.push(line);
  }
  fs.writeFileSync(filePath, newLines.join("\n"));
}

console.log("Cleaned up all tool files: names, urls, and logos are now plain values.");
