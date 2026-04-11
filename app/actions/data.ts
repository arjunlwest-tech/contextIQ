"use server";

// Local data storage - no Supabase needed
// This file uses a mock data approach for the MVP

// Mock data store (in-memory for server actions)
let mockCustomers = [
  {
    id: "cust_1",
    name: "Sarah Chen",
    email: "sarah@acme.com",
    company: "Acme Corp",
    mrr: 2500,
    health_score: 92,
    risk_level: "low",
    last_activity: "2 hours ago",
    created_at: "2023-01-15T00:00:00Z",
    plan: "Enterprise",
    status: "active",
    arr: 30000,
    nrr: 35000,
    users: 45,
    last_login: "2 hours ago",
    usage_metrics: [
      { metric: "API Calls", current: 125000, previous: 98000, change: 27.5 },
      { metric: "Active Users", current: 42, previous: 38, change: 10.5 },
      { metric: "Data Storage", current: 850, previous: 620, change: 37.1 },
    ],
    emails: [
      { id: "em1", subject: "QBR Summary - Q4 2024", sent_at: "2024-01-10T10:00:00Z", opened_at: "2024-01-10T10:15:00Z", status: "opened" },
      { id: "em2", subject: "New Features Announcement", sent_at: "2024-01-08T14:00:00Z", clicked_at: "2024-01-08T14:30:00Z", status: "clicked" },
    ],
    actions: [
      { id: "act1", type: "expansion", description: "Upsold to Enterprise plan", impact: "+$1,200 MRR", created_at: "2024-01-05T00:00:00Z" },
      { id: "act2", type: "risk", description: "Resolved integration issue", impact: "Prevented churn", created_at: "2024-01-03T00:00:00Z" },
    ],
    qbrs: [
      { id: "qbr1", title: "Q4 2024 Business Review", scheduled_at: "2024-01-15T15:00:00Z", status: "scheduled" },
    ],
    notes: [
      { id: "note1", content: "Key stakeholder is VP of Engineering. They love the API performance.", created_at: "2024-01-10T00:00:00Z" },
    ],
  },
  {
    id: "cust_2",
    name: "Marcus Johnson",
    email: "marcus@techflow.io",
    company: "TechFlow",
    mrr: 4800,
    health_score: 78,
    risk_level: "medium",
    last_activity: "5 hours ago",
    created_at: "2023-03-20T00:00:00Z",
    plan: "Growth",
    status: "active",
    arr: 57600,
    nrr: 62400,
    users: 128,
    last_login: "5 hours ago",
    usage_metrics: [
      { metric: "API Calls", current: 89000, previous: 95000, change: -6.3 },
      { metric: "Active Users", current: 118, previous: 125, change: -5.6 },
      { metric: "Data Storage", current: 1200, previous: 1150, change: 4.3 },
    ],
    emails: [
      { id: "em3", subject: "Usage Alert: Approaching Limit", sent_at: "2024-01-09T09:00:00Z", opened_at: "2024-01-09T09:30:00Z", status: "opened" },
    ],
    actions: [
      { id: "act3", type: "risk", description: "Sent usage limit warning", impact: "Awaiting response", created_at: "2024-01-09T00:00:00Z" },
    ],
    qbrs: [],
    notes: [
      { id: "note2", content: "Concerned about pricing. Mentioned competitor offering lower rates.", created_at: "2024-01-08T00:00:00Z" },
    ],
  },
];

// Customer Actions
export async function getCustomers() {
  // Return mock data - no auth needed
  return { data: mockCustomers, error: null };
}

export async function getCustomerById(id: string) {
  const customer = mockCustomers.find(c => c.id === id);
  return { data: customer || null, error: null };
}

export async function createCustomer(customer: {
  name: string;
  email: string;
  mrr: number;
  plan: string;
  health_score?: number;
}) {
  const newCustomer = {
    id: "cust_" + Date.now(),
    ...customer,
    health_score: customer.health_score || 85,
    status: "active",
    last_activity: new Date().toISOString(),
    risk_level: "low" as const,
    company: customer.email.split("@")[1]?.split(".")[0] || "Unknown",
    arr: customer.mrr * 12,
    nrr: customer.mrr * 12 * 1.2,
    users: Math.floor(Math.random() * 50) + 5,
    last_login: "Just now",
    created_at: new Date().toISOString(),
    usage_metrics: [],
    emails: [],
    actions: [],
    qbrs: [],
    notes: [],
  };
  
  mockCustomers.push(newCustomer);
  return { data: newCustomer, error: null };
}

