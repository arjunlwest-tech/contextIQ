const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export interface Customer {
  id: string; company_id: string; name: string; logo_url: string;
  mrr: number; contract_end: string; health_score: number; created_at: string;
  usage_metrics: { feature: string; usage: number; trend: string }[];
  support_ticket_count: number; support_sentiment: string;
  email_engagement: number; days_since_last_login: number; contract_age: number;
}

export interface AIAction {
  id: string; customer_id: string;
  type: "email_sent" | "playbook_triggered" | "qbr_generated" | "alert_created";
  status: "completed" | "pending" | "failed" | "in_progress";
  payload: string; result: string; created_at: string;
}

export interface Email {
  id: string; customer_id: string; subject: string; body: string;
  status: "draft" | "pending_approval" | "approved" | "sent" | "opened" | "clicked";
  sent_at: string | null; opened_at: string | null; clicked_at: string | null;
}

export interface Playbook {
  id: string; company_id: string; name: string; trigger_type: string;
  trigger_value: string; actions_json: { step: string; action: string }[];
  active: boolean; customers_in_playbook: number; success_rate: number;
}

export interface Integration {
  id: string; company_id: string; type: string;
  status: "connected" | "disconnected" | "syncing"; connected_at: string;
}

export const DEMO_CUSTOMERS: Customer[] = [
  { id: "cust_01", company_id: "comp_01", name: "Acme Corp", logo_url: "", mrr: 12000, contract_end: "2026-08-15", health_score: 23, created_at: daysAgo(180), usage_metrics: [{ feature: "API Calls", usage: 34, trend: "down" }, { feature: "Active Users", usage: 28, trend: "down" }, { feature: "Feature Adoption", usage: 15, trend: "down" }], support_ticket_count: 12, support_sentiment: "negative", email_engagement: 8, days_since_last_login: 14, contract_age: 18 },
  { id: "cust_02", company_id: "comp_01", name: "TechCorp", logo_url: "", mrr: 8500, contract_end: "2026-06-01", health_score: 31, created_at: daysAgo(240), usage_metrics: [{ feature: "API Calls", usage: 42, trend: "down" }, { feature: "Active Users", usage: 38, trend: "flat" }, { feature: "Feature Adoption", usage: 22, trend: "down" }], support_ticket_count: 8, support_sentiment: "mixed", email_engagement: 15, days_since_last_login: 7, contract_age: 24 },
  { id: "cust_03", company_id: "comp_01", name: "Globex Inc", logo_url: "", mrr: 15000, contract_end: "2026-12-31", health_score: 18, created_at: daysAgo(90), usage_metrics: [{ feature: "API Calls", usage: 12, trend: "down" }, { feature: "Active Users", usage: 18, trend: "down" }, { feature: "Feature Adoption", usage: 8, trend: "down" }], support_ticket_count: 15, support_sentiment: "very_negative", email_engagement: 3, days_since_last_login: 28, contract_age: 9 },
  { id: "cust_04", company_id: "comp_01", name: "Initech", logo_url: "", mrr: 5200, contract_end: "2026-09-15", health_score: 52, created_at: daysAgo(150), usage_metrics: [{ feature: "API Calls", usage: 58, trend: "flat" }, { feature: "Active Users", usage: 55, trend: "down" }, { feature: "Feature Adoption", usage: 40, trend: "flat" }], support_ticket_count: 4, support_sentiment: "neutral", email_engagement: 32, days_since_last_login: 3, contract_age: 15 },
  { id: "cust_05", company_id: "comp_01", name: "Umbrella Corp", logo_url: "", mrr: 22000, contract_end: "2027-03-01", health_score: 45, created_at: daysAgo(300), usage_metrics: [{ feature: "API Calls", usage: 50, trend: "down" }, { feature: "Active Users", usage: 48, trend: "flat" }, { feature: "Feature Adoption", usage: 35, trend: "down" }], support_ticket_count: 6, support_sentiment: "mixed", email_engagement: 22, days_since_last_login: 5, contract_age: 30 },
  { id: "cust_06", company_id: "comp_01", name: "Wayne Enterprises", logo_url: "", mrr: 18000, contract_end: "2027-01-15", health_score: 61, created_at: daysAgo(200), usage_metrics: [{ feature: "API Calls", usage: 65, trend: "flat" }, { feature: "Active Users", usage: 60, trend: "up" }, { feature: "Feature Adoption", usage: 52, trend: "flat" }], support_ticket_count: 3, support_sentiment: "positive", email_engagement: 45, days_since_last_login: 1, contract_age: 20 },
  { id: "cust_07", company_id: "comp_01", name: "Stark Industries", logo_url: "", mrr: 35000, contract_end: "2027-06-30", health_score: 58, created_at: daysAgo(120), usage_metrics: [{ feature: "API Calls", usage: 62, trend: "up" }, { feature: "Active Users", usage: 58, trend: "flat" }, { feature: "Feature Adoption", usage: 48, trend: "down" }], support_ticket_count: 5, support_sentiment: "neutral", email_engagement: 38, days_since_last_login: 2, contract_age: 12 },
  { id: "cust_08", company_id: "comp_01", name: "Cyberdyne Systems", logo_url: "", mrr: 9500, contract_end: "2026-11-01", health_score: 82, created_at: daysAgo(365), usage_metrics: [{ feature: "API Calls", usage: 85, trend: "up" }, { feature: "Active Users", usage: 78, trend: "up" }, { feature: "Feature Adoption", usage: 72, trend: "up" }], support_ticket_count: 1, support_sentiment: "positive", email_engagement: 62, days_since_last_login: 0, contract_age: 36 },
  { id: "cust_09", company_id: "comp_01", name: "Massive Dynamic", logo_url: "", mrr: 28000, contract_end: "2027-09-15", health_score: 91, created_at: daysAgo(250), usage_metrics: [{ feature: "API Calls", usage: 92, trend: "up" }, { feature: "Active Users", usage: 88, trend: "up" }, { feature: "Feature Adoption", usage: 85, trend: "up" }], support_ticket_count: 0, support_sentiment: "positive", email_engagement: 71, days_since_last_login: 0, contract_age: 25 },
  { id: "cust_10", company_id: "comp_01", name: "Oscorp", logo_url: "", mrr: 6800, contract_end: "2026-07-01", health_score: 76, created_at: daysAgo(160), usage_metrics: [{ feature: "API Calls", usage: 78, trend: "flat" }, { feature: "Active Users", usage: 72, trend: "up" }, { feature: "Feature Adoption", usage: 68, trend: "flat" }], support_ticket_count: 2, support_sentiment: "positive", email_engagement: 55, days_since_last_login: 1, contract_age: 16 },
  { id: "cust_11", company_id: "comp_01", name: "Soylent Corp", logo_url: "", mrr: 4200, contract_end: "2026-10-15", health_score: 88, created_at: daysAgo(100), usage_metrics: [{ feature: "API Calls", usage: 90, trend: "up" }, { feature: "Active Users", usage: 82, trend: "up" }, { feature: "Feature Adoption", usage: 78, trend: "up" }], support_ticket_count: 1, support_sentiment: "positive", email_engagement: 68, days_since_last_login: 0, contract_age: 10 },
  { id: "cust_12", company_id: "comp_01", name: "Aperture Science", logo_url: "", mrr: 14000, contract_end: "2027-04-01", health_score: 95, created_at: daysAgo(400), usage_metrics: [{ feature: "API Calls", usage: 96, trend: "up" }, { feature: "Active Users", usage: 92, trend: "up" }, { feature: "Feature Adoption", usage: 90, trend: "up" }], support_ticket_count: 0, support_sentiment: "very_positive", email_engagement: 82, days_since_last_login: 0, contract_age: 40 },
];

