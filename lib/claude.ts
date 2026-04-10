import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";

export async function analyzeChurnRisk(data: {
  name: string; mrr: number; contractAge: number;
  usageMetrics: { feature: string; usage: number; trend: string }[];
  supportTicketCount: number; supportSentiment: string;
  emailEngagement: number; daysSinceLastLogin: number; healthScore: number;
}) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 1024,
    messages: [{ role: "user", content: `Analyze churn risk. Return ONLY valid JSON (no markdown):\n${JSON.stringify(data)}\nSchema: { "riskScore": 0-100, "riskLevel": "low"|"medium"|"high"|"critical", "topReasons": [str], "recommendedAction": str, "urgency": "immediate"|"this_week"|"this_month" }` }],
  });
  const t = r.content[0].type === "text" ? r.content[0].text : "";
  return JSON.parse(t.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
}

export async function draftEmail(data: {
  name: string; company: string; riskLevel: string;
  topReasons: string[]; usageData: string; desiredOutcome: string; tone: string;
}) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 1024,
    messages: [{ role: "user", content: `Draft outreach email. Return ONLY valid JSON (no markdown):\n${JSON.stringify(data)}\nSchema: { "subject": str, "body": str (HTML), "sendAt": ISO date, "tone": str }` }],
  });
  const t = r.content[0].type === "text" ? r.content[0].text : "";
  return JSON.parse(t.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
}

export async function generateQBR(data: {
  name: string; company: string; mrr: number; healthScore: number;
  metrics90d: { date: string; score: number }[]; usageSummary: string;
  supportSummary: string; winsSummary: string; risksSummary: string;
}) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 2048,
    messages: [{ role: "user", content: `Generate QBR. Return ONLY valid JSON (no markdown):\n${JSON.stringify(data)}\nSchema: { "executiveSummary": str, "keyMetrics": [{"label":str,"value":str,"trend":"up"|"down"|"flat"}], "wins": [str], "risks": [str], "recommendations": [str], "nextSteps": [str] }` }],
  });
  const t = r.content[0].type === "text" ? r.content[0].text : "";
  return JSON.parse(t.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
}

export async function detectExpansionOpportunities(customers: { id: string; name: string; mrr: number; featureUsage: { feature: string; usage: number; limit: number }[] }[]) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 2048,
    messages: [{ role: "user", content: `Detect expansion opportunities. Return ONLY valid JSON array (no markdown):\n${JSON.stringify(customers)}\nSchema: [{ "customerId": str, "opportunityType": "upsell"|"cross-sell"|"seat_expansion", "evidence": str, "estimatedValue": num, "suggestedPlay": str }]` }],
  });
  const t = r.content[0].type === "text" ? r.content[0].text : "";
  return JSON.parse(t.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
}

export async function recommendPlaybook(signal: { customerName: string; healthScore: number; previousHealthScore: number; recentEvents: string[] }) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 512,
    messages: [{ role: "user", content: `Recommend playbook. Return ONLY valid JSON (no markdown):\n${JSON.stringify(signal)}\nAvailable: Churn rescue (health<40), Expansion play (feature limit 3x/7d), Renewal sequence (90d before end), Onboarding nudge (no key feature 14d), Executive escalation (health drop >20pts/7d)\nSchema: { "playbookName": str, "explanation": str }` }],
  });
  const t = r.content[0].type === "text" ? r.content[0].text : "";
  return JSON.parse(t.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
}

export async function chatAssistant(question: string, context: string) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 1024,
    messages: [{ role: "user", content: `You are ContextIQ AI assistant. Be concise and actionable.\nContext:\n${context}\n\nQuestion: ${question}` }],
  });
  return r.content[0].type === "text" ? r.content[0].text : "";
}
