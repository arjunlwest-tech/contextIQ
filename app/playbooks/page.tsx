"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PlayCircle, Plus, Search, Filter, Check, MoreVertical,
  Zap, LayoutDashboard, Users, Mail, FileText, Settings, ArrowRight, Activity, Cpu
} from "lucide-react";
import { DEMO_PLAYBOOKS } from "@/lib/demo-data";
import DashboardSidebar from "@/components/DashboardSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function PlaybooksPage() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<any>(DEMO_PLAYBOOKS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const simulateTrigger = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const res = await fetch("/api/ai/recommend-playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Acme Corp",
          healthScore: 35,
          previousHealthScore: 60,
          recentEvents: ["Login frequency dropped 80%", "Support ticket ignored"]
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSimulationResult({
          text: `AI Recommended: ${data.playbookName}`,
          desc: data.explanation
        });
        // Select the matching playbook if it exists
        const match = DEMO_PLAYBOOKS.find(p => p.name.toLowerCase().includes(data.playbookName?.toLowerCase()));
        if(match) setSelectedPlaybook(match);
      } else {
        alert("Security filter blocked request: " + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-1 text-glow">Automation Playbooks</h1>
            <p className="text-text-secondary text-sm">Design and monitor autonomous AI workflows for every customer lifecycle stage.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={simulateTrigger} disabled={isSimulating}
              className="bg-base border border-indigo/20 text-indigo px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo/10 transition-all"
            >
              <Cpu size={18} className={isSimulating ? "animate-spin" : ""} /> {isSimulating ? "Analyzing..." : "Simulate Signal"}
            </button>
            <button className="bg-indigo text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-dark transition-all shadow-lg shadow-indigo/20">
              <Plus size={18} /> New Playbook
            </button>
          </div>
        </header>

        {simulationResult && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-indigo/10 border border-indigo/20 rounded-xl">
             <h4 className="font-bold text-indigo">{simulationResult.text}</h4>
             <p className="text-sm text-text-muted">{simulationResult.desc}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Playbook List */}
          <div className="lg:col-span-1 space-y-4">
            {DEMO_PLAYBOOKS.map((pb: any) => (
              <motion.div 
                key={pb.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPlaybook(pb)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedPlaybook.id === pb.id ? "bg-surface border-indigo shadow-lg" : "bg-surface/50 border-border opacity-70"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${pb.active ? "bg-emerald/10 text-emerald" : "bg-text-muted/10 text-text-muted"}`}>
                    <PlayCircle size={18} />
                  </div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{pb.active ? "Active" : "Paused"}</div>
                </div>
                <h3 className="font-bold mb-1 text-sm">{pb.name}</h3>
                <p className="text-[10px] text-text-muted font-mono mb-4">IF: {pb.trigger_type} {pb.trigger_value}</p>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-indigo">{pb.customers_in_playbook} Active</span>
                  <span className="text-emerald">{pb.success_rate}% Success</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Detailed Flow Editor Preview */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedPlaybook.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface border border-border rounded-3xl p-8 shadow-xl"
              >
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 italic tracking-tight uppercase font-heading">{selectedPlaybook.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-indigo/10 text-indigo rounded-lg text-[10px] font-bold border border-indigo/20">
                         TRIGGER: {selectedPlaybook.trigger_type.toUpperCase()}
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-1 font-mono">
                        <Activity size={12} /> {selectedPlaybook.success_rate}% recovery rate
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-base transition-colors">Duplicate</button>
                     <button className="px-4 py-2 bg-indigo text-white rounded-xl text-xs font-bold hover:bg-indigo-dark transition-all">Edit Logic</button>
                  </div>
                </div>

                {/* Vertical Step Flow */}
                <div className="space-y-4 relative">
                   <div className="absolute left-[27px] top-8 w-0.5 h-[calc(100%-60px)] bg-border border-dashed border-l-2" />
                   
                   {selectedPlaybook.actions_json.map((step: any, i: number) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="flex items-start gap-6 relative z-10"
                     >
                       <div className="w-14 h-14 rounded-2xl bg-base border border-border flex items-center justify-center font-black text-indigo shadow-sm shrink-0">
                         {i + 1}
                       </div>
                       <div className="flex-1 bg-base/50 border border-border rounded-2xl p-5 group hover:border-indigo/50 transition-all">
                          <div className="flex justify-between items-center">
                             <p className="text-sm font-bold mb-1">{step.action}</p>
                             <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                          </div>
                          <p className="text-[10px] text-text-muted">Autonomous execution enabled • NLP validation required</p>
                       </div>
                     </motion.div>
                   ))}

                   {/* Add Step Placeholder */}
                   <div className="flex items-start gap-6 opacity-40 hover:opacity-100 transition-opacity cursor-pointer ml-1">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center ml-1">
                        <Plus size={20} className="text-text-muted" />
                      </div>
                      <div className="flex-1 py-4">
                         <p className="text-xs font-bold text-text-muted italic">Add autonomous step...</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
