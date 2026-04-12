"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DEMO_EMAILS, DEMO_CUSTOMERS } from "@/lib/demo-data";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Eye, Zap, Check, Clock, Send, RefreshCw } from "lucide-react";

export default function OutreachPage() {
  const [activeTab, setActiveTab] = useState("pending_approval");
  const [emails, setEmails] = useState(DEMO_EMAILS);
  const [isGenerating, setIsGenerating] = useState(false);

  const displayedEmails = emails.filter(e => e.status === activeTab || (activeTab === "sent" && ["sent", "opened", "clicked"].includes(e.status)));
  const getCustomer = (id: any) => DEMO_CUSTOMERS.find(c => c.id === id);

  const handleApprove = (id: any) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, status: "sent" } : e));
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          company: "Acme Corp",
          riskLevel: "high",
          topReasons: ["Dropped usage", "No login in 10 days"],
          usageData: "Usage dropped by 45%",
          desiredOutcome: "Book a retention call",
          tone: "empathetic and urgent"
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setEmails(prev => [{
          id: `ai-draft-${Date.now()}`,
          customer_id: "c-001",
          playbook_id: "p-001",
          subject: data.subject,
          body: data.body,
          status: "pending_approval",
          created_at: new Date().toISOString()
        } as any, ...prev]);
        setActiveTab("pending_approval");
      } else {
        alert("Verification failed: Security filter blocked request. " + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-1">Autonomous Outreach</h1>
            <p className="text-text-secondary text-sm">AI-managed communications for customer retention and expansion.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo/10 to-transparent border border-indigo/20 text-indigo rounded-xl text-xs font-bold hover:bg-indigo/20 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
              {isGenerating ? "Processing..." : "Generate AI Draft (E2E Test)"}
            </button>
            <div className="flex bg-surface border border-border rounded-xl p-1">
              <button 
                onClick={() => setActiveTab("pending_approval")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "pending_approval" ? "bg-indigo text-white shadow-sm" : "text-text-muted hover:text-text-primary"}`}
              >
                Needs Review
              </button>
              <button 
                onClick={() => setActiveTab("sent")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "sent" ? "bg-indigo text-white shadow-sm" : "text-text-muted hover:text-text-primary"}`}
              >
                Active Sequences
              </button>
            </div>
          </div>
        </header>

        {/* Outreach Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Emails Drafted (24h)", value: "12", icon: Mail, color: "text-indigo" },
            { label: "Open Rate", value: "74%", icon: Eye, color: "text-emerald" },
            { label: "Avg. Time to Draft", value: "4.2s", icon: Zap, color: "text-amber" },
          ].map((m, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2 text-text-muted">
                <m.icon size={16} />
                <span className="text-[10px] uppercase font-mono tracking-widest">{m.label}</span>
              </div>
              <h3 className={`text-2xl font-bold ${m.color}`}>{m.value}</h3>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {displayedEmails.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-surface/50 border border-border border-dashed rounded-2xl"
              >
                <div className="w-16 h-16 bg-indigo/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-indigo" size={32} />
                </div>
                <h3 className="font-bold text-lg">Inbox Zero</h3>
                <p className="text-text-secondary text-sm">AI has no pending drafts requiring your approval.</p>
              </motion.div>
            ) : (
              displayedEmails.map((email: any, i: number) => {
                const customer = getCustomer(email.customer_id);
                return (
                  <motion.div 
                    key={email.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-surface border border-border rounded-2xl overflow-hidden group hover:border-indigo/50 transition-all shadow-sm"
                  >
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="px-2 py-0.5 bg-indigo/10 text-indigo text-[10px] font-bold rounded border border-indigo/20 uppercase tracking-tighter">AI Draft</div>
                           <h4 className="font-bold text-lg">{email.subject}</h4>
                        </div>
                        <div className="text-sm text-text-secondary line-clamp-2 mb-4 italic" dangerouslySetInnerHTML={{ __html: email.body }} />
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-lg bg-base flex items-center justify-center text-[10px] font-bold">{customer?.name[0] || '?'}</div>
                             <span className="text-xs font-medium">{customer?.name || "Unknown"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-text-muted">
                            <Clock size={12} />
                            <span className="text-[10px] font-mono">Drafted Just Now</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-end gap-2 border-l border-border pl-6 min-w-[140px]">
                        {activeTab === "pending_approval" && (
                          <button onClick={() => handleApprove(email.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-dark transition-all shadow-lg shadow-indigo/20">
                            <Send size={14} /> Approve & Send
                          </button>
                        )}
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-border text-text-muted px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-base hover:text-text-primary transition-all">
                          <Eye size={14} /> View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
