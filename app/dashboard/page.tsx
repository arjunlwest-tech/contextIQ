"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  TrendingUp, Shield, Zap, Check, ArrowUpRight, ArrowDownRight, 
  Users, Mail, FileText, AlertTriangle, Plus, Search, Filter,
  LayoutDashboard, PlayCircle, Settings, LogOut, ChevronRight
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  DEMO_CUSTOMERS, DEMO_AI_ACTIONS, 
  PORTFOLIO_HEALTH, MRR_AT_RISK, EXPANSION_OPPORTUNITIES,
  getHealthColor, getHealthBg, getHealthLabel, generateHealthTrend
} from "@/lib/demo-data";
import { motion, AnimatePresence } from "framer-motion";

function MetricCard({ title, value, sub, trend, type = "default" }: any) {
  const isPositive = trend === "up";
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group transition-all hover:border-indigo/50 hover:shadow-2xl hover:shadow-indigo/10"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-lg ${isPositive ? "bg-emerald/10 text-emerald" : "bg-danger/10 text-danger"}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-1 font-mono">{value}</h3>
      <p className={`text-xs ${isPositive ? "text-emerald" : "text-danger"} font-medium`}>
        {trend === "up" ? "+" : "-"}{sub} <span className="text-text-muted ml-1">vs last month</span>
      </p>
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo/10 transition-colors" />
    </motion.div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const criticalCustomers = useMemo(() => 
    DEMO_CUSTOMERS.filter(c => c.health_score < 40).sort((a, b) => a.health_score - b.health_score),
    []
  );

  const healthData = useMemo(() => generateHealthTrend(62, 30), []);

  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-1">Command Center</h1>
            <p className="text-text-secondary text-sm">Your AI agents are monitoring <span className="text-indigo font-bold">{DEMO_CUSTOMERS.length}</span> active customers.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-indigo transition-all w-64"
              />
            </div>
            <button className="bg-indigo text-white p-2 rounded-xl hover:bg-indigo-dark transition-colors shadow-lg shadow-indigo/20">
              <Plus size={20} />
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard title="Portfolio Health" value="62%" sub="4.2%" trend="up" />
          <MetricCard title="MRR at Risk" value={`$${(MRR_AT_RISK / 1000).toFixed(1)}K`} sub="12%" trend="down" />
          <MetricCard title="Expansion Pipe" value={`$${(EXPANSION_OPPORTUNITIES / 1000).toFixed(1)}K`} sub="8.5%" trend="up" />
          <MetricCard title="AI Outreach Win" value="68%" sub="2.4%" trend="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Trend Chart */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold">Aggregate Health Trend</h3>
                  <p className="text-xs text-text-muted">Prediction accuracy: 94%</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] px-2 py-1 bg-base border border-border rounded-lg font-bold">7D</button>
                  <button className="text-[10px] px-2 py-1 bg-indigo text-white rounded-lg font-bold">30D</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['auto', 100]} hide />
                    <Tooltip 
                      contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#6366F1" 
                      strokeWidth={3} 
                      dot={false}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Critical Customers */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="font-bold font-heading">High Priority Interventions</h3>
                <Link href="/dashboard/customers" className="text-xs text-indigo font-bold hover:underline flex items-center gap-1">
                  View Full List <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {criticalCustomers.map((customer) => (
                  <motion.div 
                    key={customer.id} 
                    className="p-4 flex items-center gap-4 hover:bg-base transition-colors group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center font-bold text-indigo">
                      {customer.name.substring(0, 1)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{customer.name}</p>
                      <p className="text-[10px] text-text-muted font-mono uppercase">${customer.mrr.toLocaleString()} MRR</p>
                    </div>
                    <div className="text-right px-4">
                      <div className={`text-sm font-mono font-bold ${getHealthColor(customer.health_score)}`}>
                        {customer.health_score}
                      </div>
                      <div className="text-[10px] text-text-muted leading-none">Health</div>
                    </div>
                    <div className="px-2">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${getHealthBg(customer.health_score)}`}>
                        {getHealthLabel(customer.health_score)}
                       </span>
                    </div>
                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-border rounded-lg text-indigo hover:bg-indigo hover:text-white">
                      <Zap size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Activity Side Panel */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo to-indigo-dark text-white rounded-2xl p-6 shadow-xl shadow-indigo/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white animate-pulse" />
                </div>
                <h3 className="font-bold font-heading">AI Status: Autonomous</h3>
              </div>
              <p className="text-sm text-indigo-light mb-6">Your CS agent is active. 3 rescuses in progress, 2 QBRs drafted this morning.</p>
              <button className="w-full bg-white text-indigo font-bold py-3 rounded-xl text-xs hover:bg-white/90 transition-colors shadow-lg">
                View Detailed Logs
              </button>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Recent AI Actions</h3>
                <div className="w-2 h-2 rounded-full bg-emerald animate-ping" />
              </div>
              <div className="space-y-6">
                {(DEMO_AI_ACTIONS || []).slice(0, 5).map((action, i) => (
                  <div key={action.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1 before:h-full before:bg-border last:before:hidden">
                    <div className="absolute left-[-4px] top-1.5 w-3 h-3 rounded-full bg-indigo shadow-sm ring-4 ring-surface" />
                    <p className="text-[10px] text-text-muted font-mono mb-1">{action.created_at.split('T')[1].substring(0, 5)}</p>
                    <p className="text-sm font-medium leading-tight mb-1">{action.payload}</p>
                    <p className="text-[10px] text-emerald font-bold uppercase tracking-wider">{action.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
