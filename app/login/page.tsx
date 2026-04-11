"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Github, Chrome, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message || "Login failed. Please check your credentials.");
      setLoading(false);
      return;
    }
    
    // Redirect handled by auth context/state change
    router.push("/dashboard");
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError("");
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setError("OAuth failed. Please try again.");
    }
    // OAuth redirect happens automatically
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="font-heading text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-text-secondary text-sm">Log in to your repulsora dashboard</p>
        </div>
        <div className="space-y-3 mb-6">
          <button 
            onClick={() => handleOAuth("google")} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-border hover:border-border-light bg-surface rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Chrome className="w-4 h-4" /> Continue with Google
          </button>
          <button 
            onClick={() => handleOAuth("github")} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-border hover:border-border-light bg-surface rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Github className="w-4 h-4" /> Continue with GitHub
          </button>
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-base px-2 text-text-muted">or</span></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 border border-danger/20">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-mono">EMAIL</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="you@company.com" 
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-text-muted focus:outline-none focus:border-indigo transition-colors" 
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-mono">PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••" 
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-text-muted focus:outline-none focus:border-indigo transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo hover:bg-indigo-dark disabled:opacity-50 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</>
            ) : (
              <><Mail className="w-4 h-4" /> Log in</>
            )}
          </button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          Don&apos;t have an account? <Link href="/signup" className="text-indigo hover:text-indigo-light">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
