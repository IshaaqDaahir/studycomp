"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";       // Custom auth context/hook
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();   // From auth context
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return <div>Loading...</div>;   // Show loader while checking/auth fails
  }

  return <>{children}</>;   // Render protected content if authenticated
}