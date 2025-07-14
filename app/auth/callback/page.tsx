"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Get session
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;
      if (!session || error) {
        router.replace("/login?error=auth");
        return;
      }
      // Get userType from localStorage
      const userType = localStorage.getItem("userType") || "student";
      const user = session.user;
      if (user) {
        if (userType === "faculty") {
          const { error: rpcError } = await supabase.rpc("create_faculty_profile", {
            user_email: user.email,
          });
          if (rpcError) {
            console.error("Faculty profile creation error:", rpcError.message);
          }
        } else {
          const { error: rpcError } = await supabase.rpc("create_student_profile", {
            user_email: user.email,
          });
          if (rpcError) {
            console.error("Student profile creation error:", rpcError.message);
          }
        }
      }
      // Redirect based on userType
      if (userType === "faculty") {
        router.replace("/faculty/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    };
    handleAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg font-semibold">Signing you in...</div>
    </div>
  );
} 