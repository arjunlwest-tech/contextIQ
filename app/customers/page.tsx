"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { DEMO_CUSTOMERS } from "@/lib/demo-data";
import { motion } from "framer-motion";
import { Search, Building, MoreVertical, Plus, DollarSign, Activity } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-1 text-glow">Customer Portfolio</h1>
            <p className="text-text-secondary text-sm">Manage, analyze, and segment your entire customer base.</p>
          </div>
          <button className="bg-indigo text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-dark transition-all shadow-lg shadow-indigo/20">
            <Plus size={18} /> New Customer
          </button>
        </header>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-border flex justify-between items-center bg-base/50">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="w-full pl-9 pr-4 py-2 bg-base border border-border rounded-xl text-xs focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
            <div className="text-xs font-bold font-mono text-text-muted uppercase tracking-widest">
              {DEMO_CUSTOMERS.length} Total Customers
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-base/20 border-b border-border text-[10px] text-text-muted uppercase tracking-widest font-bold">
                <th className="p-4 font-mono">Company</th>
                <th className="p-4 font-mono">Health Score</th>
                <th className="p-4 font-mono">MRR</th>
                <th className="p-4 font-mono">Status</th>
                <th className="p-4 font-mono">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CUSTOMERS.map((cust: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={cust.id} 
                  className="border-b border-border hover:bg-base/30 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center font-bold">
                        {cust.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{cust.name}</div>
                        <div className="text-xs text-text-muted flex items-center gap-1"><Building size={10} /> Enterprise Tier</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full max-w-[100px] h-2 bg-base rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cust.health_score > 70 ? 'bg-emerald' : cust.health_score > 40 ? 'bg-amber' : 'bg-danger'}`} 
                          style={{ width: `${cust.health_score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold font-mono">{cust.health_score}/100</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold text-sm">
                      <DollarSign size={14} className="text-text-muted" />
                      {cust.mrr.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald/10 text-emerald border border-emerald/20 text-[10px] uppercase font-bold rounded tracking-tighter">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-text-muted hover:text-text-primary cursor-pointer w-10">
                    <MoreVertical size={16} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
