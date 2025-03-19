"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!isLoading && !isLoggedIn) {
        router.push("/login");
      }
    }, [isLoggedIn, isLoading, router]);
  
    // Show nothing or a loading spinner while checking auth
    if (isLoading) {
      return <div>Loading...</div>; // Or a nicer loading spinner component
    }
  
    // Don't render children if not authenticated
    if (!isLoggedIn) {
      return null;
    }
  
    return <>{children}</>;
  };