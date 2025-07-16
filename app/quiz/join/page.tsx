"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

export default function JoinQuizPage() {
  const [quizCode, setQuizCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!quizCode.trim()) {
        setError("Please enter a quiz code")
        setIsLoading(false)
        return
      }
      // Check if quiz code exists in Supabase
      const { data, error } = await supabase
        .from('quizzes')
        .select('code')
        .eq('code', quizCode.trim())
        .single();
      if (!data || !data.code) {
        setError("Invalid quiz code. Please check with your instructor.");
        setIsLoading(false);
        return;
      }
      // Redirect to quiz taking page
      router.push(`/quiz/take/${quizCode.trim()}`);
    } catch (error) {
      setError("Failed to join quiz. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Join Quiz Session</CardTitle>
          <CardDescription className="text-gray-600">Enter the quiz code provided by your instructor</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quizCode">Quiz Code</Label>
              <Input
                id="quizCode"
                type="text"
                placeholder="Enter quiz code (e.g., MATH101)"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-wider"
                disabled={isLoading}
                maxLength={10}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining Quiz...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Join Quiz
                </>
              )}
            </Button>
          </form>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Demo Quiz Codes:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white rounded px-3 py-2 text-center font-mono">MATH101</div>
              <div className="bg-white rounded px-3 py-2 text-center font-mono">PHYS201</div>
              <div className="bg-white rounded px-3 py-2 text-center font-mono">CHEM301</div>
              <div className="bg-white rounded px-3 py-2 text-center font-mono">BIO401</div>
            </div>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => router.push("/student/dashboard")}>
              ← Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
