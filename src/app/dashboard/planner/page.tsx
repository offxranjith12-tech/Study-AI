'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Calendar as CalendarIcon, Clock, Target } from 'lucide-react'

type StudyPlanDay = {
  day: number;
  tasks: {
    subject: string;
    topic: string;
    durationMinutes: number;
    activityType: string;
  }[];
}

export default function StudyPlannerPage() {
  const [subjects, setSubjects] = useState('')
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState(2)
  const [priority, setPriority] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<StudyPlanDay[]>([])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subjects: subjects.split(',').map(s => s.trim()), 
          examDate, 
          hoursPerDay, 
          priority 
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        setPlan(data.plan)
      } else {
        alert("Failed to generate plan.")
      }
    } catch (err) {
      alert("Network error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Study Planner</h1>
        <p className="text-muted-foreground mt-2">Generate a personalized, optimized daily study schedule.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Parameters</CardTitle>
            <CardDescription>Tell us about your upcoming exams and availability.</CardDescription>
          </CardHeader>
          <form onSubmit={handleGenerate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                <Input 
                  id="subjects" 
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, Computer Science" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examDate">Exam Date</Label>
                  <Input 
                    id="examDate" 
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Study Hours / Day</Label>
                  <Input 
                    id="hours" 
                    type="number" 
                    min={1} max={16} 
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Areas / Weaknesses</Label>
                <Textarea 
                  id="priority" 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="e.g., Need to focus more on Calculus and Database Systems" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...</> : 'Generate Study Plan'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {plan.length > 0 ? (
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)] pr-2">
            <h3 className="font-semibold text-lg">Your Personalized Schedule</h3>
            {plan.map((day) => (
              <Card key={day.day}>
                <CardHeader className="py-4 border-b bg-muted/20">
                  <CardTitle className="text-base flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                    Day {day.day}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-4 space-y-3">
                  {day.tasks.map((task, idx) => (
                    <div key={idx} className="flex justify-between items-start border-l-2 border-primary pl-4 py-1">
                      <div>
                        <p className="font-medium text-sm">{task.subject}: {task.topic}</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Target className="h-3 w-3 mr-1" />
                          {task.activityType}
                        </p>
                      </div>
                      <div className="text-sm font-medium flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.durationMinutes}m
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground">
            <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p>Fill out the parameters to generate your AI study plan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
