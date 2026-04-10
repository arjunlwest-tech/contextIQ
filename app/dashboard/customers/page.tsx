"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { DEMO_CUSTOMERS, getHealthBg, getHealthLabel } from "@/lib/demo-data";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "critical" | "at-risk" | "healthy">("all");

  const filtered = DEMO_CUSTOMERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ||
      (filter === "critical" && c.health_score < 40) ||
      (filter === "at-risk" && c.health_score >= 40 && c.health_score < 70) ||
      (filter === "healthy" && c.health_score >= 70);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">Customers</h1>
        <span className="text-xs font-mono text-text-muted">{filtered.length} customers</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:border-indigo" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          {(["all", "critical", "at-risk", "healthy"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-indigo/10 text-indigo" : "text-text-muted hover:text-text-secondary"}`}>
              {f === "all" ? "All" : f === "at-risk" ? "At Risk" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-mono text-text-muted px-4 py-3">CUSTOMER</th>
              <th className="text-left text-xs font-mono text-text-muted px-4 py-3">HEALTH</th>
              <th className="text-left text-xs font-mono text-text-muted px-4 py-3 hidden md:table-cell">MRR</th>
              <th className="text-left text-xs font-mono text-text-muted px-4 py-3 hidden lg:table-cell">CONTRACT END</th>
              <th className="text-left text-xs font-mono text-text-muted px-4 py-3 hidden lg:table-cell">LAST LOGIN</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-surface-light transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/customers/${c.id}`} className="text-sm font-medium hover:text-indigo transition-colors">{c.name}</Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${getHealthBg(c.health_score)}`}>
                    {c.health_score} · {getHealthLabel(c.health_score)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">${c.mrr.toLocaleString()}/mo</td>
                <td className="px-4 py-3 text-sm text-text-secondary font-mono hidden lg:table-cell">{c.contract_end}</td>
                <td className="px-4 py-3 text-sm text-text-secondary hidden lg:table-cell">{c.days_since_last_login === 0 ? "Today" : `${c.days_since_last_login}d ago`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
