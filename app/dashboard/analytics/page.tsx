"use client";
import { useState } from "react";
import { BarChart3, TrendingUp, Clock, DollarSign, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const churnTrend = [
  { month: "Jan", rate: 5.2 }, { month: "Feb", rate: 4.8 }, { month: "Mar", rate: 4.5 },
  { month: "Apr", rate: 4.1 }, { month: "May", rate: 3.8 }, { month: "Jun", rate: 3.5 },
  { month: "Jul", rate: 3.2 }, { month: "Aug", rate: 2.9 }, { month: "Sep", rate: 2.7 },
  { month: "Oct", rate: 2.4 }, { month: "Nov", rate: 2.2 }, { month: "Dec", rate: 2.0 },
];

const revenueSaved = [
  { month: "Jan", amount: 28000 }, { month: "Feb", amount: 45000 }, { month: "Mar", amount: 62000 },
  { month: "Apr", amount: 78000 }, { month: "May", amount: 95000 }, { month: "Jun", amount: 120000 },
  { month: "Jul", amount: 145000 }, { month: "Aug", amount: 180000 }, { month: "Sep", amount: 210000 },
  { month: "Oct", amount: 255000 }, { month: "Nov", amount: 298000 }, { month: "Dec", amount: 342000 },
];

const actionVolume = [
  { month: "Jan", emails: 45, playbooks: 12, qbrs: 3 },
  { month: "Feb", emails: 62, playbooks: 18, qbrs: 5 },
  { month: "Mar", emails: 78, playbooks: 22, qbrs: 7 },
  { month: "Apr", emails: 95, playbooks: 28, qbrs: 9 },
  { month: "May", emails: 110, playbooks: 35, qbrs: 11 },
  { month: "Jun", emails: 128, playbooks: 40, qbrs: 14 },
  { month: "Jul", emails: 145, playbooks: 48, qbrs: 16 },
  { month: "Aug", emails: 162, playbooks: 55, qbrs: 18 },
  { month: "Sep", emails: 178, playbooks: 62, qbrs: 21 },
  { month: "Oct", emails: 195, playbooks: 70, qbrs: 24 },
  { month: "Nov", emails: 210, playbooks: 78, qbrs: 27 },
  { month: "Dec", emails: 228, playbooks: 85, qbrs: 30 },
];

const tooltipStyle = { background: "#12121A", border: "1px solid #1E1E2E", borderRadius: 8, fontSize: 12 };

export default function AnalyticsPage() {
  const csmCount = 4;
  const csmCost = csmCount * 95000;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="font-heading text-xl font-bold">Analytics</h1>

      {/* Churn Rate Trend */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald" /> Churn Rate Trend</h3>
          <span className="text-xs font-mono text-emerald">-61% YTD</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={churnTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Saved */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-indigo" /> Revenue Saved by AI Actions</h3>
          <span className="text-xs font-mono text-indigo">$342K this month</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSaved}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v: number) => `$${v / 1000}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Saved"]} />
              <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Action Volume */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-amber" /> Agent Action Volume</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={actionVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="emails" stackId="1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
              <Area type="monotone" dataKey="playbooks" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="qbrs" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo" /> Emails</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald" /> Playbooks</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber" /> QBRs</span>
        </div>
      </div>

      {/* Time to Intervention + ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-indigo" /> Time to Intervention</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-base border border-border rounded-lg p-4 text-center">
              <p className="text-xs font-mono text-text-muted mb-1">AI RESPONSE</p>
              <p className="text-3xl font-bold font-mono text-emerald">12m</p>
              <p className="text-xs text-text-muted mt-1">Average</p>
            </div>
            <div className="bg-base border border-border rounded-lg p-4 text-center">
              <p className="text-xs font-mono text-text-muted mb-1">HUMAN RESPONSE</p>
              <p className="text-3xl font-bold font-mono text-danger">4.2h</p>
              <p className="text-xs text-text-muted mt-1">Average</p>
            </div>
          </div>
          <p className="text-xs text-emerald mt-3 text-center">AI is 21x faster than human intervention</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2 mb-4"><DollarSign className="w-4 h-4 text-emerald" /> ROI Calculator</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Without ContextIQ, you&apos;d need</span>
              <span className="font-bold font-mono">{csmCount} CSMs</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">At average cost of</span>
              <span className="font-bold font-mono">${csmCost.toLocaleString()}/yr</span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between text-sm">
              <span className="text-text-secondary">ContextIQ saves you</span>
              <span className="font-bold font-mono text-emerald">${(csmCost - 60000).toLocaleString()}/yr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
