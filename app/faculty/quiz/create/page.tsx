"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowLeft,
  Settings,
  LogOut,
  Bell,
  User,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer"
  question: string
  options?: string[]
  correctAnswer: string | number
  points: number
}

export default function CreateQuizPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Quiz form state
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [quizSubject, setQuizSubject] = useState("")
  const [timeLimit, setTimeLimit] = useState("30")
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    // If you want to check for user type, you can do so here if you store it in the session
    setIsLoading(false)
  }, [session, status, router])

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  // Generate user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substring(2, 15),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options]
          newOptions[optionIndex] = value
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const generateQuizCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const saveQuiz = async () => {
    if (!quizTitle.trim()) {
      setError("Please enter a quiz title")
      return
    }

    if (!quizSubject.trim()) {
      setError("Please select a subject")
      return
    }

    if (questions.length === 0) {
      setError("Please add at least one question")
      return
    }

    // Validate all questions
    for (const question of questions) {
      if (!question.question.trim()) {
        setError("All questions must have a question text")
        return
      }

      if (question.type === "multiple-choice" && question.options) {
        const filledOptions = question.options.filter((opt) => opt.trim())
        if (filledOptions.length < 2) {
          setError("Multiple choice questions must have at least 2 options")
          return
        }
      }
    }

    setError("")
    setIsSaving(true)

    // Create quiz object
    const quiz = {
      code: generateQuizCode(),
      title: quizTitle.trim(),
      description: quizDescription.trim(),
      subject: quizSubject,
      timeLimit: Number.parseInt(timeLimit),
      questions,
      createdBy: session?.user?.id,
      createdAt: new Date().toISOString(),
      status: "active",
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
    }

    // Save to localStorage
    const existingQuizzes = JSON.parse(localStorage.getItem("faculty_quizzes") || "[]")
    existingQuizzes.push(quiz)
    localStorage.setItem("faculty_quizzes", JSON.stringify(existingQuizzes))

    // Update faculty data
    const userDataKey = `faculty_data_${session?.user?.id}`
    const existingData = JSON.parse(localStorage.getItem(userDataKey) || "{}")
    const updatedData = {
      ...existingData,
      stats: {
        ...existingData.stats,
        totalQuizzes: (existingData.stats?.totalQuizzes || 0) + 1,
        activeQuizzes: (existingData.stats?.activeQuizzes || 0) + 1,
      },
    }
    localStorage.setItem(userDataKey, JSON.stringify(updatedData))

    setIsSaving(false)
    setShowSuccess(true)

    // Redirect after showing success
    setTimeout(() => {
      router.push("/faculty/dashboard")
    }, 2000)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz creator...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user (will redirect)
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/faculty/dashboard")}
                className="mr-4 p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">QuizMaster</span>
              </div>
              <Badge variant="secondary" className="ml-4 bg-purple-100 text-purple-800">
                Create Quiz
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || "/placeholder.png"} alt={session.user?.name} />
                      <AvatarFallback>{getUserInitials(session.user?.name || "")}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Quiz created successfully! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-2">Design and configure your quiz for students</p>
        </div>

        <div className="space-y-8">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Basic information about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter quiz title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={quizSubject} onValueChange={setQuizSubject} disabled={isSaving}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter quiz description"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Select value={timeLimit} onValueChange={setTimeLimit} disabled={isSaving}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Questions ({questions.length})</CardTitle>
                  <CardDescription>Add and configure quiz questions</CardDescription>
                </div>
                <Button onClick={addQuestion} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No questions added yet</p>
                  <Button onClick={addQuestion} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      index={index}
                      onUpdate={(updates) => updateQuestion(question.id, updates)}
                      onRemove={() => removeQuestion(question.id)}
                      onUpdateOption={(optionIndex, value) => updateQuestionOption(question.id, optionIndex, value)}
                      disabled={isSaving}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.push("/faculty/dashboard")}
              disabled={isSaving}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <div className="flex space-x-4">
              <Button variant="outline" disabled={isSaving} className="bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={saveQuiz} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Quiz...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Quiz
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

interface QuestionEditorProps {
  question: Question
  index: number
  onUpdate: (updates: Partial<Question>) => void
  onRemove: () => void
  onUpdateOption: (optionIndex: number, value: string) => void
  disabled: boolean
}

function QuestionEditor({ question, index, onUpdate, onRemove, onUpdateOption, disabled }: QuestionEditorProps) {
  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="outline">Question {index + 1}</Badge>
              <Select
                value={question.type}
                onValueChange={(value: Question["type"]) => onUpdate({ type: value })}
                disabled={disabled}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`points-${question.id}`} className="text-sm">
                  Points:
                </Label>
                <Input
                  id={`points-${question.id}`}
                  type="number"
                  min="1"
                  max="10"
                  value={question.points}
                  onChange={(e) => onUpdate({ points: Number.parseInt(e.target.value) || 1 })}
                  className="w-20"
                  disabled={disabled}
                />
              </div>
            </div>
            <Textarea
              placeholder="Enter your question here..."
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              className="mb-4"
              disabled={disabled}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {question.type === "multiple-choice" && question.options && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Answer Options</Label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === optionIndex}
                  onChange={() => onUpdate({ correctAnswer: optionIndex })}
                  className="text-purple-600"
                  disabled={disabled}
                />
                <Input
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => onUpdateOption(optionIndex, e.target.value)}
                  className="flex-1"
                  disabled={disabled}
                />
              </div>
            ))}
            <p className="text-xs text-gray-500">Select the correct answer by clicking the radio button</p>
          </div>
        )}

        {question.type === "true-false" && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Correct Answer</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`tf-${question.id}`}
                  checked={question.correctAnswer === "true"}
                  onChange={() => onUpdate({ correctAnswer: "true" })}
                  className="text-purple-600"
                  disabled={disabled}
                />
                <span>True</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`tf-${question.id}`}
                  checked={question.correctAnswer === "false"}
                  onChange={() => onUpdate({ correctAnswer: "false" })}
                  className="text-purple-600"
                  disabled={disabled}
                />
                <span>False</span>
              </label>
            </div>
          </div>
        )}

        {question.type === "short-answer" && (
          <div className="space-y-3">
            <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium">
              Expected Answer
            </Label>
            <Input
              id={`answer-${question.id}`}
              placeholder="Enter the expected answer"
              value={question.correctAnswer as string}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
              disabled={disabled}
            />
            <p className="text-xs text-gray-500">This will be used for automatic grading (case-insensitive)</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
