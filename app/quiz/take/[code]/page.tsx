image.png"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, CheckCircle, AlertCircle, BookOpen } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  type: "multiple-choice" | "true-false"
}

interface Quiz {
  code: string
  title: string
  description: string
  timeLimit: number
  questions: Question[]
}

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const quizCode = params.code as string;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    const fetchQuiz = async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("code", quizCode)
        .single();
      if (data) {
        setQuiz(data);
        setTimeLeft(data.timeLimit || 1800);
      } else {
        setError("Quiz not found");
      }
    };
    if (quizCode) fetchQuiz();
  }, [user, loading, quizCode, router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    })
  }

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!quiz || !user) return

    setIsSubmitting(true)

    try {
      // Calculate score
      let correctAnswers = 0
      quiz.questions.forEach((question) => {
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / quiz.questions.length) * 100)
      const timeSpent = quiz.timeLimit - timeLeft

      // Save result
      const result = {
        id: `result_${Date.now()}`,
        studentId: user?.id,
        studentName: user?.name,
        studentEmail: user?.email,
        quizTitle: quiz.title,
        quizCode: quiz.code,
        score,
        timeSpent,
        submittedAt: new Date().toISOString(),
        status: "completed",
        answers,
        correctAnswers,
        totalQuestions: quiz.questions.length,
      }

      // Save to localStorage
      const existingResults = JSON.parse(localStorage.getItem("quiz_results") || "[]")
      existingResults.push(result)
      localStorage.setItem("quiz_results", JSON.stringify(existingResults))

      // Redirect to results page
      router.push(`/quiz/result?id=${result.id}`)
    } catch (error) {
      setError("Failed to submit quiz. Please try again.")
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft > 300) return "text-green-600" // > 5 minutes
    if (timeLeft > 60) return "text-yellow-600" // > 1 minute
    return "text-red-600" // < 1 minute
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-900">Quiz Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/quiz/join")} className="w-full">
              Try Another Code
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <h1 className="font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-sm text-gray-600">{quiz.code}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${getTimeColor()}`}>
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
              <Badge variant={currentQ.type === "multiple-choice" ? "default" : "secondary"}>
                {currentQ.type === "multiple-choice" ? "Multiple Choice" : "True/False"}
              </Badge>
            </div>
            <CardDescription className="text-base text-gray-900 mt-4">{currentQ.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          <div className="flex space-x-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? "bg-blue-600 text-white"
                    : answers[quiz.questions[index].id] !== undefined
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>

        {/* Warning for unanswered questions */}
        {currentQuestion === quiz.questions.length - 1 && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have answered {Object.keys(answers).length} out of {quiz.questions.length} questions. Make sure to
              review your answers before submitting.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}