// Statistics Actions
export async function getDashboardStats() {
  // Calculate stats from mock data - no auth needed
  const atRisk = mockCustomers.filter(c => c.health_score < 40).length;
  const expansionReady = mockCustomers.filter(c => c.health_score >= 80).length;
  const mrr = mockCustomers.reduce((sum, c) => sum + c.mrr, 0);
  const totalCustomers = mockCustomers.length;
  
  return {
    data: {
      totalCustomers,
      atRisk,
      expansionReady,
      mrr,
      nrr: mrr * 12,
      agentActions: 12,
      emailsDrafted: 5,
      qbrsGenerated: 3,
    }
  };
}

// AI Actions
export async function getAIActions() {
  // Return mock AI actions - matches demo-data.ts AIAction interface
  const mockAIActions = [
    {
      id: "ai_01",
      customer_id: "cust_01",
      type: "email_sent" as const,
      status: "completed" as const,
      payload: "Churn rescue outreach",
      result: "Email delivered",
      created_at: new Date().toISOString(),
    },
    {
      id: "ai_02",
      customer_id: "cust_03",
      type: "qbr_generated" as const,
      status: "completed" as const,
      payload: "QBR for Globex Inc",
      result: "QBR generated",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  return { data: mockAIActions, error: null };
}

// Playbooks
export async function getPlaybooks() {
  // Return mock playbooks - matches demo-data.ts Playbook interface
  const mockPlaybooks = [
    {
      id: "pb_01",
      company_id: "comp_01",
      name: "Churn Rescue",
      trigger_type: "health_score",
      trigger_value: "< 40",
      actions_json: [{ step: 1, action: "Send personalized check-in email" }, { step: 2, action: "Create urgent support ticket" }, { step: 3, action: "Schedule executive call" }, { step: 4, action: "Offer temporary discount" }],
      active: true,
      customers_in_playbook: 3,
      success_rate: 68,
    },
    {
      id: "pb_02",
      company_id: "comp_01",
      name: "Expansion Play",
      trigger_type: "feature_limit",
      trigger_value: "hit 3x in 7 days",
      actions_json: [{ step: 1, action: "Send upsell email with pricing" }, { step: 2, action: "Create opportunity in CRM" }, { step: 3, action: "Assign to account manager" }],
      active: true,
      customers_in_playbook: 2,
      success_rate: 45,
    },
    {
      id: "pb_03",
      company_id: "comp_01",
      name: "Renewal Sequence",
      trigger_type: "contract_end",
      trigger_value: "90 days before",
      actions_json: [{ step: 1, action: "Generate QBR document" }, { step: 2, action: "Send renewal email with terms" }, { step: 3, action: "Follow up after 7 days" }, { step: 4, action: "Escalate if no response" }],
      active: true,
      customers_in_playbook: 4,
      success_rate: 72,
    },
  ];
  return { data: mockPlaybooks, error: null };
}

// Emails
export async function getEmails(status?: string) {
  // Return mock emails from customer data - no auth needed
  let emails: any[] = [];
  
  mockCustomers.forEach(customer => {
    if (customer.emails) {
      customer.emails.forEach((email: any) => {
        if (!status || email.status === status) {
          emails.push({
            ...email,
            customer_name: customer.name,
            customer_id: customer.id,
          });
        }
      });
    }
  });
  
  // Sort by sent_at descending
  emails.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  
  return { data: emails, error: null };
}

// Onboarding - Create company
export async function createCompany(companyData: {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
}) {
  // Mock company creation - no Supabase needed
  const company = {
    id: "comp_" + Date.now(),
    ...companyData,
    plan: "free",
    created_at: new Date().toISOString(),
  };
  
  return { data: company, error: null };
}

// Integrations
export async function getIntegrations() {
  // Return mock integrations - no auth needed
  const mockIntegrations = [
    {
      id: "int1",
      name: "Stripe",
      type: "billing",
      status: "connected",
      connected_at: "2024-01-15T00:00:00Z",
      description: "Payment processing and subscription management",
    },
    {
      id: "int2", 
      name: "HubSpot",
      type: "crm",
      status: "connected",
      connected_at: "2024-01-10T00:00:00Z",
      description: "Customer relationship management",
    },
    {
      id: "int3",
      name: "Slack",
      type: "messaging", 
      status: "disconnected",
      connected_at: null,
      description: "Team notifications and alerts",
    },
  ];
  return { data: mockIntegrations, error: null };
}

