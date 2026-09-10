import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BrainCircuit, BookOpen, Target, LineChart, MessageSquare, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center gap-2" href="#">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">StudyAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          {user ? (
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                Log in
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/40">
          <div className="container px-4 md:px-6 flex justify-center text-center">
            <div className="flex flex-col items-center space-y-4 text-center max-w-3xl">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Your Personal AI Tutor for <span className="text-primary">Smarter Learning</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl pt-4">
                  Upload study materials, generate personalized quizzes, and get instant answers to your academic questions anytime, anywhere.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href={user ? "/dashboard" : "/signup"}>
                  <Button size="lg" className="h-12 px-8">Start Learning</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-8">How it works</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything you need to ace your exams</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines advanced AI with proven learning techniques to help you master any subject faster.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-xl border shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">24/7 AI Tutor</h3>
                <p className="text-center text-muted-foreground text-sm">Ask questions and get detailed, step-by-step explanations tailored to your difficulty level.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-xl border shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Chat with PDFs</h3>
                <p className="text-center text-muted-foreground text-sm">Upload your lecture notes or textbooks and ask questions based strictly on your materials.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-xl border shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Quizzes</h3>
                <p className="text-center text-muted-foreground text-sm">Test your knowledge with AI-generated quizzes and get personalized feedback on mistakes.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-xl border shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Study Planner</h3>
                <p className="text-center text-muted-foreground text-sm">Get realistic, AI-optimized daily study schedules based on your exam dates and free time.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-xl border shadow-sm lg:col-span-2">
                <div className="p-3 bg-primary/10 rounded-full">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Performance Analytics</h3>
                <p className="text-center text-muted-foreground text-sm">Track your progress, identify weak topics, and receive actionable recommendations to improve.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2026 AI Learning & Study Assistant. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
