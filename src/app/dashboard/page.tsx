import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/server'
import { BrainCircuit, BookOpen, Flame, Trophy, AlertTriangle, Lightbulb } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.name || 'Student'}! 👋</h1>
        <p className="text-muted-foreground mt-2">Here is an overview of your learning progress today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BrainCircuit className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+3 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials Uploaded</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">2 PDFs analyzed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Performance & Topics */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>Your strengths and areas for improvement based on recent quizzes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <Trophy className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="font-semibold text-sm">Strong Topics</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium border border-green-500/20">Java OOP</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium border border-green-500/20">DBMS Basics</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                <h4 className="font-semibold text-sm">Needs Improvement</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full text-xs font-medium border border-orange-500/20">DSA Arrays</span>
                <span className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full text-xs font-medium border border-orange-500/20">Operating Systems</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <p className="text-sm">
                "Your DSA score has remained below 50% across the last three quizzes. Spend 30 minutes today revising DSA Arrays before moving on."
              </p>
              <div className="pt-2">
                <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium hover:bg-primary/90 transition-colors">
                  Start Revision
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
