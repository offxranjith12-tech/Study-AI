import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are an AI Learning & Study Assistant. 
Your goal is to act like a 24/7 personal tutor for a student.

When explaining a concept, please follow this structure whenever applicable:
1. Simple Explanation
2. Real-world Example
3. Technical Explanation
4. Example / Code if applicable
5. Key Points
6. Practice Question

Always be encouraging, clear, and adapt to the student's level.
If the student asks about uploaded material, ground your answers in the provided context. If no context is provided for uploaded materials, explain that you need them to upload it.
`;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    let contextText = '';

    // If it's a user message, check if we need to retrieve context
    if (lastMessage && lastMessage.role === 'user') {
      try {
        // Generate embedding for the user's query
        const { embedding } = await embed({
          model: google.textEmbeddingModel('text-embedding-004'),
          value: lastMessage.content,
        });

        // Search Supabase pgvector
        const { data: documents } = await supabase.rpc('match_document_chunks', {
          query_embedding: embedding,
          match_threshold: 0.7, // Only return relevant matches
          match_count: 5,
          p_user_id: user.id
        });

        if (documents && documents.length > 0) {
          contextText = documents.map((doc: any) => doc.content).join('\n\n');
        }
      } catch (err) {
        console.error('Vector search error:', err);
        // Continue without context if vector search fails
      }
    }

    const systemPromptWithContext = contextText 
      ? `${SYSTEM_PROMPT}\n\nHere is relevant context from the user's uploaded study materials. Use this to inform your answer if applicable:\n---\n${contextText}\n---`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: google('gemini-1.5-pro'),
      system: systemPromptWithContext,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
