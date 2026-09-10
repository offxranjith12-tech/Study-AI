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

    const { subjects, examDate, hoursPerDay, priority } = await req.json()

    if (!subjects || !examDate || !hoursPerDay) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = Math.abs(exam.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // We'll generate a plan for the next 7 days or until exam, whichever is shorter
    const daysToGenerate = Math.min(7, diffDays);

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      // DEMO MODE: Return mock data after a short delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockPlan = Array.from({ length: daysToGenerate }).map((_, i) => ({
        day: i + 1,
        tasks: subjects.map((sub: string) => ({
          subject: sub,
          topic: `Core concepts of ${sub}`,
          durationMinutes: Math.floor((hoursPerDay * 60) / subjects.length),
          activityType: "Reading & Practice"
        }))
      }));
      return NextResponse.json({ plan: mockPlan });
    }

    const { object } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        plan: z.array(z.object({
          day: z.number(),
          tasks: z.array(z.object({
            subject: z.string(),
            topic: z.string(),
            durationMinutes: z.number(),
            activityType: z.string() // e.g. "Reading", "Practice Problems", "Review"
          }))
        })).max(7)
      }),
      prompt: `Generate an optimized daily study plan for a student.
      Subjects: ${subjects.join(', ')}.
      Days until exam: ${diffDays}.
      Study hours available per day: ${hoursPerDay}.
      Priority/Weaknesses: ${priority || 'None specified'}.
      
      Create a detailed plan for the next ${daysToGenerate} days.
      Distribute the time efficiently, heavily weighting the priority areas.
      Total duration of tasks per day should roughly equal ${hoursPerDay * 60} minutes.`,
    });

    // We would save this to Supabase `study_plans` here.

    return NextResponse.json({ plan: object.plan })
  } catch (error) {
    console.error('Planner Generation Error:', error)
    return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 })
  }
}