export const DEMO_AI_ACTIONS: AIAction[] = [
  { id: "ai_01", customer_id: "cust_01", type: "email_sent", status: "completed", payload: "Churn rescue outreach", result: "Email delivered", created_at: minutesAgo(2) },
  { id: "ai_02", customer_id: "cust_03", type: "qbr_generated", status: "completed", payload: "QBR for Globex Inc", result: "QBR generated", created_at: minutesAgo(14) },
  { id: "ai_03", customer_id: "cust_02", type: "playbook_triggered", status: "completed", payload: "Churn rescue playbook", result: "Playbook executing", created_at: minutesAgo(28) },
  { id: "ai_04", customer_id: "cust_05", type: "email_sent", status: "completed", payload: "Renewal sequence email", result: "Email delivered", created_at: minutesAgo(45) },
  { id: "ai_05", customer_id: "cust_09", type: "alert_created", status: "completed", payload: "Expansion opportunity", result: "Upsell: $8,400 est.", created_at: minutesAgo(60) },
  { id: "ai_06", customer_id: "cust_04", type: "email_sent", status: "completed", payload: "Onboarding nudge", result: "Email delivered", created_at: minutesAgo(90) },
  { id: "ai_07", customer_id: "cust_06", type: "playbook_triggered", status: "completed", payload: "Renewal sequence", result: "Playbook executing", created_at: minutesAgo(120) },
  { id: "ai_08", customer_id: "cust_10", type: "qbr_generated", status: "completed", payload: "QBR for Oscorp", result: "QBR generated", created_at: minutesAgo(180) },
  { id: "ai_09", customer_id: "cust_07", type: "email_sent", status: "pending", payload: "Executive escalation", result: "Awaiting approval", created_at: minutesAgo(5) },
  { id: "ai_10", customer_id: "cust_03", type: "playbook_triggered", status: "in_progress", payload: "Executive escalation", result: "Running step 2/4", created_at: minutesAgo(10) },
];

