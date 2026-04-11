// Local data storage system - replaces Supabase
const DATA_KEY = "repulsora_data";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  mrr: number;
  health_score: number;
  risk_level: "low" | "medium" | "high";
  last_activity: string;
  created_at: string;
  plan: string;
  arr: number;
  nrr: number;
  users: number;
  last_login: string;
  usage_metrics: UsageMetric[];
  emails: CustomerEmail[];
  actions: CustomerAction[];
  qbrs: QBR[];
  notes: Note[];
}

export interface UsageMetric {
  metric: string;
  current: number;
  previous: number;
  change: number;
}

export interface CustomerEmail {
  id: string;
  subject: string;
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
  status: string;
}

export interface CustomerAction {
  id: string;
  type: string;
  description: string;
  impact: string;
  created_at: string;
}

export interface QBR {
  id: string;
  title: string;
  scheduled_at: string;
  status: string;
}

export interface Note {
  id: string;
  content: string;
  created_at: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: "active" | "paused" | "draft";
  steps: number;
  created_at: string;
  last_triggered: string;
  success_rate: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalMRR: number;
  avgHealthScore: number;
  atRiskCustomers: number;
  mrrGrowth: number;
  customerGrowth: number;
  healthChange: number;
  riskChange: number;
}

export interface AIAction {
  id: string;
  customer: string;
  action: string;
  impact: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  recipient_count: number;
  open_rate: number;
  click_rate: number;
  status: string;
  sent_at: string;
}

// Get all data
export function getLocalData() {
  if (typeof window === "undefined") {
    return { customers: [], playbooks: [], dashboardStats: null, aiActions: [], emails: [] };
  }
  
  const stored = localStorage.getItem(DATA_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with demo data
  const initialData = {
    customers: generateDemoCustomers(),
    playbooks: generateDemoPlaybooks(),
    dashboardStats: generateDemoStats(),
    aiActions: generateDemoAIActions(),
    emails: generateDemoEmails(),
  };
  
  localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
  return initialData;
}

// Save data
export function saveLocalData(data: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

// Get customers
export function getCustomers(): Customer[] {
  return getLocalData().customers || [];
}

// Get customer by ID
export function getCustomerById(id: string): Customer | null {
  const customers = getCustomers();
  return customers.find(c => c.id === id) || null;
}

// Save customer
export function saveCustomer(customer: Customer) {
  const data = getLocalData();
  const existingIndex = data.customers.findIndex((c: Customer) => c.id === customer.id);
  
  if (existingIndex >= 0) {
    data.customers[existingIndex] = customer;
  } else {
    data.customers.push(customer);
  }
  
  saveLocalData(data);
}

// Get playbooks
export function getPlaybooks(): Playbook[] {
  return getLocalData().playbooks || [];
}

// Get dashboard stats
export function getDashboardStats(): DashboardStats {
  const data = getLocalData();
  if (data.dashboardStats) return data.dashboardStats;
  
  const customers = getCustomers();
  const totalMRR = customers.reduce((sum, c) => sum + c.mrr, 0);
  const avgHealth = customers.length > 0 
    ? customers.reduce((sum, c) => sum + c.health_score, 0) / customers.length 
    : 0;
  const atRisk = customers.filter(c => c.risk_level === "high").length;
  
  return {
    totalCustomers: customers.length,
    totalMRR,
    avgHealthScore: Math.round(avgHealth),
    atRiskCustomers: atRisk,
    mrrGrowth: 12,
    customerGrowth: 8,
    healthChange: -2,
    riskChange: 5,
  };
}

// Get AI actions
export function getAIActions(): AIAction[] {
  return getLocalData().aiActions || [];
}

// Get emails
export function getEmails(): EmailCampaign[] {
  return getLocalData().emails || [];
}

// Generate demo customers
function generateDemoCustomers(): Customer[] {
  return [
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
}

// Generate demo playbooks
function generateDemoPlaybooks(): Playbook[] {
  return [
    {
      id: "pb1",
      name: "High-Risk Customer Recovery",
      description: "Automated sequence for at-risk customers showing churn signals",
      trigger: "Health Score < 60",
      status: "active",
      steps: 5,
      created_at: "2024-01-01T00:00:00Z",
      last_triggered: "2 hours ago",
      success_rate: 68,
    },
    {
      id: "pb2",
      name: "Expansion Opportunity",
      description: "Identifies and nurtures customers ready for upgrade",
      trigger: "Usage > 80% of plan",
      status: "active",
      steps: 3,
      created_at: "2024-01-02T00:00:00Z",
      last_triggered: "5 hours ago",
      success_rate: 82,
    },
    {
      id: "pb3",
      name: "New Customer Onboarding",
      description: "Guides new customers to first value milestone",
      trigger: "Account created",
      status: "active",
      steps: 7,
      created_at: "2024-01-03T00:00:00Z",
      last_triggered: "1 day ago",
      success_rate: 91,
    },
  ];
}

// Generate demo stats
function generateDemoStats(): DashboardStats {
  return {
    totalCustomers: 156,
    totalMRR: 523400,
    avgHealthScore: 84,
    atRiskCustomers: 12,
    mrrGrowth: 12,
    customerGrowth: 8,
    healthChange: -2,
    riskChange: 5,
  };
}

// Generate demo AI actions
function generateDemoAIActions(): AIAction[] {
  return [
    {
      id: "ai1",
      customer: "TechFlow",
      action: "Sent expansion offer email",
      impact: "+$2,400 ARR potential",
      priority: "high",
      timestamp: "10 min ago",
    },
    {
      id: "ai2",
      customer: "Acme Corp",
      action: "Scheduled QBR for next week",
      impact: "Retention boost",
      priority: "medium",
      timestamp: "1 hour ago",
    },
  ];
}

// Generate demo emails
function generateDemoEmails(): EmailCampaign[] {
  return [
    {
      id: "em1",
      subject: "QBR Summary - Q4 2024",
      recipient_count: 156,
      open_rate: 68,
      click_rate: 42,
      status: "sent",
      sent_at: "2024-01-10T10:00:00Z",
    },
    {
      id: "em2",
      subject: "New Features Announcement",
      recipient_count: 156,
      open_rate: 72,
      click_rate: 38,
      status: "sent",
      sent_at: "2024-01-08T14:00:00Z",
    },
  ];
}
