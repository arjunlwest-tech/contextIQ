"use client";
import { useState, useEffect } from "react";
import { Mail, Check, Edit, X, Eye, Send, Clock, Zap, Loader2 } from "lucide-react";
import { getHealthBg } from "@/lib/demo-data";
import { getEmails, getCustomers } from "@/app/actions/data";

type Tab = "pending" | "sent" | "templates";

export default function EmailsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [autoSend, setAutoSend] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [emailsRes, customersRes] = await Promise.all([
        getEmails(),
        getCustomers()
      ]);
      if (emailsRes.data) setEmails(emailsRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const pendingEmails = emails.filter(e => e.status === "pending_approval" || e.status === "draft");
  const sentEmails = emails.filter(e => e.status === "sent" || e.status === "opened" || e.status === "clicked");

  const templates = [
    { id: "t1", name: "Churn Rescue Check-in", subject: "We noticed something — let's get back on track", category: "Churn Prevention" },
    { id: "t2", name: "Renewal Reminder", subject: "Your contract renewal is coming up", category: "Renewal" },
    { id: "t3", name: "Feature Adoption Nudge", subject: "Have you tried [Feature]?", category: "Onboarding" },
    { id: "t4", name: "Executive Escalation", subject: "Important update about your account", category: "Escalation" },
    { id: "t5", name: "Expansion Proposal", subject: "Ready to scale your usage?", category: "Expansion" },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">AI Email Center</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Auto-send all emails</span>
          <button onClick={() => setAutoSend(!autoSend)} className="flex items-center">
            {autoSend ? <div className="w-9 h-5 bg-indigo rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div> : <div className="w-9 h-5 bg-surface-light rounded-full relative"><div className="absolute left-0.5 top-0.5 w-4 h-4 bg-text-muted rounded-full" /></div>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {[
          { id: "pending" as Tab, label: "Pending Approval", count: pendingEmails.length },
          { id: "sent" as Tab, label: "Sent", count: sentEmails.length },
          { id: "templates" as Tab, label: "Templates", count: templates.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-indigo text-indigo" : "border-transparent text-text-muted hover:text-text-secondary"}`}>
            {t.label} <span className="text-xs bg-surface-light px-1.5 py-0.5 rounded">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Pending Approval */}
      {tab === "pending" && (
        <div className="space-y-3">
          {pendingEmails.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <Mail className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-text-muted text-sm">No emails pending approval.</p>
            </div>
          ) : pendingEmails.map(em => {
            const cust = customers.find(c => c.id === em.customer_id);
            return (
              <div key={em.id} className="bg-surface border border-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {cust && <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${getHealthBg(cust.health_score)}`}>{cust.health_score}</div>}
                    <div>
                      <p className="text-sm font-medium">{em.subject}</p>
                      <p className="text-xs text-text-muted">To: {cust?.name || "Unknown"} · {em.status === "draft" ? "Draft" : "Awaiting approval"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo/20 text-indigo px-1.5 py-0.5 rounded font-mono">AI</span>
                </div>
                <div className="text-sm text-text-secondary bg-base rounded-lg p-3 mb-4" dangerouslySetInnerHTML={{ __html: em.body }} />
                <div className="flex items-center gap-2">
                  <button className="bg-emerald/10 text-emerald px-4 py-2 rounded-lg text-xs font-medium hover:bg-emerald/20 transition-colors flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Approve & Send
                  </button>
                  <button className="bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg text-xs font-medium hover:border-border-light transition-colors flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button className="bg-danger/10 text-danger px-4 py-2 rounded-lg text-xs font-medium hover:bg-danger/20 transition-colors flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sent */}
      {tab === "sent" && (
        <div className="space-y-3">
          {sentEmails.map(em => {
            const cust = customers.find(c => c.id === em.customer_id);
            return (
              <div key={em.id} className="bg-surface border border-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{em.subject}</p>
                    <p className="text-xs text-text-muted">To: {cust?.name} · Sent {em.sent_at ? new Date(em.sent_at).toLocaleString() : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {em.opened_at && <span className="text-xs text-emerald flex items-center gap-1"><Eye className="w-3 h-3" /> Opened</span>}
                    {em.clicked_at && <span className="text-xs text-indigo flex items-center gap-1"><Zap className="w-3 h-3" /> Clicked</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Templates */}
      {tab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map(t => (
            <div key={t.id} className="bg-surface border border-border rounded-xl p-4 hover:border-border-light transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.subject}</p>
                </div>
                <span className="text-xs bg-surface-light text-text-muted px-2 py-0.5 rounded">{t.category}</span>
              </div>
              <button className="mt-2 text-xs text-indigo hover:text-indigo-light flex items-center gap-1"><Edit className="w-3 h-3" /> Edit template</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
