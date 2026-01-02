import { Client } from "@notionhq/client";

const notion = new Client({
    auth: process.env.NOTION_KEY,
});

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: npx tsx scripts/update_item_image.ts <pageId> <imageUrl>");
    process.exit(1);
}

const [pageId, imageUrl] = args;

async function main() {
    try {
        console.log(`Updating page ${pageId} with image: ${imageUrl}`);
        await notion.pages.update({
            page_id: pageId,
            properties: {
                "Source Images": {
                    rich_text: [
                        {
                            text: {
                                content: imageUrl,
                            },
                        },
                    ],
                },
            },
        });
        console.log("Successfully updated.");
    } catch (error) {
        console.error("Error updating page:", error);
        process.exit(1);
    }
}

main();
