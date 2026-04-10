"use client";
import { useState } from "react";
import { Zap, Play, Edit, Plus, ChevronRight, X, ArrowRight } from "lucide-react";
import { DEMO_PLAYBOOKS } from "@/lib/demo-data";

function FlowBuilder({ playbook, onClose }: { playbook: typeof DEMO_PLAYBOOKS[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 bg-base/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-heading font-semibold">{playbook.name} — Flow Builder</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Trigger Node */}
            <div className="bg-indigo/10 border border-indigo/30 rounded-lg px-4 py-3 text-center">
              <p className="text-xs font-mono text-indigo mb-1">TRIGGER</p>
              <p className="text-sm font-medium">{playbook.trigger_type}: {playbook.trigger_value}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
            {/* Condition */}
            <div className="bg-amber/10 border border-amber/30 rounded-lg px-4 py-3 text-center">
              <p className="text-xs font-mono text-amber mb-1">CONDITION</p>
              <p className="text-sm font-medium">Evaluate customer signals</p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
            {/* Actions */}
            {playbook.actions_json.map((action, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-emerald/10 border border-emerald/30 rounded-lg px-4 py-3 text-center">
                  <p className="text-xs font-mono text-emerald mb-1">ACTION {action.step}</p>
                  <p className="text-sm font-medium">{action.action}</p>
                </div>
                {i < playbook.actions_json.length - 1 && <ChevronRight className="w-5 h-5 text-text-muted" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlaybooksPage() {
  const [editingPb, setEditingPb] = useState<typeof DEMO_PLAYBOOKS[0] | null>(null);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">Playbooks</h1>
        <button className="flex items-center gap-2 bg-indigo hover:bg-indigo-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Create playbook
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_PLAYBOOKS.map(pb => (
          <div key={pb.id} className={`bg-surface border rounded-xl p-5 ${pb.active ? "border-border" : "border-border opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-indigo" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm">{pb.name}</h3>
                  <p className="text-xs text-text-muted font-mono">{pb.trigger_type}: {pb.trigger_value}</p>
                </div>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${pb.active ? "bg-emerald/10 text-emerald" : "bg-surface-light text-text-muted"}`}>
                {pb.active ? "Active" : "Paused"}
              </span>
            </div>

            <div className="space-y-1.5 mb-4">
              {pb.actions_json.map(a => (
                <div key={a.step} className="flex items-center gap-2 text-xs text-text-secondary">
                  <ArrowRight className="w-3 h-3 text-text-muted" /> {a.action}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>{pb.customers_in_playbook} customers</span>
                <span className="text-emerald">{pb.success_rate}% success</span>
              </div>
              <button onClick={() => setEditingPb(pb)} className="flex items-center gap-1 text-xs text-indigo hover:text-indigo-light transition-colors">
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingPb && <FlowBuilder playbook={editingPb} onClose={() => setEditingPb(null)} />}
    </div>
  );
}
