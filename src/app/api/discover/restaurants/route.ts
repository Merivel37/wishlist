import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { query } = await req.json(); // e.g., "Italian in Soho"

        const { object } = await generateObject({
            model: google('gemini-1.5-flash'),
            schema: z.object({
                restaurants: z.array(z.object({
                    name: z.string(),
                    location: z.string(),
                    cuisine: z.string(),
                    priceRange: z.string().describe("$, $$, $$$, or $$$$"),
                    reason: z.string().describe("Why it's recommended"),
                    bookingUrl: z.string().optional(),
                })),
                summary: z.string(),
            }),
            prompt: `You are a London dining expert. Suggest 5 highly-rated, trending restaurants for the following query: "${query || "What's hot right now in London"}"
      
      Focus on curated, high-quality spots.`,
        });

        return Response.json(object);
    } catch (error) {
        console.error('Discovery error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
