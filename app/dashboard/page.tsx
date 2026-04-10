"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, TrendingUp, DollarSign, Activity, Zap, ArrowRight, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DEMO_CUSTOMERS, DEMO_AI_ACTIONS, getHealthBg, getHealthLabel, PORTFOLIO_HEALTH, MRR_AT_RISK, EXPANSION_OPPORTUNITIES, REVENUE_SAVED_MONTH } from "@/lib/demo-data";

function AnimatedNumber({ target, prefix = "", suffix = "", duration = 1500 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span className="font-mono">{prefix}{val.toLocaleString()}{suffix}</span>;
}

function SkeletonCard() {
  return <div className="bg-surface border border-border rounded-xl p-5"><div className="skeleton h-4 w-20 rounded mb-3" /><div className="skeleton h-8 w-32 rounded" /></div>;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState(DEMO_AI_ACTIONS);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["email_sent", "playbook_triggered", "qbr_generated", "alert_created"] as const;
      const statuses = ["completed", "pending"] as const;
      const cust = DEMO_CUSTOMERS[Math.floor(Math.random() * DEMO_CUSTOMERS.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const newAction = {
        id: `ai_${Date.now()}`,
        customer_id: cust.id,
        type,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        payload: type === "email_sent" ? `Outreach to ${cust.name}` : type === "qbr_generated" ? `QBR for ${cust.name}` : type === "playbook_triggered" ? `Playbook for ${cust.name}` : `Alert for ${cust.name}`,
        result: type === "email_sent" ? "Email delivered" : type === "qbr_generated" ? "QBR generated" : type === "playbook_triggered" ? "Playbook running" : "Flagged for review",
        created_at: new Date().toISOString(),
      };
      setActions(prev => [newAction, ...prev.slice(0, 19)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard /> <SkeletonCard />
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "Healthy", value: DEMO_CUSTOMERS.filter(c => c.health_score >= 70).length, color: "#10B981" },
    { name: "At Risk", value: DEMO_CUSTOMERS.filter(c => c.health_score >= 40 && c.health_score < 70).length, color: "#F59E0B" },
    { name: "Critical", value: DEMO_CUSTOMERS.filter(c => c.health_score < 40).length, color: "#EF4444" },
  ];

  const criticalCustomers = DEMO_CUSTOMERS.filter(c => c.health_score < 40);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-text-muted">PORTFOLIO HEALTH</span>
            <Activity className="w-4 h-4 text-indigo" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold font-mono text-emerald"><AnimatedNumber target={PORTFOLIO_HEALTH} /></div>
            <div className="w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={18} outerRadius={28} dataKey="value" strokeWidth={0}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs">
            {pieData.map(d => (
              <span key={d.name} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}: {d.value}</span>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-text-muted">MRR AT RISK</span>
            <AlertTriangle className="w-4 h-4 text-amber" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber"><AnimatedNumber target={MRR_AT_RISK} prefix="$" /></div>
          <p className="text-xs text-danger mt-2">{criticalCustomers.length} customers in critical zone</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-text-muted">EXPANSION OPPS</span>
            <TrendingUp className="w-4 h-4 text-emerald" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald"><AnimatedNumber target={EXPANSION_OPPORTUNITIES} prefix="$" /></div>
          <p className="text-xs text-emerald mt-2">2 upsell opportunities detected</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-text-muted">REVENUE SAVED</span>
            <DollarSign className="w-4 h-4 text-emerald" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald"><AnimatedNumber target={REVENUE_SAVED_MONTH} prefix="$" /></div>
          <p className="text-xs text-text-muted mt-2">This month by AI actions</p>
        </div>
      </div>

      {/* Churn Alerts + Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Churn Alerts */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm">Churn Alerts</h3>
            <span className="text-xs font-mono text-danger">{criticalCustomers.length} active</span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
            {criticalCustomers.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-danger/5 border border-danger/10">
                <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0 ${getHealthBg(c.health_score)}`}>
                  {c.health_score}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/customers/${c.id}`} className="text-sm font-medium hover:text-indigo transition-colors">{c.name}</Link>
                  <p className="text-xs text-text-muted mt-0.5">
                    {c.usage_metrics[0].usage}% usage · {c.days_since_last_login}d since login · AI drafting outreach now
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-indigo" />
                    <span className="text-xs text-indigo">Churn rescue playbook active</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted shrink-0 mt-1" />
              </div>
            ))}
            {DEMO_CUSTOMERS.filter(c => c.health_score >= 40 && c.health_score < 70).slice(0, 2).map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-amber/5 border border-amber/10">
                <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0 ${getHealthBg(c.health_score)}`}>
                  {c.health_score}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/customers/${c.id}`} className="text-sm font-medium hover:text-indigo transition-colors">{c.name}</Link>
                  <p className="text-xs text-text-muted mt-0.5">Health declining · Monitoring closely</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Activity */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm">Agent Activity</h3>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald animate-pulse-dot" /><span className="text-xs font-mono text-emerald">Live</span></div>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
            {actions.map(a => {
              const cust = DEMO_CUSTOMERS.find(c => c.id === a.customer_id);
              const timeAgo = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 60000);
              const typeIcon = a.type === "email_sent" ? "📧" : a.type === "qbr_generated" ? "📊" : a.type === "playbook_triggered" ? "⚡" : "🔔";
              return (
                <div key={a.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-surface-light transition-colors animate-slide-up">
                  <span className="text-sm">{typeIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {a.payload} — <span className="text-text-muted">{a.result}</span>
                    </p>
                  </div>
                  <span className="text-xs text-text-muted font-mono shrink-0">{timeAgo < 1 ? "now" : `${timeAgo}m`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer List Quick View */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm">All Customers</h3>
          <Link href="/dashboard/customers" className="text-xs text-indigo hover:text-indigo-light">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_CUSTOMERS.map(c => (
            <Link key={c.id} href={`/dashboard/customers/${c.id}`} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-border-light bg-base transition-colors">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${getHealthBg(c.health_score)}`}>
                {c.health_score}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-text-muted">${c.mrr.toLocaleString()}/mo · {getHealthLabel(c.health_score)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
