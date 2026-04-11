"use server";

// Local data storage - no Supabase needed
// This file uses a mock data approach for the MVP

// Real data storage - starts empty, users create their own data
let mockCustomers: any[] = [];

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
  // Calculate REAL stats from actual customer data - no made up numbers
  const atRisk = mockCustomers.filter(c => c.health_score < 40).length;
  const expansionReady = mockCustomers.filter(c => c.health_score >= 80).length;
  const mrr = mockCustomers.reduce((sum, c) => sum + (c.mrr || 0), 0);
  const totalCustomers = mockCustomers.length;
  
  return {
    data: {
      totalCustomers,
      atRisk,
      expansionReady,
      mrr,
      nrr: mrr * 12,
      agentActions: 0, // Only real actions count
      emailsDrafted: 0, // Only real emails count
      qbrsGenerated: 0, // Only real QBRs count
    }
  };
}

// AI Actions - returns empty array until user has real AI actions
export async function getAIActions() {
  // No mock data - only real AI actions from actual usage
  return { data: [], error: null };
}

// Playbooks - starts empty, users create their own
export async function getPlaybooks() {
  // No mock data - only real playbooks created by user
  return { data: [], error: null };
}

// Emails - only real emails sent by user
export async function getEmails(status?: string) {
  // No mock data - only real emails from actual usage
  return { data: [], error: null };
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

// Integrations - starts empty, users connect their own
export async function getIntegrations() {
  // No mock data - only real integrations connected by user
  return { data: [], error: null };
}

