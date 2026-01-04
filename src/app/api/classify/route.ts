import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { input } = await req.json();

        if (!input) {
            return new Response('Missing input', { status: 400 });
        }

        const { object } = await generateObject({
            model: google('gemini-1.5-flash'),
            schema: z.object({
                title: z.string(),
                type: z.enum(['book', 'movie', 'tv']),
                authorOrDirector: z.string().optional(),
                summary: z.string().optional(),
                tags: z.array(z.string()).optional(),
                confidence: z.number().describe('Confidence in classification 0-1'),
            }),
            prompt: `Classify the following text or URL as a book, movie, or TV show. Extract the title, author (if book) or director (if movie/tv), and a brief summary.
      
      Input: "${input}"`,
        });

        return Response.json(object);
    } catch (error) {
        console.error('Classification error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
