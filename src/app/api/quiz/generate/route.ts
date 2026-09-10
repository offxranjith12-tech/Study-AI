import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, difficulty, numQuestions } = await req.json()

    if (!topic || !difficulty || !numQuestions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { object } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        quiz: z.array(z.object({
          question: z.string(),
          options: z.array(z.string()).length(4),
          correctAnswer: z.number().min(0).max(3),
          explanation: z.string()
        }))
      }),
      prompt: `Generate a multiple-choice quiz about "${topic}".
      Difficulty level: ${difficulty}.
      Number of questions: ${numQuestions}.
      Provide exactly 4 options per question. The correctAnswer should be the index (0-3) of the correct option.
      Include a clear, educational explanation for why the answer is correct.`,
    });

    // In a full production app, we would save the quiz metadata to the database here.
    // For this MVP, we return it to the client to take immediately.

    return NextResponse.json({ quiz: object.quiz })
  } catch (error) {
    console.error('Quiz Generation Error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
