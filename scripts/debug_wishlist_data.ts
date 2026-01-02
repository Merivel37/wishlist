import fs from "fs";
import path from "path";

// Manually load .env.local FIRST
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    console.log("Loading .env.local...");
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} else {
    console.error(".env.local not found!");
}

async function main() {
    // Dynamic import AFTER env is loaded
    const { getWishlistItems } = await import("../src/lib/googleSheets");

    console.log("Fetching wishlist items...");
    try {
        const items = await getWishlistItems();
        console.log(`Fetched ${items.length} items.`);

        items.forEach(item => {
            console.log(`Item: ${item.name}`);
            console.log(`  ID: ${item.id}`);
            console.log(`  PhotoURL: '${item.photoUrl}'`);

            if (item.photoUrl) {
                try {
                    new URL(item.photoUrl);
                    console.log(`  -> Valid URL object created.`);
                } catch (e: any) {
                    console.error(`  -> INVALID URL: ${e.message}`);
                }
            } else {
                console.log("  -> No Photo URL (Safe)");
            }
            console.log("---");
        });
    } catch (e) {
        console.error("Error running script:", e);
    }
}

main();
