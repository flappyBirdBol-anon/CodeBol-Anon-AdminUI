"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkSession: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const AUTH_TOKEN_KEY = "authToken";
const SESSION_ID_KEY = "sessionId";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if the current session is valid
  const checkSession = (): boolean => {
    // Get stored values
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    
    // If there's no token, user is not logged in
    if (!token || !sessionId) {
      return false;
    }
    
    // Check if browser was closed (by comparing session IDs)
    if (sessionId !== sessionStorage.getItem(SESSION_ID_KEY)) {
      return false;
    }
    
    return true;
  };
  
  // Initialize session
  useEffect(() => {
    // Generate a new session ID for this browser session
    if (!sessionStorage.getItem(SESSION_ID_KEY)) {
      const newSessionId = Math.random().toString(36).substring(2);
      sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
      
      // If we don't have a matching sessionId in localStorage,
      // it means the browser was closed and reopened - force logout
      if (localStorage.getItem(SESSION_ID_KEY) !== newSessionId) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
    
    // Check login status during initialization
    const isSessionValid = checkSession();
    
    if (isSessionValid) {
      // Save the session ID to localStorage to check continuity
      localStorage.setItem(SESSION_ID_KEY, sessionStorage.getItem(SESSION_ID_KEY) || "");
      setIsLoggedIn(true);
    } else {
      // Clear any existing tokens if session is invalid
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setIsLoggedIn(false);
    }
    
    setIsLoading(false);
  }, []);
  
  // Session verification
  useEffect(() => {
    if (!isLoggedIn) return;
    
    // Check session validity periodically
    const interval = setInterval(() => {
      const isSessionValid = checkSession();
      
      if (!isSessionValid && isLoggedIn) {
        logout();
        router.push("/login");
      }
    }, 5000); // Check every 5 seconds
    
    // Clean up
    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn, router]);

  const login = (token: string) => {
    // Generate new session ID
    const newSessionId = Math.random().toString(36).substring(2);
    sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
    localStorage.setItem(SESSION_ID_KEY, newSessionId);
    
    // Set auth token
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};