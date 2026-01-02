import { Client } from "@notionhq/client";

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
            filter: {
                or: [
                    { property: "Status", rich_text: { equals: "Active" } },
                    { property: "Status", rich_text: { equals: "To Buy" } },
                ]
            },
        });

        const items = response.results.map((page: any) => {
            const props = page.properties;
            const getName = (p: any) => {
                if (p?.title) return p.title.map((t: any) => t.plain_text).join("").trim();
                if (p?.rich_text) return p.rich_text.map((t: any) => t.plain_text).join("").trim();
                return "";
            };

            const name = getName(props.Item) || getName(props.Name);
            const description = getName(props["Description / Notes"]) || getName(props.Description);

            // Image logic: Check multiple sources
            const getFileUrl = (prop: any) => prop?.files?.[0]?.file?.url || prop?.files?.[0]?.external?.url || "";

            const sourceImageFiles = getFileUrl(props["Source Images"]);
            const sourceImageText = getName(props["Source Images"]);
            const fileUrl = getFileUrl(props.Files);
            const legacyPhotoUrl = getFileUrl(props.Photo);

            const photoUrl = sourceImageFiles || fileUrl || legacyPhotoUrl || sourceImageText;

            return {
                id: page.id,
                name,
                description,
                photoUrl
            };
        }).filter(item => item.photoUrl);

        if (response.results.length > 0) {
            console.log("First item structure:");
            const firstItem = response.results[0] as any;
            console.log(JSON.stringify({
                cover: firstItem.cover,
                icon: firstItem.icon,
                properties: firstItem.properties
            }, null, 2));
        }

        console.log("First 3 items with images:");
        console.log(JSON.stringify(items.slice(0, 3), null, 2));
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

main();
