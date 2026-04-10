"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, Users, Play, Mail, BarChart3, Settings, MessageCircle, X, Send, Loader2, LogOut } from "lucide-react";
import { DEMO_CUSTOMERS, DEMO_AI_ACTIONS, getHealthBg, getHealthLabel } from "@/lib/demo-data";
import { useRequireAuth, useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/playbooks", label: "Playbooks", icon: Play },
  { href: "/dashboard/emails", label: "Emails", icon: Mail },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context: `Customers: ${DEMO_CUSTOMERS.map(c => `${c.name} (health: ${c.health_score}, MRR: $${c.mrr})`).join(", ")}` }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response || data.error || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo hover:bg-indigo-dark text-white flex items-center justify-center shadow-lg shadow-indigo/20 transition-colors">
        <MessageCircle className="w-5 h-5" />
      </button>
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-surface border border-border rounded-xl flex flex-col shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-indigo flex items-center justify-center"><Zap className="w-3 h-3 text-white" /></div>
              <span className="font-heading font-semibold text-sm">ContextIQ AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center text-text-muted text-sm py-8">
                <p className="mb-2">Ask me anything about your customers.</p>
                <p className="text-xs">&ldquo;Which customers are most at risk?&rdquo;</p>
                <p className="text-xs">&ldquo;Draft a renewal email for Acme Corp&rdquo;</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.role === "user" ? "text-right" : ""}`}>
                <div className={`inline-block max-w-[80%] rounded-lg px-3 py-2 ${m.role === "user" ? "bg-indigo/20 text-indigo-light" : "bg-surface-light text-text-secondary"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-text-muted flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Thinking...</div>}
          </div>
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about your customers..." className="flex-1 bg-base border border-border rounded-lg px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:border-indigo" />
              <button onClick={send} className="w-8 h-8 rounded-lg bg-indigo hover:bg-indigo-dark text-white flex items-center justify-center transition-colors"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  return (
    <aside className={`hidden lg:flex flex-col border-r border-border bg-surface ${collapsed ? "w-16" : "w-64"} transition-all duration-200`}>
      <div className="p-3 border-b border-border">
        <h3 className={`font-mono text-xs text-text-muted ${collapsed ? "text-center" : "px-2"}`}>CUSTOMERS</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {DEMO_CUSTOMERS.map(c => (
          <Link key={c.id} href={`/dashboard/customers/${c.id}`} className={`flex items-center gap-2 px-3 py-2 hover:bg-surface-light transition-colors ${pathname === `/dashboard/customers/${c.id}` ? "bg-surface-light" : ""}`}>
            <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${getHealthBg(c.health_score)}`}>
              {c.health_score}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{c.name}</p>
                <p className="text-xs text-text-muted">${c.mrr.toLocaleString()}/mo</p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Protect dashboard routes
  useRequireAuth("/login");

  // Show loading while auth state is being determined
  const { loading: authLoading } = useAuth();
  if (authLoading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Top Nav */}
      <nav className="h-14 border-b border-border bg-surface flex items-center px-4 gap-4 shrink-0">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-sm hidden sm:inline">ContextIQ</span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${pathname === item.href || pathname.startsWith(item.href + "/") ? "bg-indigo/10 text-indigo" : "text-text-muted hover:text-text-secondary hover:bg-surface-light"}`}>
              <item.icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-text-muted hover:text-text-secondary text-xs font-mono hidden lg:block">
            {sidebarCollapsed ? "▸" : "◂"}
          </button>
          <button 
            onClick={signOut}
            className="text-text-muted hover:text-danger text-xs font-mono"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo/20 flex items-center justify-center text-indigo text-xs font-bold">
            {user?.email?.charAt(0).toUpperCase() || "JD"}
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <AIChatWidget />
    </div>
  );
}
