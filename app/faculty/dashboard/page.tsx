"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  TrendingDown,
  User,
  Home,
  Brain,
  CheckCircle,
  Activity,
  Download,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  FileText,
  Upload,
  Eye,
  Edit,
  Copy,
  X,
  Flame,
  Filter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

// Navigation items
const facultyNavItems = [
  { key: "dashboard", title: "Dashboard", icon: Home, isActive: true },
  { key: "analytics", title: "Smart Analytics", icon: Brain, badge: "AI", badgeVariant: "default" as const },
  { key: "quiz-studio", title: "Quiz Studio", icon: BookOpen, badge: "3", badgeVariant: "secondary" as const },
  { key: "student-hub", title: "Student Hub", icon: Users },
  { key: "settings", title: "Settings", icon: Settings },
]

// Sample data
const sampleSections = [
  {
    id: "A",
    name: "Section A",
    students: 45,
    improvement: "+8.4%",
    avgScore: 87.3,
    completionRate: 94,
    engagement: 89,
    strongAreas: ["Database Design", "Web Development"],
    weakAreas: ["Algorithms", "Data Structures"],
  },
  {
    id: "B",
    name: "Section B",
    students: 42,
    improvement: "+12.1%",
    avgScore: 83.7,
    completionRate: 91,
    engagement: 85,
    strongAreas: ["Data Structures", "Database Design"],
    weakAreas: ["Web Development", "Software Engineering"],
  },
  {
    id: "C",
    name: "Section C",
    students: 38,
    improvement: "+5.2%",
    avgScore: 79.8,
    completionRate: 88,
    engagement: 82,
    strongAreas: ["Algorithms", "Software Engineering"],
    weakAreas: ["Database Design", "Web Development"],
  },
]

const sampleStudents = [
  {
    id: 1,
    name: "Arjun Patel",
    section: "Section A",
    department: "Computer Science",
    year: "3rd Year",
    avatar: "AP",
    avgScore: 94.2,
    completedQuizzes: 18,
    streak: 12,
    improvement: "+8.5%",
    lastActive: "2 hours ago",
    online: true,
    badges: ["Top Performer", "Consistent"],
    unitPerformance: [
      { unit: "Data Structures", score: 94, completed: 8, total: 10 },
      { unit: "Algorithms", score: 89, completed: 6, total: 8 },
      { unit: "Database Design", score: 96, completed: 4, total: 4 },
      { unit: "Web Development", score: 92, completed: 5, total: 6 },
    ],
    recentActivity: [
      { quiz: "Binary Trees Quiz", date: "2025-01-12", score: 96, time: "18 min" },
      { quiz: "SQL Joins Assessment", date: "2025-01-11", score: 94, time: "22 min" },
      { quiz: "React Components Test", date: "2025-01-10", score: 88, time: "25 min" },
    ],
  },
  {
    id: 2,
    name: "Sneha Sharma",
    section: "Section B",
    department: "Computer Science",
    year: "3rd Year",
    avatar: "SS",
    avgScore: 91.8,
    completedQuizzes: 16,
    streak: 8,
    improvement: "+12.3%",
    lastActive: "1 hour ago",
    online: true,
    badges: ["Rising Star", "Active"],
    unitPerformance: [
      { unit: "Data Structures", score: 92, completed: 7, total: 10 },
      { unit: "Algorithms", score: 88, completed: 5, total: 8 },
      { unit: "Database Design", score: 95, completed: 4, total: 4 },
      { unit: "Web Development", score: 89, completed: 4, total: 6 },
    ],
    recentActivity: [
      { quiz: "Hash Tables Quiz", date: "2025-01-12", score: 92, time: "20 min" },
      { quiz: "Database Normalization", date: "2025-01-11", score: 95, time: "28 min" },
      { quiz: "JavaScript Fundamentals", date: "2025-01-09", score: 87, time: "30 min" },
    ],
  },
  {
    id: 3,
    name: "Rohit Kumar",
    section: "Section A",
    department: "Computer Science",
    year: "3rd Year",
    avatar: "RK",
    avgScore: 85.4,
    completedQuizzes: 14,
    streak: 5,
    improvement: "+3.2%",
    lastActive: "30 min ago",
    online: false,
    badges: ["Steady Progress"],
    unitPerformance: [
      { unit: "Data Structures", score: 87, completed: 6, total: 10 },
      { unit: "Algorithms", score: 82, completed: 4, total: 8 },
      { unit: "Database Design", score: 89, completed: 3, total: 4 },
      { unit: "Web Development", score: 84, completed: 3, total: 6 },
    ],
    recentActivity: [
      { quiz: "Sorting Algorithms", date: "2025-01-11", score: 85, time: "35 min" },
      { quiz: "SQL Basics", date: "2025-01-10", score: 89, time: "25 min" },
      { quiz: "HTML/CSS Quiz", date: "2025-01-09", score: 82, time: "28 min" },
    ],
  },
]

