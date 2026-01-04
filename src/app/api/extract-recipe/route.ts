import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { input } = await req.json(); // URL or Text

        const { object } = await generateObject({
            model: google('gemini-1.5-flash'),
            schema: z.object({
                title: z.string(),
                ingredients: z.array(z.object({
                    item: z.string(),
                    amount: z.string().optional(),
                })),
                method: z.string().describe("Full step-by-step instructions"),
                difficulty: z.enum(['Easy', 'Medium', 'Hard']),
                summary: z.string(),
            }),
            prompt: `Extract a structured recipe from the following text or URL content. Ignore blog stories and fluff.
      
      Input: "${input}"`,
        });

        return Response.json(object);
    } catch (error) {
        console.error('Extraction error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
