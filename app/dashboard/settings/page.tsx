"use client";
import { useState, useEffect } from "react";
import { Building2, Plug, Bot, CreditCard, Users, Plus, RefreshCw, Loader2 } from "lucide-react";
import { getIntegrations } from "@/app/actions/data";

type SettingsTab = "company" | "integrations" | "ai" | "billing" | "team";

const integrationGroups = [
  { category: "Data Source", items: [
    { type: "segment", name: "Segment", logo: "📊" },
    { type: "mixpanel", name: "Mixpanel", logo: "📈" },
    { type: "amplitude", name: "Amplitude", logo: "📉" },
  ]},
  { category: "CRM", items: [
    { type: "hubspot", name: "HubSpot", logo: "🟠" },
    { type: "salesforce", name: "Salesforce", logo: "☁️" },
  ]},
  { category: "Support", items: [
    { type: "intercom", name: "Intercom", logo: "💬" },
    { type: "zendesk", name: "Zendesk", logo: "🎯" },
  ]},
  { category: "Email", items: [
    { type: "gmail", name: "Gmail", logo: "📧" },
    { type: "outlook", name: "Outlook", logo: "📬" },
  ]},
];

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("company");
  const [tone, setTone] = useState<"formal" | "friendly" | "technical">("friendly");
  const [autoSend, setAutoSend] = useState(false);
  const [escalationThreshold, setEscalationThreshold] = useState(40);
  const [teamMembers, setTeamMembers] = useState([
    { email: "john@company.com", role: "Admin" },
    { email: "sarah@company.com", role: "Viewer" },
  ]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntegrations = async () => {
      const result = await getIntegrations();
      if (result.data) {
        setIntegrations(result.data);
      }
      setLoading(false);
    };
    fetchIntegrations();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo" />
      </div>
    );
  }

  const tabs: { id: SettingsTab; label: string; icon: typeof Building2 }[] = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "ai", label: "AI Behavior", icon: Bot },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "team", label: "Team", icon: Users },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="font-heading text-xl font-bold">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-48 shrink-0">
          <div className="flex lg:flex-col gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${tab === t.id ? "bg-indigo/10 text-indigo" : "text-text-muted hover:text-text-secondary hover:bg-surface-light"}`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === "company" && (
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-heading font-semibold">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1.5">COMPANY NAME</label>
                  <input defaultValue="Acme Technologies" className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1.5">INDUSTRY</label>
                  <input defaultValue="B2B SaaS" className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1.5">WEBSITE</label>
                  <input defaultValue="https://acmetech.com" className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1.5">EMPLOYEE COUNT</label>
                  <input defaultValue="150" type="number" className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo" />
                </div>
              </div>
              <button className="bg-indigo hover:bg-indigo-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save changes</button>
            </div>
          )}

          {tab === "integrations" && (
            <div className="space-y-6">
              {integrationGroups.map(group => (
                <div key={group.category} className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-heading font-semibold text-sm mb-4">{group.category}</h3>
                  <div className="space-y-3">
                    {group.items.map(item => {
                      const connected = integrations.find(i => i.type === item.type);
                      return (
                        <div key={item.type} className="flex items-center justify-between p-3 bg-base rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{item.logo}</span>
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              {connected && <p className="text-xs text-text-muted">Connected {new Date(connected.connected_at).toLocaleDateString()}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {connected ? (
                              <>
                                <span className="text-xs text-emerald font-mono">Connected</span>
                                <button className="text-xs text-text-muted hover:text-text-secondary flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Reconnect</button>
                              </>
                            ) : (
                              <button className="bg-indigo/10 text-indigo px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo/20 transition-colors">Connect</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "ai" && (
            <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
              <h3 className="font-heading font-semibold">AI Behavior Settings</h3>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-2">TONE OF VOICE</label>
                <div className="flex items-center gap-2">
                  {(["formal", "friendly", "technical"] as const).map(t => (
                    <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tone === t ? "bg-indigo text-white" : "bg-base border border-border text-text-secondary hover:border-border-light"}`}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-send emails</p>
                  <p className="text-xs text-text-muted">Send AI-drafted emails without approval</p>
                </div>
                <button onClick={() => setAutoSend(!autoSend)} className="flex items-center">
                  {autoSend ? <div className="w-9 h-5 bg-indigo rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div> : <div className="w-9 h-5 bg-surface-light rounded-full relative"><div className="absolute left-0.5 top-0.5 w-4 h-4 bg-text-muted rounded-full" /></div>}
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-2">ESCALATION THRESHOLD</label>
                <div className="flex items-center gap-3">
                  <input type="number" value={escalationThreshold} onChange={e => setEscalationThreshold(Number(e.target.value))} min={0} max={100} className="w-20 bg-base border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo" />
                  <span className="text-sm text-text-secondary">Health score below this triggers escalation</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2">BLACKOUT START</label>
                  <input type="time" defaultValue="22:00" className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2">BLACKOUT END</label>
                  <input type="time" defaultValue="07:00" className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo" />
                </div>
              </div>

              <button className="bg-indigo hover:bg-indigo-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save settings</button>
            </div>
          )}

          {tab === "billing" && (
            <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
              <h3 className="font-heading font-semibold">Billing</h3>
              <div className="flex items-center justify-between p-4 bg-base border border-border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Growth Plan</p>
                  <p className="text-xs text-text-muted">$5,000/mo · Up to 250 customers</p>
                </div>
                <span className="text-xs font-mono bg-emerald/10 text-emerald px-2 py-0.5 rounded">Active</span>
              </div>
              <div>
                <p className="text-xs font-mono text-text-muted mb-2">USAGE THIS MONTH</p>
                <div className="h-3 bg-surface-light rounded-full overflow-hidden">
                  <div className="h-full bg-indigo rounded-full" style={{ width: "42%" }} />
                </div>
                <p className="text-xs text-text-muted mt-1">105 / 250 customers</p>
              </div>
              <a href="#" className="inline-block bg-indigo hover:bg-indigo-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Manage billing →</a>
            </div>
          )}

          {tab === "team" && (
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold">Team Members</h3>
                <button className="flex items-center gap-1 bg-indigo hover:bg-indigo-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                  <Plus className="w-3 h-3" /> Invite
                </button>
              </div>
              <div className="space-y-2">
                {teamMembers.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-base border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo/20 flex items-center justify-center text-indigo text-xs font-bold">
                        {m.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm">{m.email}</p>
                        <p className="text-xs text-text-muted">{m.role}</p>
                      </div>
                    </div>
                    <select defaultValue={m.role} className="bg-surface border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-indigo">
                      <option>Admin</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
