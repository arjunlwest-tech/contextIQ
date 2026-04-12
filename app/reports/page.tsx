"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, Search, Sparkles, Download, Share2, 
  TrendingUp, AlertTriangle, CheckCircle2, ChevronRight,
  Zap, LayoutDashboard, Users, Mail, PlayCircle, Settings
} from "lucide-react";
import { DEMO_CUSTOMERS } from "@/lib/demo-data";
import DashboardSidebar from "@/components/DashboardSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function QBRPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportData, setReportData] = useState<any>(null);

  const startGeneration = async (customer: any) => {
    setSelectedCustomer(customer);
    setIsGenerating(true);
    setProgress(0);
    setReportData(null);

    // Simulate progress visually while fetching
    const interval = setInterval(() => {
      setProgress(p => (p < 95 ? p + 5 : p));
    }, 100);

    try {
      const res = await fetch("/api/ai/generate-qbr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name,
          company: customer.name,
          mrr: customer.mrr || 5000,
          healthScore: customer.health_score || 80,
          metrics90d: [{ date: "Q1", score: 85 }],
          usageSummary: "Consistent daily usage.",
          supportSummary: "Minimal tickets.",
          winsSummary: "Successful onboarding.",
          risksSummary: "None detected."
        })
      });

      const data = await res.json();
      
      clearInterval(interval);
      setProgress(100);
      
      if (res.ok) {
        setReportData({
          winTitle: "Key Success",
          winDesc: data.wins?.[0] || "Successfully integrated modules.",
          riskTitle: "Potential Risk",
          riskDesc: data.risks?.[0] || "No immediate risks detected.",
          recommendation: data.recommendations?.[0] || "Maintain current relationship cadence.",
          revenue: data.keyMetrics?.find(m => m.label === "MRR")?.value || "+$0"
        });
      } else {
        alert("Security filter blocked request: " + data.error);
      }
    } catch (err) {
      console.error(err);
      clearInterval(interval);
    } finally {
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-1 text-glow">AI QBR Generator</h1>
            <p className="text-text-secondary text-sm">Autonomous generation ofQuarterly Business Reviews from deep performance data.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Customer Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Users size={18} className="text-indigo" /> Select Customer
              </h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter companies..." 
                  className="w-full pl-9 pr-4 py-2 bg-base border border-border rounded-xl text-xs focus:outline-none focus:border-indigo"
                />
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {DEMO_CUSTOMERS.map((cust: any) => (
                  <button 
                    key={cust.id}
                    onClick={() => startGeneration(cust)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedCustomer?.id === cust.id ? "border-indigo bg-indigo/5" : "border-border hover:border-text-muted"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">{cust.name}</span>
                      <ChevronRight size={14} className="text-text-muted" />
                    </div>
                    <div className="text-[10px] text-text-muted font-mono uppercase">Health: {cust.health_score}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Generator / Report View */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!selectedCustomer ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center bg-surface/50 border border-border border-dashed rounded-3xl p-12 text-center"
                >
                  <div className="w-20 h-20 bg-indigo/10 rounded-3xl flex items-center justify-center mb-6">
                    <FileText size={40} className="text-indigo opacity-40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Report Selected</h3>
                  <p className="text-text-secondary text-sm max-w-sm">Select a customer from the left to generate an AI-powered state-of-the-business report.</p>
                </motion.div>
              ) : isGenerating ? (
                <motion.div 
                  key="generating"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center bg-surface border border-border rounded-3xl p-12 text-center relative overflow-hidden"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-indigo/5 to-transparent"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative z-10 w-full max-w-sm">
                    <Sparkles size={32} className="text-indigo mx-auto mb-6 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2">Synthesizing {selectedCustomer.name}</h3>
                    <p className="text-text-muted text-xs mb-8 uppercase tracking-widest font-mono">Analyzed 1.2M usage records • 4 channels</p>
                    
                    <div className="w-full h-2 bg-base rounded-full overflow-hidden mb-4">
                      <motion.div 
                        className="h-full bg-indigo" 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-secondary font-medium italic">
                      {progress < 30 ? "Mapping integration telemetry..." : 
                       progress < 60 ? "Drafting executive summary..." : 
                       progress < 90 ? "Identifying expansion triggers..." : "Finalizing document..."}
                    </p>
                  </div>
                </motion.div>
              ) : reportData ? (
                <motion.div 
                  key="report"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="bg-indigo p-8 text-white flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 opacity-80">EXECUTIVE SUMMARY • Q1 2026</div>
                      <h2 className="text-4xl font-black font-heading tracking-tighter italic">{selectedCustomer.name}</h2>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Share2 size={16} /></button>
                       <button className="bg-white text-indigo px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/90 transition-all">
                        <Download size={14} /> Download PDF
                       </button>
                    </div>
                  </div>

                  <div className="p-10 space-y-10">
                    <section className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 text-emerald">
                           <CheckCircle2 size={18} />
                           <h4 className="font-bold text-sm uppercase">Key Win</h4>
                         </div>
                         <h5 className="text-xl font-bold">{reportData.winTitle}</h5>
                         <p className="text-sm text-text-secondary leading-relaxed">{reportData.winDesc}</p>
                       </div>
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 text-danger">
                           <AlertTriangle size={18} />
                           <h4 className="font-bold text-sm uppercase">Critical Risk</h4>
                         </div>
                         <h5 className="text-xl font-bold">{reportData.riskTitle}</h5>
                         <p className="text-sm text-text-secondary leading-relaxed">{reportData.riskDesc}</p>
                       </div>
                    </section>

                    <hr className="border-border" />

                    <section>
                       <div className="flex items-center gap-2 text-indigo mb-4">
                         <TrendingUp size={18} />
                         <h4 className="font-bold text-sm uppercase">Growth Strategy</h4>
                       </div>
                       <div className="bg-base border border-border rounded-2xl p-6">
                         <p className="text-sm font-medium mb-4 italic">&ldquo;Our AI recommends moving {selectedCustomer.name} to the Enterprise tier based on forecasted API volume.&rdquo;</p>
                         <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="text-emerald">EST. REVENUE: +$8,400</span>
                            <span className="text-indigo">PROBABILITY: 78%</span>
                         </div>
                       </div>
                    </section>

                    <section className="bg-surface-light p-6 rounded-2xl border border-indigo/20">
                      <h4 className="font-bold text-sm mb-2">Next Steps</h4>
                      <p className="text-sm text-text-secondary">{reportData.recommendation}</p>
                    </section>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
