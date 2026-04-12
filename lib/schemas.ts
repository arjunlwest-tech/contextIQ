import { z } from "zod";
import xss from "xss";

export const xssString = z.string().transform(str => xss(str));

export const ChurnRiskSchema = z.object({
  name: xssString,
  mrr: z.number().min(0).max(100000000),
  contractAge: z.number().min(0),
  usageMetrics: z.array(z.object({
    feature: xssString,
    usage: z.number(),
    trend: xssString,
  })).max(50),
  supportTicketCount: z.number().min(0),
  supportSentiment: xssString,
  emailEngagement: z.number().min(0).max(100),
  daysSinceLastLogin: z.number().min(0),
  healthScore: z.number().min(0).max(100),
}).strict();

export const DraftEmailSchema = z.object({
  name: xssString,
  company: xssString,
  riskLevel: xssString,
  topReasons: z.array(xssString).max(20),
  usageData: xssString,
  desiredOutcome: xssString,
  tone: xssString,
}).strict();

export const GenerateQBRSchema = z.object({
  name: xssString,
  company: xssString,
  mrr: z.number().min(0),
  healthScore: z.number().min(0).max(100),
  metrics90d: z.array(z.object({
    date: xssString,
    score: z.number(),
  })).max(100),
  usageSummary: xssString,
  supportSummary: xssString,
  winsSummary: xssString,
  risksSummary: xssString,
}).strict();

export const ExpansionOpportunitySchema = z.array(z.object({
  id: xssString,
  name: xssString,
  mrr: z.number().min(0),
  featureUsage: z.array(z.object({
    feature: xssString,
    usage: z.number(),
    limit: z.number(),
  })).max(20),
})).max(100);

export const RecommendPlaybookSchema = z.object({
  customerName: xssString,
  healthScore: z.number().min(0).max(100),
  previousHealthScore: z.number().min(0).max(100),
  recentEvents: z.array(xssString).max(50),
}).strict();
