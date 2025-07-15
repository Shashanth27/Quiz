"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, BookOpen, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { createStudentProfile, createFacultyProfile } from "@/lib/auth-service";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    section: "",
    username: "", // Added username field
  })
  const [userType, setUserType] = useState<"student" | "faculty">("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Check authentication and profile existence on mount
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const userTypeParam = searchParams.get("userType") as "student" | "faculty" | null;
        const userTypeToCheck = userTypeParam || userType;
        let profileExists = false;
        if (userTypeToCheck === "faculty") {
          const { data: faculty } = await supabase
            .from("faculty_profiles")
            .select("id")
            .eq("email", session.user.email)
            .single();
          profileExists = !!faculty;
        } else {
          const { data: student } = await supabase
            .from("student_profiles")
            .select("id")
            .eq("email", session.user.email)
            .single();
          profileExists = !!student;
        }
        if (profileExists) {
          // Redirect to dashboard
          router.replace(userTypeToCheck === "faculty" ? "/faculty/dashboard" : "/student/dashboard");
        }
      }
    };
    checkAuthAndProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fill from query params
  useEffect(() => {
    const email = searchParams.get("email") || ""
    const name = searchParams.get("name") || ""
    const userTypeParam = searchParams.get("userType") as "student" | "faculty" | null
    setFormData((prev) => ({ ...prev, email, name }))
    if (userTypeParam) setUserType(userTypeParam)
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      if (userType === "student") {
        if (!formData.class || !formData.section || !formData.username || !formData.email || !formData.password) {
          setError("All fields are required for students.")
          setIsLoading(false)
          return
        }
        // Register with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              user_type: 'student',
              username: formData.username,
              department: formData.class,
              section: formData.section,
            }
          }
        });
        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }
        // Use the create_student_profile RPC function
        const { error: rpcError } = await supabase.rpc('create_student_profile', {
          user_email: formData.email,
          department: formData.class,
          section: formData.section,
          username: formData.username,
        });
        if (rpcError) {
          setError(rpcError.message);
          setIsLoading(false);
          return;
        }
        router.push('/student/dashboard');
      } else {
        if (!formData.department || !formData.section || !formData.username) {
          setError("Department, section, and username are required for faculty.")
          setIsLoading(false)
          return
        }
        // Use the new RPC function for faculty profile creation
        await createFacultyProfile({
          email: formData.email,
          department: formData.department,
          section: formData.section,
          username: formData.username,
        });
        router.replace("/faculty/dashboard")
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.toLowerCase().includes("duplicate")) {
        setError("This email or username is already registered. Please log in instead.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Join thousands of learners on Quiz Portal</p>
        </div>

        <Card className="bg-white shadow-lg border-gray-200">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
            <CardDescription className="text-center">Choose your account type and create your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={userType}
              onValueChange={(value) => setUserType(value as "student" | "faculty")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@university.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {userType === "student" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Input
                          id="class"
                          type="text"
                          placeholder="10A"
                          value={formData.class}
                          onChange={(e) => handleInputChange("class", e.target.value)}
                          required={userType === "student"}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="section">Section</Label>
                        <Input
                          id="section"
                          type="text"
                          placeholder="A"
                          value={formData.section}
                          onChange={(e) => handleInputChange("section", e.target.value)}
                          required={userType === "student"}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="johndoe123"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          required={userType === "student"}
                          className="h-11"
                        />
                      </div>
                    </>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Student Account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="faculty" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty-name">Full Name</Label>
                    <Input
                      id="faculty-name"
                      type="text"
                      placeholder="Dr. Jane Smith"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-email">Email</Label>
                    <Input
                      id="faculty-email"
                      type="email"
                      placeholder="jane.smith@university.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="faculty-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="faculty-confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-department">Department</Label>
                    <Input
                      id="faculty-department"
                      type="text"
                      placeholder="Computer Science"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      required={userType === "faculty"}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-section">Section</Label>
                    <Input
                      id="faculty-section"
                      type="text"
                      placeholder="A"
                      value={formData.section}
                      onChange={(e) => handleInputChange("section", e.target.value)}
                      required={userType === "faculty"}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-username">Username</Label>
                    <Input
                      id="faculty-username"
                      type="text"
                      placeholder="janesmith123"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      required={userType === "faculty"}
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Faculty Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/login")}>
                Sign in here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