export const DEMO_EMAILS: Email[] = [
  { id: "em_01", customer_id: "cust_01", subject: "We noticed something — let's get back on track", body: "<p>Hi Sarah,</p><p>We've noticed your team's usage has declined. We'd love to help you get the most out of your subscription...</p>", status: "sent", sent_at: minutesAgo(120), opened_at: minutesAgo(95), clicked_at: null },
  { id: "em_02", customer_id: "cust_02", subject: "Your upcoming renewal — early access to new features", body: "<p>Hi Michael,</p><p>Your contract is coming up for renewal. We'd like to offer early access to our new analytics dashboard...</p>", status: "pending_approval", sent_at: null, opened_at: null, clicked_at: null },
  { id: "em_03", customer_id: "cust_03", subject: "Urgent: Let's schedule a call to address your concerns", body: "<p>Hi David,</p><p>We've seen concerning trends and want to make sure we're meeting your needs...</p>", status: "pending_approval", sent_at: null, opened_at: null, clicked_at: null },
  { id: "em_04", customer_id: "cust_05", subject: "New features that could boost your team's productivity", body: "<p>Hi Lisa,</p><p>Based on your usage patterns, our new collaboration features could really help...</p>", status: "sent", sent_at: minutesAgo(45), opened_at: minutesAgo(30), clicked_at: minutesAgo(25) },
  { id: "em_05", customer_id: "cust_09", subject: "Ready to scale? Your usage suggests it's time", body: "<p>Hi Jennifer,</p><p>Your team has been using repulsora at near-capacity. Let's discuss upgrading...</p>", status: "draft", sent_at: null, opened_at: null, clicked_at: null },
  { id: "em_06", customer_id: "cust_07", subject: "Executive review: Your Q3 results and next steps", body: "<p>Hi Tony,</p><p>Attached is your Q3 business review with opportunities we've identified...</p>", status: "sent", sent_at: minutesAgo(200), opened_at: minutesAgo(180), clicked_at: minutesAgo(170) },
];

