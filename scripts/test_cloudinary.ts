
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Manually parse .env.local to ensure vars are loaded for this standalone script
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testConnection() {
    console.log(`Checking Cloudinary connection for cloud: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}...`);
    try {
        const result = await cloudinary.api.resources({ max_results: 5 });
        console.log("✅ Connection Successful!");
        console.log("First 5 images found:");
        result.resources.forEach((res: any) => {
            console.log(`- ${res.public_id} (${res.format})`);
        });
    } catch (error) {
        console.error("❌ Connection Failed:", error);
    }
}

testConnection();
