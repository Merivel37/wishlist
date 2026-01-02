import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";

// Manually load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const notion = new Client({
    auth: process.env.NOTION_KEY,
});

const dbId = process.env.NOTION_WISHLIST_DB_ID;

async function main() {
    if (!dbId) {
        console.error("Missing NOTION_WISHLIST_DB_ID");
        process.exit(1);
    }

    try {
        const response = await notion.databases.query({
            database_id: dbId,
            page_size: 1,
        });

        if (response.results.length > 0) {
            const page = response.results[0] as any;
            console.log("Available Properties:");
            // console.log(Object.keys(page.properties));

            // Log all property keys
            const allKeys = Object.keys(page.properties);
            console.log("All Property Keys:", allKeys);

            // Check potential candidates
            const candidates = ["Source Images", "Image Link Source", "Brand", "Links", "Purchase Status", "Status", "Link", "Claimed User", "User"];

            // Log all property keys that contain "Image" or "Link"
            const imageKeys = allKeys.filter(k => k.toLowerCase().includes("image") || k.toLowerCase().includes("link"));
            console.log("Properties with Image/Link in name:", imageKeys);

            candidates.forEach(c => {
                if (page.properties[c]) {
                    console.log(`\nProperty '${c}' found. Type: ${page.properties[c].type}`);
                    // Inspect the first item in the array if it's text or file
                    if (page.properties[c].type === 'rich_text') {
                        console.log("Sample content:", JSON.stringify(page.properties[c].rich_text, null, 2));
                    } else if (page.properties[c].type === 'files') {
                        console.log("Sample content:", JSON.stringify(page.properties[c].files, null, 2));
                    } else if (page.properties[c].type === 'url') {
                        console.log("Sample content:", page.properties[c].url);
                    }
                }
            });
        } else {
            console.log("No items found in database.");
        }
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

main();
