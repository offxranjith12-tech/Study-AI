import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/server'
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // In a real app, we would fetch aggregated quiz and study session data here.
  // For the MVP, we use realistic data structures.

  const subjectPerformance = [
    { subject: 'Java', score: 85 },
    { subject: 'Database Systems', score: 72 },
    { subject: 'Data Structures', score: 45 },
    { subject: 'Operating Systems', score: 60 },
  ]

  const recentQuizzes = [
    { topic: 'Java OOP', date: '2 days ago', score: '9/10' },
    { topic: 'DSA Arrays', date: '4 days ago', score: '4/10' },
    { topic: 'SQL Basics', date: '1 week ago', score: '8/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress & Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your performance and identify areas for improvement.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Subject Breakdown */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Average scores across all your quizzes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjectPerformance.map((item) => (
              <div key={item.subject}>
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-medium">{item.subject}</span>
                  <span className="text-muted-foreground">{item.score}%</span>
                </div>
                <Progress 
                  value={item.score} 
                  className={`h-2 ${item.score >= 80 ? 'bg-green-100' : item.score < 50 ? 'bg-red-100' : 'bg-primary/20'}`}
                  // @ts-ignore - shadcn progress bar doesn't expose inner color easily without custom classes, but this is an abstraction
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-primary-foreground">
              <TrendingUp className="h-5 w-5 mr-2" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center mb-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Strengths
              </h4>
              <p className="text-primary-foreground/80 text-sm">You are excelling in Java and SQL. Your conceptual understanding of Object-Oriented principles is very strong.</p>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold flex items-center mb-1">
                <AlertCircle className="h-4 w-4 mr-2" />
                Focus Areas
              </h4>
              <p className="text-primary-foreground/80 text-sm">Data Structures (specifically Arrays and Linked Lists) require immediate attention before your next exam.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-primary-foreground/20">
              <h4 className="font-semibold mb-1">Recommendation:</h4>
              <p className="text-sm">Dedicate 45 minutes to DSA practice today. Try generating a Beginner difficulty quiz on Arrays.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz History</CardTitle>
          <CardDescription>Your latest attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuizzes.map((quiz, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full mr-4">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{quiz.topic}</h4>
                    <p className="text-sm text-muted-foreground">{quiz.date}</p>
                  </div>
                </div>
                <div className="text-xl font-bold bg-muted px-4 py-2 rounded-md">
                  {quiz.score}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
