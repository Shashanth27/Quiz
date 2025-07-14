"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BookOpen,
  BarChart3,
  Users,
  Trophy,
  Settings,
  Home,
  CheckCircle,
  Clock,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  LogOut,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { useAuth } from "@/contexts/auth-context"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface QuizData {
  id: number
  title: string
  subject: string
  duration: string
  date: string
  score: number | null
  status: "completed" | "available" | "upcoming"
  difficulty: "Easy" | "Medium" | "Hard"
  attempts: number
}

interface StudentData {
  name: string
  section: string
  score: number
  rank: number
  online: boolean
  isCurrentUser?: boolean
}

// Helper functions for safe name handling
const getDisplayName = (user: { name?: string; email?: string }) =>
  user.name && user.name.trim().length > 0 ? user.name : (user.email?.split("@")[0] ?? "User")

const getFirstName = (displayName: string) => displayName.split(" ")[0]

const getInitials = (displayName: string) =>
  displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

export default function StudentDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState("dashboard");
  const [sortLevel, setSortLevel] = useState("College Level");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Sample data (move here so it's always defined)
  const stats = {
    totalQuizzes: 18,
    completed: 11,
    averageScore: 76,
    classRank: 13,
  }

  const recentQuizzes: QuizData[] = [
    { id: 1, title: "Math Quiz 101", subject: "Mathematics", duration: "30 mins", date: "2023-07-20", score: 85, status: "completed", difficulty: "Easy", attempts: 2 },
    { id: 2, title: "Science Test", subject: "Physics", duration: "45 mins", date: "2023-07-21", score: null, status: "available", difficulty: "Medium", attempts: 0 },
    { id: 3, title: "History Review", subject: "History", duration: "20 mins", date: "2023-07-22", score: 92, status: "completed", difficulty: "Hard", attempts: 1 },
    { id: 4, title: "English Composition", subject: "English", duration: "60 mins", date: "2023-07-23", score: null, status: "upcoming", difficulty: "Easy", attempts: 0 },
  ]

  const classmates: StudentData[] = [
    { name: "John Doe", section: "Computer Science - Section A", score: 88, rank: 1, online: true, isCurrentUser: true },
    { name: "Jane Smith", section: "Computer Science - Section A", score: 75, rank: 5, online: false },
    { name: "Peter Parker", section: "Computer Science - Section B", score: 95, rank: 1, online: true },
    { name: "Mary Jane", section: "Computer Science - Section A", score: 80, rank: 3, online: false },
  ]

  const leaderboard = [
    { name: "John Doe", department: "Computer Science", section: "Section A", score: 92, quizzes: 10, average: 88, rank: 1 },
    { name: "Jane Smith", department: "Computer Science", section: "Section A", score: 85, quizzes: 8, average: 82, rank: 2 },
    { name: "Peter Parker", department: "Computer Science", section: "Section B", score: 98, quizzes: 12, average: 90, rank: 3 },
    { name: "Mary Jane", department: "Computer Science", section: "Section A", score: 88, quizzes: 10, average: 85, rank: 4 },
  ]

  const subjectPerformance = [
    { subject: "Mathematics", score: 88 },
    { subject: "Physics", score: 92 },
    { subject: "History", score: 85 },
    { subject: "English", score: 90 },
  ]

  // Chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Performance Trend",
        data: [65, 72, 68, 75, 78, 76, 82],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Performance Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  const displayName = getDisplayName({ name: user.user_metadata?.full_name || user.user_metadata?.name, email: user.email })
  const firstName = getFirstName(displayName)
  const initials = getInitials(displayName)

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "quizzes", label: "Quizzes", icon: BookOpen },
    { key: "classmates", label: "Classmates", icon: Users },
    { key: "leaderboard", label: "Leaderboard", icon: Trophy },
    { key: "settings", label: "Settings", icon: Settings },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back to your learning hub</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.4%
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.0%
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
                <div className="flex items-center text-sm text-red-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -4.5%
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Class Rank</p>
                <p className="text-2xl font-bold">#{stats.classRank}</p>
                <div className="flex items-center text-sm text-red-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -6.5%
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quizzes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
          <CardDescription>Your latest quiz activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Quiz</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentQuizzes.slice(0, 3).map((quiz) => (
                  <tr key={quiz.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{quiz.title}</td>
                    <td className="py-3 px-4">{quiz.subject}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {quiz.duration}
                      </div>
                    </td>
                    <td className="py-3 px-4">{quiz.date}</td>
                    <td className="py-3 px-4">
                      {quiz.score ? (
                        <span className="font-semibold">{quiz.score}%</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={quiz.status === "completed" ? "default" : "secondary"}
                        className={
                          quiz.status === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {quiz.status === "completed" ? "Completed" : "Available"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Detailed performance insights</p>
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-2">
        {["College Level", "Department Level", "Section Level"].map((level) => (
          <Button
            key={level}
            variant={sortLevel === level ? "default" : "outline"}
            onClick={() => setSortLevel(level)}
            className={sortLevel === level ? "bg-blue-600" : ""}
          >
            {level}
          </Button>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription>Your quiz performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your performance across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="font-semibold">{subject.score}%</span>
                </div>
                <Progress value={subject.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderQuizzes = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-600">All your quiz activities</p>
      </div>

      <div className="grid gap-4">
        {recentQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    <Badge
                      variant="outline"
                      className={
                        quiz.difficulty === "Easy"
                          ? "border-green-200 text-green-700"
                          : quiz.difficulty === "Medium"
                            ? "border-yellow-200 text-yellow-700"
                            : "border-red-200 text-red-700"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{quiz.subject}</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {quiz.duration}
                    </div>
                    <span>{quiz.date}</span>
                    <span>{quiz.attempts} attempts</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge
                      variant={quiz.status === "completed" ? "default" : "secondary"}
                      className={
                        quiz.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : quiz.status === "available"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {quiz.status}
                    </Badge>
                    {quiz.score && <div className="text-lg font-bold mt-1">{quiz.score}%</div>}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderClassmates = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Classmates</h1>
        <p className="text-gray-600">Connect with your section peers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Classmates</CardTitle>
          <CardDescription>Computer Science - Section A & B</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classmates.map((student, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  student.isCurrentUser ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        student.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium">
                      {student.name}
                      {student.isCurrentUser && <span className="text-blue-600 ml-1">(You)</span>}
                    </div>
                    <div className="text-sm text-gray-600">{student.section}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{student.score}%</div>
                  <div className="text-sm text-gray-600">Rank #{student.rank}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against peers</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Live • Updates every 30 seconds
        </div>
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-2">
        {["College Level", "Department Level", "Section Level"].map((level) => (
          <Button
            key={level}
            variant={sortLevel === level ? "default" : "outline"}
            onClick={() => setSortLevel(level)}
            className={sortLevel === level ? "bg-blue-600" : ""}
          >
            {level}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <CardDescription>Current standings based on quiz performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((student) => (
              <div
                key={student.rank}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  student.name === "Google User" ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      student.rank <= 3 ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {student.rank <= 3 ? <Trophy className="w-4 h-4" /> : student.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{student.name}</span>
                      {student.rank <= 3 && <Star className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="text-sm text-gray-600">
                      {student.department} • {student.section}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{student.score}%</div>
                  <div className="text-sm text-gray-600">
                    {student.quizzes} quizzes • {student.average}% avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{displayName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge variant="secondary">Student</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={displayName} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={user.email} className="mt-1" />
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="quiz-reminders" />
            <label htmlFor="quiz-reminders" className="text-sm font-medium">
              Quiz reminders
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="score-updates" />
            <label htmlFor="score-updates" className="text-sm font-medium">
              Score updates
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="leaderboard-changes" />
            <label htmlFor="leaderboard-changes" className="text-sm font-medium">
              Leaderboard changes
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case "analytics":
        return renderAnalytics()
      case "quizzes":
        return renderQuizzes()
      case "classmates":
        return renderClassmates()
      case "leaderboard":
        return renderLeaderboard()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Quiz Portal</h2>
              <p className="text-sm text-gray-600">Student Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeView === item.key ? "bg-gray-100 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-600">student</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={async () => { await signOut(); router.push("/login"); }} className="w-full justify-start bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  )
}
