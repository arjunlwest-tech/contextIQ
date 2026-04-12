"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Mail, PlayCircle, 
  FileText, Settings, Zap, ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { id: "customers", icon: Users, label: "Customers", href: "/dashboard" },
  { id: "outreach", icon: Mail, label: "Autonomous Outreach", href: "/outreach" },
  { id: "playbooks", icon: PlayCircle, label: "Playbooks", href: "/playbooks" },
  { id: "reports", icon: FileText, label: "AI QBRs", href: "/reports" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border flex flex-col fixed h-full bg-surface/50 backdrop-blur-xl z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo to-indigo-dark flex items-center justify-center shadow-lg shadow-indigo/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">repulsora</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-indigo text-white shadow-lg shadow-indigo/20" 
                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-white" : "group-hover:text-indigo transition-colors"} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.id === "outreach" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-danger animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-base rounded-xl p-4 mb-4">
          <p className="text-[10px] text-text-muted uppercase mb-2">Workspace Health</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-surface-light rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "62%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-emerald" 
              />
            </div>
            <span className="text-xs font-mono font-bold">62%</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-text-muted hover:text-text-primary transition-colors text-sm">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}
