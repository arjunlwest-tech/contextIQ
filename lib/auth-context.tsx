"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface LocalUser {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; user: LocalUser | null }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "repulsora_user";
const USERS_KEY = "repulsora_users";

// Get stored users
const getStoredUsers = (): Record<string, { password: string; user: LocalUser }> => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Save users
const saveUsers = (users: Record<string, { password: string; user: LocalUser }>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored session
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const users = getStoredUsers();
    const userData = users[email];
    
    if (!userData) {
      return { error: new Error("No account found with this email. Please sign up first.") };
    }
    
    if (userData.password !== password) {
      return { error: new Error("Incorrect password. Please try again.") };
    }
    
    // Set user in state and localStorage
    setUser(userData.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData.user));
    
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    const users = getStoredUsers();
    
    if (users[email]) {
      return { error: new Error("An account with this email already exists. Please sign in instead."), user: null };
    }
    
    // Create new user
    const newUser: LocalUser = {
      id: "user_" + Date.now(),
      email,
      created_at: new Date().toISOString(),
    };
    
    // Store user
    users[email] = { password, user: newUser };
    saveUsers(users);
    
    // Set as current user
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    
    return { error: null, user: newUser };
  };

  const signInWithOAuth = async (provider: "google" | "github") => {
    // OAuth not supported in local mode - just create a mock user
    const mockEmail = `demo@${provider}.com`;
    const users = getStoredUsers();
    
    let userToUse: LocalUser;
    
    if (users[mockEmail]) {
      userToUse = users[mockEmail].user;
    } else {
      userToUse = {
        id: `user_${provider}_${Date.now()}`,
        email: mockEmail,
        created_at: new Date().toISOString(),
      };
      users[mockEmail] = { password: "oauth", user: userToUse };
      saveUsers(users);
    }
    
    setUser(userToUse);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userToUse));
    
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  const refreshUser = async () => {
    // No-op for localStorage
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithOAuth, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth(redirectTo = "/login") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}
