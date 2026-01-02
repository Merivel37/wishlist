const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(process.cwd(), ".env.local");
let NOTION_KEY = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/NOTION_KEY=(.+)/);
  if (match) {
    NOTION_KEY = match[1].trim();
  }
}

if (!NOTION_KEY) {
  console.error("No NOTION_KEY found in .env.local");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_KEY });

async function findDatabases() {
  console.log("Searching for databases accessible to this key...");
  try {
    const response = await notion.search({
      filter: {
        value: "database",
        property: "object",
      },
    });

    if (response.results.length === 0) {
        console.log("No databases found. Make sure you have clicked 'Connect to' on your database page.");
    }

    response.results.forEach((db) => {
      const title = db.title?.[0]?.plain_text || "Untitled";
      console.log(`FOUND: [${title}] ID: ${db.id}`);
    });
  } catch (error) {
    console.error("Error searching Notion:", error.message);
  }
}

findDatabases();