const sampleQuizzes = [
  {
    id: 1,
    title: "Advanced Data Structures",
    subject: "Computer Science",
    difficulty: "Hard",
    status: "active",
    category: "Core",
    tags: ["Trees", "Graphs", "Algorithms"],
    studentsEnrolled: 45,
    submissions: 38,
    avgScore: 82.4,
    questions: 15,
    timeLimit: "45 min",
    completionRate: 84,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    title: "Database Design Principles",
    subject: "Database Systems",
    difficulty: "Medium",
    status: "active",
    category: "Core",
    tags: ["SQL", "Normalization", "ER Diagrams"],
    studentsEnrolled: 42,
    submissions: 40,
    avgScore: 89.2,
    questions: 12,
    timeLimit: "30 min",
    completionRate: 95,
    lastActivity: "1 hour ago",
  },
  {
    id: 3,
    title: "React Component Lifecycle",
    subject: "Web Development",
    difficulty: "Medium",
    status: "completed",
    category: "Elective",
    tags: ["React", "JavaScript", "Frontend"],
    studentsEnrolled: 38,
    submissions: 35,
    avgScore: 76.8,
    questions: 10,
    timeLimit: "25 min",
    completionRate: 92,
    lastActivity: "1 day ago",
  },
]

const recentActivities = [
  { type: "submission", student: "Arjun Patel", quiz: "Binary Trees Quiz", score: 96, time: "2 min ago" },
  { type: "achievement", student: "Sneha Sharma", achievement: "Perfect Score Streak", time: "5 min ago" },
  { type: "question", student: "Rohit Kumar", question: "Clarification on heap sort", time: "8 min ago" },
  { type: "submission", student: "Priya Singh", quiz: "SQL Joins Assessment", score: 88, time: "12 min ago" },
  { type: "achievement", student: "Arjun Patel", achievement: "Quiz Master", time: "15 min ago" },
]