export const DEMO_PLAYBOOKS: Playbook[] = [
  { id: "pb_01", company_id: "comp_01", name: "Churn Rescue", trigger_type: "health_score", trigger_value: "< 40", actions_json: [{ step: "1", action: "Send personalized check-in email" }, { step: "2", action: "Create urgent support ticket" }, { step: "3", action: "Schedule executive call" }, { step: "4", action: "Offer temporary discount" }], active: true, customers_in_playbook: 3, success_rate: 68 },
  { id: "pb_02", company_id: "comp_01", name: "Expansion Play", trigger_type: "feature_limit", trigger_value: "hit 3x in 7 days", actions_json: [{ step: "1", action: "Send upsell email with pricing" }, { step: "2", action: "Create opportunity in CRM" }, { step: "3", action: "Assign to account manager" }], active: true, customers_in_playbook: 2, success_rate: 45 },
  { id: "pb_03", company_id: "comp_01", name: "Renewal Sequence", trigger_type: "contract_end", trigger_value: "90 days before", actions_json: [{ step: "1", action: "Generate QBR document" }, { step: "2", action: "Send renewal email with terms" }, { step: "3", action: "Follow up after 7 days" }, { step: "4", action: "Escalate if no response" }], active: true, customers_in_playbook: 4, success_rate: 72 },
  { id: "pb_04", company_id: "comp_01", name: "Onboarding Nudge", trigger_type: "feature_usage", trigger_value: "key feature not used in 14 days", actions_json: [{ step: "1", action: "Send feature tutorial email" }, { step: "2", action: "Schedule training session" }, { step: "3", action: "Follow up in 3 days" }], active: true, customers_in_playbook: 1, success_rate: 81 },
  { id: "pb_05", company_id: "comp_01", name: "Executive Escalation", trigger_type: "health_score_drop", trigger_value: "> 20pts in 7 days", actions_json: [{ step: "1", action: "Alert CSM manager" }, { step: "2", action: "Draft executive email" }, { step: "3", action: "Schedule emergency call" }, { step: "4", action: "Create recovery plan" }], active: true, customers_in_playbook: 1, success_rate: 55 },
];

export const DEMO_INTEGRATIONS: Integration[] = [
  { id: "int_01", company_id: "comp_01", type: "segment", status: "connected", connected_at: daysAgo(30) },
  { id: "int_02", company_id: "comp_01", type: "hubspot", status: "connected", connected_at: daysAgo(28) },
  { id: "int_03", company_id: "comp_01", type: "intercom", status: "connected", connected_at: daysAgo(25) },
  { id: "int_04", company_id: "comp_01", type: "gmail", status: "connected", connected_at: daysAgo(20) },
];

export function generateHealthTrend(currentScore: number, days = 90): { date: string; score: number }[] {
  const trend: { date: string; score: number }[] = [];
  let score = currentScore + (currentScore < 50 ? 30 : currentScore > 80 ? -10 : 10);
  for (let i = days; i >= 0; i -= 3) {
    const jitter = Math.floor(Math.random() * 8) - 4;
    score = Math.max(5, Math.min(100, score + jitter + (currentScore < score ? -1 : 1)));
    if (Math.abs(score - currentScore) < 15 && i < 15) score = currentScore + jitter;
    trend.push({ date: daysAgo(i).split("T")[0], score: Math.max(5, Math.min(100, score)) });
  }
  return trend;
}

export function getHealthColor(score: number): string {
  if (score >= 70) return "text-emerald";
  if (score >= 40) return "text-amber";
  return "text-danger";
}

export function getHealthBg(score: number): string {
  if (score >= 70) return "bg-emerald/20 text-emerald";
  if (score >= 40) return "bg-amber/20 text-amber";
  return "bg-danger/20 text-danger";
}

export function getHealthLabel(score: number): string {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "At Risk";
  return "Critical";
}

export const CHURN_PREVENTED_WEEK = 127500;
export const REVENUE_SAVED_MONTH = 342000;
export const PORTFOLIO_HEALTH = 62;
export const MRR_AT_RISK = 35700;
export const EXPANSION_OPPORTUNITIES = 48200;
