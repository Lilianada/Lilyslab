// This is a test file you can run with Node.js to verify Notion API access
// Run with: node lib/notion-test.js YOUR_PAGE_ID
import { NotionAPI } from "notion-client"

// Initialize the unofficial Notion client - no auth needed for public pages
const notionApi = new NotionAPI()

async function testNotionAccess() {
  // Get the page ID from command line arguments or use a test ID
  const pageId = process.argv[2]

  if (!pageId) {
    console.error("Please provide a page ID as an argument")
    console.log("Usage: node lib/notion-test.js YOUR_PAGE_ID")
    return
  }

  console.log(`Testing Notion access for page ID: ${pageId}`)

  try {
    const recordMap = await notionApi.getPage(pageId)
    console.log("Success! Record map keys:", Object.keys(recordMap))
    console.log("Block count:", Object.keys(recordMap.block || {}).length)

    // Print the first few blocks to verify content
    const blockIds = Object.keys(recordMap.block || {}).slice(0, 3)
    console.log(
      "Sample blocks:",
      blockIds.map((id) => {
        const block = recordMap.block[id]
        return {
          id,
          type: block.value.type,
          content: block.value.properties?.title?.[0]?.[0] || "[No content]",
        }
      }),
    )

    return recordMap
  } catch (error) {
    console.error("Error fetching record map:", error)
    console.log("\nThis could mean:")
    console.log("1. The page ID is incorrect")
    console.log("2. The page is not publicly shared")
    console.log("3. There's a network issue")
    console.log("\nTo fix:")
    console.log("1. Verify your page ID")
    console.log("2. Make sure the page is shared publicly (Share → 'Share to web')")
    return null
  }
}

testNotionAccess()