export default function FacultyDashboard() {
  const { data: session, status } = useSession()
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [analyticsFilter, setAnalyticsFilter] = useState("Section Level")
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    // If you want to check for user type, you can do so here if you store it in the session
  }, [session, status, router])

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  // Dashboard Content
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good morning, Dr. Khanna</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System</span>
              <span className="text-sm font-medium text-green-600">Optimal</span>
            </div>
            <span className="text-gray-600">
              You have <span className="text-blue-600 font-medium">18 submissions</span> pending review and{" "}
              <span className="text-green-600 font-medium">3 students</span> achieved perfect scores today.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm">
            <Download className="w-4 h-4" />
            Export Analytics
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => router.push("/faculty/quiz/create")}
          >
            <Sparkles className="w-4 h-4" />
            Create AI Quiz
          </Button>
        </div>
      </div>

      {/* AI Teaching Assistant Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">AI Teaching Assistant Insights</CardTitle>
              <CardDescription className="text-blue-700">Powered by advanced analytics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Performance Trend</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">Algorithm scores improved by 8.5%</p>
            <p className="text-xs text-gray-600">after implementing visual explanations</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Engagement Alert</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">15 students need additional support</p>
            <p className="text-xs text-gray-600">in Data Structures concepts</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Recommendation</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">Consider adaptive difficulty</p>
            <p className="text-xs text-gray-600">for next Database Systems quiz</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900">67</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+15.2%</span>
                </div>
                <p className="text-xs text-gray-500">This semester</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-3xl font-bold text-gray-900">342</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.4%</span>
                </div>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-3xl font-bold text-gray-900">83.7%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">-2.1%</span>
                </div>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900">94.2%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+5.7%</span>
                </div>
                <p className="text-xs text-gray-500">This week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100"
              onClick={() => router.push("/faculty/quiz/create")}
            >
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Create AI Quiz</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100"
              onClick={() => router.push("/faculty/analytics")}
            >
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Smart Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-green-50 border-green-200 hover:bg-green-100"
              onClick={() => router.push("/faculty/students")}
            >
              <Users className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Student Hub</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Quizzes and Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Quizzes</CardTitle>
              <CardDescription>Your latest quiz activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleQuizzes.map((quiz) => (
                <div key={quiz.id} className="p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                      <Badge
                        variant={
                          quiz.difficulty === "Easy"
                            ? "secondary"
                            : quiz.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {quiz.difficulty}
                      </Badge>
                      <Badge variant={quiz.status === "active" ? "default" : "secondary"}>{quiz.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium ml-1">{quiz.studentsEnrolled}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submissions:</span>
                      <span className="font-medium ml-1">{quiz.submissions}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-medium ml-1">{quiz.avgScore}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium ml-1">{quiz.questions}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{quiz.completionRate}%</span>
                    </div>
                    <Progress value={quiz.completionRate} className="h-2" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last activity: {quiz.lastActivity}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Activity
              </CardTitle>
              <CardDescription>Real-time student activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50/50">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "submission"
                        ? "bg-blue-500"
                        : activity.type === "achievement"
                          ? "bg-green-500"
                          : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                    <p className="text-xs text-gray-600">
                      {activity.type === "submission" && `Submitted ${activity.quiz} - ${activity.score}%`}
                      {activity.type === "achievement" && `Earned ${activity.achievement}`}
                      {activity.type === "question" && `Asked: ${activity.question}`}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  // Smart Analytics Content
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Analytics</h1>
          <p className="text-gray-600">Section-level performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={analyticsFilter === "Section Level" ? "default" : "outline"}
              onClick={() => setAnalyticsFilter("Section Level")}
              className={analyticsFilter === "Section Level" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
            >
              Section Level
            </Button>
            <Button
              variant={analyticsFilter === "Department Level" ? "default" : "outline"}
              onClick={() => setAnalyticsFilter("Department Level")}
              className={analyticsFilter === "Department Level" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
            >
              Department Level
            </Button>
          </div>
          <Button variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleSections.map((section) => (
          <Card key={section.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{section.name}</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {section.improvement}
                </Badge>
              </div>
              <CardDescription>{section.students} students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-xl font-bold text-blue-600">{section.avgScore}%</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Completion</p>
                  <p className="text-xl font-bold text-green-600">{section.completionRate}%</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Engagement Level</span>
                  <span>{section.engagement}%</span>
                </div>
                <Progress value={section.engagement} className="h-2" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Strong Areas</p>
                <div className="flex flex-wrap gap-1">
                  {section.strongAreas.map((area) => (
                    <Badge key={area} variant="default" className="bg-green-100 text-green-800 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Weak Areas</p>
                <div className="flex flex-wrap gap-1">
                  {section.weakAreas.map((area) => (
                    <Badge key={area} variant="outline" className="border-red-200 text-red-700 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Section Performance Trends</CardTitle>
          <CardDescription>Performance comparison across sections over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Chart.js Integration Placeholder</p>
              <p className="text-sm text-gray-500">Section performance trends will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Quiz Studio Content
  const renderQuizStudio = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Studio</h1>
          <p className="text-gray-600">Create and manage your quizzes</p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={() => router.push("/faculty/quiz/create")}
        >
          <Sparkles className="w-4 h-4" />
          Create New Quiz
        </Button>
      </div>

      {/* Creation Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/faculty/quiz/create")}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">AI-Powered Quiz</h3>
            <p className="text-sm text-blue-700">Let AI create questions based on your topics</p>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/faculty/quiz/create")}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Manual Creation</h3>
            <p className="text-sm text-green-700">Create questions manually with advanced editor</p>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/faculty/quiz/create")}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Import Questions</h3>
            <p className="text-sm text-purple-700">Upload from Excel, CSV, or other platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Existing Quizzes */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Your Quizzes</CardTitle>
          <CardDescription>Manage your existing quizzes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleQuizzes.map((quiz) => (
            <div key={quiz.id} className="p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                  <Badge variant="outline">{quiz.subject}</Badge>
                  <Badge variant="outline">{quiz.category}</Badge>
                  <Badge
                    variant={
                      quiz.difficulty === "Easy"
                        ? "secondary"
                        : quiz.difficulty === "Medium"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {quiz.difficulty}
                  </Badge>
                  <Badge variant={quiz.status === "active" ? "default" : "secondary"}>{quiz.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium ml-1">{quiz.studentsEnrolled}</span>
                </div>
                <div>
                  <span className="text-gray-600">Submissions:</span>
                  <span className="font-medium ml-1">{quiz.submissions}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Score:</span>
                  <span className="font-medium ml-1">{quiz.avgScore}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium ml-1">{quiz.questions}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Created: Jan 10, 2025</span>
                <span>Due: Jan 20, 2025</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  // Student Hub Content
  const renderStudentHub = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Hub</h1>
          <p className="text-gray-600">Monitor and support your students</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">284</div>
            <div className="text-sm text-gray-600">Active Students</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">42</div>
            <div className="text-sm text-gray-600">Top Performers</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">18</div>
            <div className="text-sm text-gray-600">Need Attention</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">127</div>
            <div className="text-sm text-gray-600">Online Now</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Students List */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Active Students</CardTitle>
          <CardDescription>Click on any student to view detailed performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleStudents.map((student) => (
            <div
              key={student.id}
              className="p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        student.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      {student.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {student.section} • {student.department} • {student.year}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{student.avgScore}%</p>
                      <p className="text-xs text-gray-600">Avg Score</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{student.completedQuizzes}</p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">{student.improvement}</span>
                      </div>
                      <p className="text-xs text-gray-600">Last active: {student.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  // Student Detail Modal
  const renderStudentModal = () => {
    if (!selectedStudent) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl">
                    {selectedStudent.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                  <p className="text-gray-600">
                    {selectedStudent.section} • {selectedStudent.department} • {selectedStudent.year}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedStudent.badges.map((badge) => (
                      <Badge key={badge} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedStudent.avgScore}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedStudent.completedQuizzes}</div>
                  <div className="text-sm text-gray-600">Completed Quizzes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <div className="text-2xl font-bold text-orange-600">{selectedStudent.streak}</div>
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div className="text-2xl font-bold text-green-600">{selectedStudent.improvement}</div>
                  </div>
                  <div className="text-sm text-gray-600">Improvement</div>
                </CardContent>
              </Card>
            </div>

            {/* Unit Performance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Performance</h3>
              <div className="space-y-4">
                {selectedStudent.unitPerformance.map((unit) => (
                  <div key={unit.unit} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{unit.unit}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {unit.completed}/{unit.total} completed
                        </span>
                        <span className="font-bold text-gray-900">{unit.score}%</span>
                      </div>
                    </div>
                    <Progress value={unit.score} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {selectedStudent.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.quiz}</p>
                      <p className="text-sm text-gray-600">
                        {activity.date} • Completed in {activity.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={activity.score >= 90 ? "default" : activity.score >= 80 ? "secondary" : "destructive"}
                      >
                        {activity.score}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Settings Content
  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-2xl">
                DR
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">Dr. Rajesh Khanna</h3>
              <p className="text-gray-600">Computer Science Department</p>
              <Badge variant="secondary">Faculty</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Dr. Rajesh Khanna" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="rajesh.khanna@university.edu" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Computer Science" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+91 98765 43210" className="mt-1" />
            </div>
          </div>

          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="quiz-submissions" />
            <Label htmlFor="quiz-submissions">Quiz submissions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="student-questions" />
            <Label htmlFor="student-questions">Student questions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="performance-alerts" />
            <Label htmlFor="performance-alerts">Performance alerts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="system-updates" />
            <Label htmlFor="system-updates">System updates</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case "analytics":
        return renderAnalytics()
      case "quiz-studio":
        return renderQuizStudio()
      case "student-hub":
        return renderStudentHub()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-md border-r border-white/20 flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">EduPro Portal</h2>
              <p className="text-sm text-gray-600">Faculty Dashboard</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-600">23</div>
              <div className="text-xs text-gray-600">Active Quizzes</div>
            </div>
            <div className="bg-green-50/50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-green-600">342</div>
              <div className="text-xs text-gray-600">Students</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {facultyNavItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeView === item.key
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant}
                    className={`text-xs ${activeView === item.key ? "bg-white/20 text-white" : ""}`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    DR
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Dr. Rajesh Khanna</p>
                  <p className="text-sm text-gray-600">Computer Science Dept.</p>
                </div>
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Rajesh Khanna</p>
                  <p className="text-xs leading-none text-muted-foreground">rajesh.khanna@university.edu</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900 capitalize">{activeView.replace("-", " ")}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>

      {/* Student Detail Modal */}
      {renderStudentModal()}
    </div>
  )
}
