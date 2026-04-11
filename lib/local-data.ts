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
  
  // Initialize with EMPTY data - user creates their own
  const initialData = {
    customers: [],
    playbooks: [],
    dashboardStats: null,
    aiActions: [],
    emails: [],
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

// Get dashboard stats - REAL data only, no made up numbers
export function getDashboardStats(): DashboardStats {
  const customers = getCustomers();
  const totalMRR = customers.reduce((sum, c) => sum + (c.mrr || 0), 0);
  const avgHealth = customers.length > 0 
    ? customers.reduce((sum, c) => sum + c.health_score, 0) / customers.length 
    : 0;
  const atRisk = customers.filter(c => c.risk_level === "high").length;
  
  return {
    totalCustomers: customers.length,
    totalMRR,
    avgHealthScore: Math.round(avgHealth),
    atRiskCustomers: atRisk,
    mrrGrowth: 0, // Only show real growth when there's data
    customerGrowth: 0,
    healthChange: 0,
    riskChange: 0,
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
  // NO DEMO CUSTOMERS - User creates their own
  return [];
}

// Generate demo playbooks
function generateDemoPlaybooks(): Playbook[] {
  // NO DEMO PLAYBOOKS - User creates their own
  return [];
}

// Generate demo stats
function generateDemoStats(): DashboardStats {
  // NO MADE UP STATS - Start at 0
  return {
    totalCustomers: 0,
    totalMRR: 0,
    avgHealthScore: 0,
    atRiskCustomers: 0,
    mrrGrowth: 0,
    customerGrowth: 0,
    healthChange: 0,
    riskChange: 0,
  };
}

// Generate demo AI actions
function generateDemoAIActions(): AIAction[] {
  // NO DEMO AI ACTIONS - Only real AI actions from usage
  return [];
}

// Generate demo emails
function generateDemoEmails(): EmailCampaign[] {
  // NO DEMO EMAILS - Only real emails sent by user
  return [];
}
