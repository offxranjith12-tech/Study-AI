import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { User } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account and learning preferences.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>{profile?.name || 'Student'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Account Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-md">
                <span className="text-muted-foreground block text-xs">Member Since</span>
                <span className="font-medium">{new Date(profile?.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <span className="text-muted-foreground block text-xs">Preferred Difficulty</span>
                <span className="font-medium capitalize">{profile?.preferred_difficulty || 'Intermediate'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Learning Goals</h3>
            <div className="p-4 border rounded-md text-sm text-muted-foreground">
              {profile?.goals || "No specific learning goals set yet. Start taking quizzes and generating study plans to let our AI learn about your goals."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
