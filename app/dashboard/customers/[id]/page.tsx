"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Zap, Mail, FileText, Clock, Edit, Play, ToggleLeft, ToggleRight, Loader2, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DEMO_CUSTOMERS, DEMO_AI_ACTIONS, DEMO_EMAILS, DEMO_PLAYBOOKS, generateHealthTrend, getHealthBg, getHealthLabel } from "@/lib/demo-data";

type Tab = "overview" | "timeline" | "emails" | "qbr";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const customer = DEMO_CUSTOMERS.find(c => c.id === id);
  const [tab, setTab] = useState<Tab>("overview");
  const [overrideAI, setOverrideAI] = useState(false);
  const [churnAnalysis, setChurnAnalysis] = useState<Record<string, unknown> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [qbrData, setQbrData] = useState<Record<string, unknown> | null>(null);
  const [generatingQBR, setGeneratingQBR] = useState(false);
  const [showPlaybookMenu, setShowPlaybookMenu] = useState(false);

  const healthTrend = customer ? generateHealthTrend(customer.health_score) : [];
  const customerActions = DEMO_AI_ACTIONS.filter(a => a.customer_id === id);
  const customerEmails = DEMO_EMAILS.filter(e => e.customer_id === id);

  useEffect(() => {
    if (customer && tab === "overview" && !churnAnalysis && !analyzing) {
      runChurnAnalysis();
    }
  }, [customer, tab]);

  const runChurnAnalysis = async () => {
    if (!customer) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/churn-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      const data = await res.json();
      setChurnAnalysis(data);
    } catch {
      setChurnAnalysis({
        riskScore: customer.health_score < 40 ? 85 : customer.health_score < 70 ? 55 : 20,
        riskLevel: customer.health_score < 40 ? "critical" : customer.health_score < 70 ? "medium" : "low",
        topReasons: ["Usage declining", "Support ticket volume", "Low engagement"],
        recommendedAction: customer.health_score < 40 ? "Immediate executive outreach" : "Monitor and nudge",
        urgency: customer.health_score < 40 ? "immediate" : "this_week",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const runGenerateQBR = async () => {
    if (!customer) return;
    setGeneratingQBR(true);
    try {
      const res = await fetch("/api/ai/generate-qbr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name, company: customer.name, mrr: customer.mrr,
          healthScore: customer.health_score, metrics90d: healthTrend.slice(-10),
          usageSummary: customer.usage_metrics.map(m => `${m.feature}: ${m.usage}% (${m.trend})`).join(", "),
          supportSummary: `${customer.support_ticket_count} tickets, sentiment: ${customer.support_sentiment}`,
          winsSummary: customer.health_score > 50 ? "Stable usage in core features" : "Limited wins this quarter",
          risksSummary: customer.health_score < 50 ? "Significant usage decline, disengagement risk" : "Minor usage fluctuations",
        }),
      });
      const data = await res.json();
      setQbrData(data);
    } catch {
      setQbrData({
        executiveSummary: `${customer.name} has a health score of ${customer.health_score}. ${customer.health_score < 40 ? "Immediate intervention is recommended." : "Continued monitoring is advised."}`,
        keyMetrics: customer.usage_metrics.map(m => ({ label: m.feature, value: `${m.usage}%`, trend: m.trend })),
        wins: ["Core feature adoption maintained", "Support response time improved"],
        risks: ["Usage trending down", "Email engagement declining"],
        recommendations: ["Schedule executive check-in", "Offer product training session"],
        nextSteps: ["Send personalized outreach", "Create recovery plan", "Set up weekly review"],
      });
    } finally {
      setGeneratingQBR(false);
    }
  };

  if (!customer) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-muted">Customer not found.</p>
        <Link href="/dashboard/customers" className="text-indigo text-sm mt-2 inline-block">← Back to customers</Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Clock }[] = [
    { id: "overview", label: "Overview", icon: AlertTriangle },
    { id: "timeline", label: "AI Timeline", icon: Clock },
    { id: "emails", label: "Emails", icon: Mail },
    { id: "qbr", label: "QBR", icon: FileText },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customers" className="text-text-muted hover:text-text-secondary"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="font-heading text-2xl font-bold">{customer.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
              <span>${customer.mrr.toLocaleString()}/mo</span>
              <span>·</span>
              <span>Contract ends {customer.contract_end}</span>
              <span>·</span>
              <span className={`font-bold ${getHealthBg(customer.health_score)}`}>{customer.health_score} · {getHealthLabel(customer.health_score)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowPlaybookMenu(!showPlaybookMenu)} className="flex items-center gap-2 border border-border hover:border-border-light bg-surface px-3 py-1.5 rounded-lg text-sm transition-colors">
              <Play className="w-4 h-4" /> Run playbook
            </button>
            {showPlaybookMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-surface border border-border rounded-lg shadow-xl z-10 py-1">
                {DEMO_PLAYBOOKS.map(pb => (
                  <button key={pb.id} onClick={() => setShowPlaybookMenu(false)} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-light transition-colors">
                    <span className="font-medium">{pb.name}</span>
                    <span className="text-xs text-text-muted block">{pb.trigger_type}: {pb.trigger_value}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setOverrideAI(!overrideAI)} className="flex items-center gap-2 text-sm">
            {overrideAI ? <ToggleRight className="w-6 h-6 text-amber" /> : <ToggleLeft className="w-6 h-6 text-text-muted" />}
            <span className={overrideAI ? "text-amber" : "text-text-muted"}>Override AI</span>
          </button>
        </div>
      </div>

      {/* Health Trend Chart */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-xs font-mono text-text-muted mb-4">HEALTH SCORE TREND — 90 DAYS</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6B7280" }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip contentStyle={{ background: "#12121A", border: "1px solid #1E1E2E", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-indigo text-indigo" : "border-transparent text-text-muted hover:text-text-secondary"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Churn Risk Card */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo" /> AI Churn Risk Analysis
                <span className="text-[10px] bg-indigo/20 text-indigo px-1.5 py-0.5 rounded font-mono">AI</span>
              </h3>
              <button onClick={runChurnAnalysis} className="text-xs text-indigo hover:text-indigo-light">Re-analyze</button>
            </div>
            {analyzing ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo" /></div>
            ) : churnAnalysis ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`text-4xl font-bold font-mono ${churnAnalysis.riskLevel === "critical" ? "text-danger" : churnAnalysis.riskLevel === "high" ? "text-amber" : churnAnalysis.riskLevel === "medium" ? "text-amber" : "text-emerald"}`}>
                    {churnAnalysis.riskScore as number}
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase ${(churnAnalysis.riskLevel as string) === "critical" ? "text-danger" : (churnAnalysis.riskLevel as string) === "high" ? "text-amber" : (churnAnalysis.riskLevel as string) === "medium" ? "text-amber" : "text-emerald"}`}>
                      {churnAnalysis.riskLevel as string}
                    </span>
                    <p className="text-xs text-text-muted">Urgency: {churnAnalysis.urgency as string}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-mono text-text-muted mb-1">TOP REASONS</p>
                  <ul className="space-y-1">
                    {(churnAnalysis.topReasons as string[]).map((r, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-amber shrink-0" /> {r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-mono text-text-muted mb-1">RECOMMENDED ACTION</p>
                  <p className="text-sm text-text-secondary">{churnAnalysis.recommendedAction as string}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Health Breakdown */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-heading font-semibold text-sm mb-4">Health Score Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: "Product Usage", value: customer.usage_metrics.reduce((a, m) => a + m.usage, 0) / customer.usage_metrics.length, color: "bg-indigo" },
                { label: "Support Sentiment", value: customer.support_sentiment === "positive" || customer.support_sentiment === "very_positive" ? 85 : customer.support_sentiment === "neutral" ? 55 : customer.support_sentiment === "mixed" ? 40 : 20, color: "bg-amber" },
                { label: "Email Engagement", value: customer.email_engagement, color: "bg-emerald" },
              ].map(metric => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">{metric.label}</span>
                    <span className="text-sm font-mono font-bold">{Math.round(metric.value)}%</span>
                  </div>
                  <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                    <div className={`h-full ${metric.color} rounded-full transition-all duration-1000`} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "timeline" && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-sm mb-4">AI Action Timeline</h3>
          <div className="space-y-4">
            {customerActions.length === 0 ? (
              <p className="text-text-muted text-sm">No AI actions recorded yet.</p>
            ) : customerActions.map(a => {
              const timeAgo = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 60000);
              return (
                <div key={a.id} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.type === "email_sent" ? "bg-indigo/10 text-indigo" : a.type === "qbr_generated" ? "bg-amber/10 text-amber" : a.type === "playbook_triggered" ? "bg-emerald/10 text-emerald" : "bg-danger/10 text-danger"}`}>
                    {a.type === "email_sent" ? <Mail className="w-4 h-4" /> : a.type === "qbr_generated" ? <FileText className="w-4 h-4" /> : a.type === "playbook_triggered" ? <Zap className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.payload}</p>
                    <p className="text-xs text-text-muted mt-0.5">{a.result} · {timeAgo < 1 ? "just now" : `${timeAgo}m ago`}</p>
                  </div>
                  <span className="text-[10px] bg-indigo/20 text-indigo px-1.5 py-0.5 rounded font-mono">AI</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "emails" && (
        <div className="space-y-3">
          {customerEmails.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <Mail className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-text-muted text-sm">No emails yet for this customer.</p>
            </div>
          ) : customerEmails.map(em => (
            <div key={em.id} className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium">{em.subject}</h4>
                  <span className={`text-xs font-mono ${em.status === "pending_approval" ? "text-amber" : em.status === "sent" ? "text-emerald" : "text-text-muted"}`}>
                    {em.status}
                  </span>
                </div>
                <span className="text-[10px] bg-indigo/20 text-indigo px-1.5 py-0.5 rounded font-mono">AI</span>
              </div>
              <div className="text-sm text-text-secondary border-t border-border/50 pt-3 mt-3" dangerouslySetInnerHTML={{ __html: em.body }} />
              {em.status === "pending_approval" && (
                <div className="flex items-center gap-2 mt-4">
                  <button className="bg-emerald/10 text-emerald px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald/20 transition-colors">Approve</button>
                  <button className="bg-surface border border-border text-text-secondary px-3 py-1.5 rounded-lg text-xs font-medium hover:border-border-light transition-colors flex items-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
                  <button className="bg-danger/10 text-danger px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-danger/20 transition-colors">Reject</button>
                </div>
              )}
              {em.status === "sent" && em.opened_at && (
                <p className="text-xs text-emerald mt-3 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Opened {em.clicked_at ? "and clicked" : ""}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "qbr" && (
        <div className="space-y-4">
          {!qbrData && !generatingQBR && (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <FileText className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary text-sm mb-4">Generate an AI-powered QBR for {customer.name}</p>
              <button onClick={runGenerateQBR} className="bg-indigo hover:bg-indigo-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto transition-colors">
                <Zap className="w-4 h-4" /> Generate QBR
              </button>
            </div>
          )}
          {generatingQBR && (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo mx-auto mb-3" />
              <p className="text-text-secondary text-sm">Generating QBR with AI...</p>
            </div>
          )}
          {qbrData && (
            <>
              {/* Executive Summary */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-sm">Executive Summary</h3>
                  <span className="text-[10px] bg-indigo/20 text-indigo px-1.5 py-0.5 rounded font-mono">AI</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{qbrData.executiveSummary as string}</p>
              </div>

              {/* Key Metrics */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="font-heading font-semibold text-sm mb-4">Key Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(qbrData.keyMetrics as { label: string; value: string; trend: string }[]).map((m, i) => (
                    <div key={i} className="bg-base border border-border rounded-lg p-3">
                      <p className="text-xs text-text-muted font-mono">{m.label.toUpperCase()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold font-mono">{m.value}</span>
                        {m.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald" /> : m.trend === "down" ? <TrendingDown className="w-4 h-4 text-danger" /> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wins & Risks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald" /> Wins</h3>
                  <ul className="space-y-2">
                    {(qbrData.wins as string[]).map((w, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald mt-0.5 shrink-0" /> {w}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber" /> Risks</h3>
                  <ul className="space-y-2">
                    {(qbrData.risks as string[]).map((r, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><AlertTriangle className="w-3 h-3 text-amber mt-0.5 shrink-0" /> {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations & Next Steps */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-indigo" /> Recommendations</h3>
                  <ul className="space-y-2">
                    {(qbrData.recommendations as string[]).map((r, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><Zap className="w-3 h-3 text-indigo mt-0.5 shrink-0" /> {r}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo" /> Next Steps</h3>
                  <ul className="space-y-2">
                    {(qbrData.nextSteps as string[]).map((s, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><span className="w-5 h-5 rounded bg-indigo/10 text-indigo text-xs flex items-center justify-center shrink-0">{i + 1}</span> {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
