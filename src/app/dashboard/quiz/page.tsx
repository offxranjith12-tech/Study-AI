'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, BrainCircuit, CheckCircle2, XCircle } from 'lucide-react'

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [numQuestions, setNumQuestions] = useState(5)
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  
  // Quiz taking state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, numQuestions })
      })
      
      if (res.ok) {
        const data = await res.json()
        setQuiz(data.quiz)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setScore(0)
        setIsFinished(false)
      } else {
        alert("Failed to generate quiz. Try a broader topic.")
      }
    } catch (err) {
      alert("Network error.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return
    
    setShowExplanation(true)
    if (selectedAnswer === quiz[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setIsFinished(true)
      // Note: Ideally we would save the score to the database here
    }
  }

  const resetQuiz = () => {
    setQuiz([])
    setTopic('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Quiz Generator</h1>
        <p className="text-muted-foreground mt-2">Test your knowledge with personalized quizzes.</p>
      </div>

      {quiz.length === 0 ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Create a Quiz</CardTitle>
            <CardDescription>Enter a topic and we'll generate a custom multiple-choice quiz for you.</CardDescription>
          </CardHeader>
          <form onSubmit={handleGenerate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input 
                  id="topic" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Object Oriented Programming in Java" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select 
                    id="difficulty" 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questions">Number of Questions</Label>
                  <Input 
                    id="questions" 
                    type="number" 
                    min={3} max={10} 
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quiz...</> : 'Generate Quiz'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : isFinished ? (
        <Card className="max-w-2xl text-center p-6">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <BrainCircuit className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>Here is how you performed on: {topic}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold text-primary mb-4">
              {score}/{quiz.length}
            </div>
            <p className="text-muted-foreground">
              {score === quiz.length ? "Perfect score! Outstanding work." : 
               score >= quiz.length / 2 ? "Good job! Keep practicing to master this topic." : 
               "Looks like this is a weak spot. Let's ask the AI Tutor for some help on this topic!"}
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={resetQuiz}>Create Another Quiz</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="max-w-3xl">
          <CardHeader>
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
              <span>Question {currentQuestion + 1} of {quiz.length}</span>
              <span>Score: {score}</span>
            </div>
            <CardTitle className="text-xl leading-relaxed">{quiz[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quiz[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                disabled={showExplanation}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  showExplanation 
                    ? idx === quiz[currentQuestion].correctAnswer 
                      ? 'bg-green-500/20 border-green-500' // Correct answer (always green after submit)
                      : idx === selectedAnswer 
                        ? 'bg-destructive/20 border-destructive' // User chose wrong (red)
                        : 'bg-muted opacity-50' // Unselected wrong
                    : selectedAnswer === idx 
                      ? 'bg-primary/10 border-primary' // User selected (before submit)
                      : 'bg-card hover:bg-muted/50 border-input' // Default
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showExplanation && idx === quiz[currentQuestion].correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {showExplanation && idx === selectedAnswer && idx !== quiz[currentQuestion].correctAnswer && <XCircle className="h-5 w-5 text-destructive" />}
                </div>
              </button>
            ))}

            {showExplanation && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p className="text-sm text-muted-foreground">{quiz[currentQuestion].explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            {!showExplanation ? (
              <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestion < quiz.length - 1 ? 'Next Question' : 'View Results'}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
