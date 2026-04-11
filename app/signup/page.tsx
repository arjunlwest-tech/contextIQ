"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Force dynamic rendering to avoid build-time env var issues
export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    
    const { error, user } = await signUp(email, password);
    
    if (error) {
      setError(error.message || "Signup failed. Please try again.");
      setLoading(false);
      return;
    }
    
    if (!user?.confirmed_at) {
      // Email confirmation required
      setMessage("Check your email to confirm your account!");
      setLoading(false);
      return;
    }
    
    router.push("/onboarding");
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
          <h1 className="font-heading text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-text-secondary text-sm">Start automating your customer success</p>
        </div>


        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 border border-danger/20">
              {error}
            </div>
          )}
          {message && (
            <div className="text-success text-sm bg-success/10 rounded-lg px-3 py-2 border border-success/20">
              {message}
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
              minLength={8}
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
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
            ) : (
              <><Mail className="w-4 h-4" /> Create account</>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account? <Link href="/login" className="text-indigo hover:text-indigo-light">Log in</Link>
        </p>
      </div>
    </div>
  );
}
