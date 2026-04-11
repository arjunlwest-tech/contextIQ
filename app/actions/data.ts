"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Customer Actions
export async function getCustomers() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();
    
  if (!userData?.company_id) return { error: "No company", data: null };
  
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("company_id", userData.company_id)
    .order("health_score", { ascending: true });
    
  return { data, error: error?.message };
}

export async function getCustomerById(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data, error } = await supabase
    .from("customers")
    .select(`*, health_events(*), ai_actions(*), emails(*)`)
    .eq("id", id)
    .single();
    
  return { data, error: error?.message };
}

export async function createCustomer(customer: {
  name: string;
  email: string;
  mrr: number;
  plan: string;
  health_score?: number;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();
    
  if (!userData?.company_id) return { error: "No company", data: null };
  
  const { data, error } = await supabase
    .from("customers")
    .insert({
      ...customer,
      company_id: userData.company_id,
      health_score: customer.health_score || 85,
      status: "active",
      last_activity: new Date().toISOString(),
    })
    .select()
    .single();
    
  revalidatePath("/dashboard/customers");
  return { data, error: error?.message };
}

// Statistics Actions
export async function getDashboardStats() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();
    
  if (!userData?.company_id) {
    // Return default stats if no company yet
    return {
      data: {
        totalCustomers: 0,
        atRisk: 0,
        expansionReady: 0,
        mrr: 0,
        nrr: 0,
        agentActions: 0,
        emailsDrafted: 0,
        qbrsGenerated: 0,
      }
    };
  }
  
  // Get customers count
  const { count: totalCustomers } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("company_id", userData.company_id);
    
  // Get at-risk customers
  const { count: atRisk } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("company_id", userData.company_id)
    .lt("health_score", 40);
    
  // Get expansion ready customers
  const { count: expansionReady } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("company_id", userData.company_id)
    .gte("health_score", 80);
    
  // Get MRR
  const { data: mrrData } = await supabase
    .from("customers")
    .select("mrr")
    .eq("company_id", userData.company_id);
    
  const mrr = mrrData?.reduce((sum, c) => sum + (c.mrr || 0), 0) || 0;
    
  // Get AI actions count - fetch customer IDs first
  const { data: customerIds } = await supabase
    .from("customers")
    .select("id")
    .eq("company_id", userData.company_id);
  
  const customerIdList = customerIds?.map(c => c.id) || [];
  
  let agentActions = 0;
  if (customerIdList.length > 0) {
    const result = await supabase
      .from("ai_actions")
      .select("*", { count: "exact", head: true })
      .in("customer_id", customerIdList);
    agentActions = result.count || 0;
  }
    
  // Get emails drafted
  let emailsDrafted = 0;
  if (customerIdList.length > 0) {
    const result = await supabase
      .from("emails")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft")
      .in("customer_id", customerIdList);
    emailsDrafted = result.count || 0;
  }
    
  return {
    data: {
      totalCustomers: totalCustomers || 0,
      atRisk: atRisk || 0,
      expansionReady: expansionReady || 0,
      mrr,
      nrr: mrr * 12,
      agentActions: agentActions || 0,
      emailsDrafted: emailsDrafted || 0,
      qbrsGenerated: 0, // Will calculate from ai_actions
    }
  };
}

// AI Actions
export async function getAIActions() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();
    
  if (!userData?.company_id) return { error: "No company", data: null };
  
  // Get customer IDs first
  const { data: customerIds } = await supabase
    .from("customers")
    .select("id")
    .eq("company_id", userData.company_id);
  
  const customerIdList = customerIds?.map(c => c.id) || [];
  
  if (customerIdList.length === 0) {
    return { data: [], error: null };
  }
  
  const { data, error } = await supabase
    .from("ai_actions")
    .select(`*, customers(name)`)
    .in("customer_id", customerIdList)
    .order("created_at", { ascending: false })
    .limit(20);
    
  return { data, error: error?.message };
}

// Playbooks
export async function getPlaybooks() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();
    
  if (!userData?.company_id) return { error: "No company", data: null };
  
  const { data, error } = await supabase
    .from("playbooks")
    .select("*")
    .eq("company_id", userData.company_id)
    .order("created_at", { ascending: false });
    
  return { data, error: error?.message };
}

// Emails
export async function getEmails(status?: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();
    
  if (!userData?.company_id) return { error: "No company", data: null };
  
  // Get customer IDs first
  const { data: customerIds } = await supabase
    .from("customers")
    .select("id")
    .eq("company_id", userData.company_id);
  
  const customerIdList = customerIds?.map(c => c.id) || [];
  
  if (customerIdList.length === 0) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from("emails")
    .select(`*, customers(name)`)
    .in("customer_id", customerIdList);
    
  if (status) {
    query = query.eq("status", status);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });
    
  return { data, error: error?.message };
}

// Onboarding - Create company
export async function createCompany(companyData: {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  // Create company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: companyData.name,
      website: companyData.website,
      industry: companyData.industry,
      size: companyData.size,
      plan: "free",
    })
    .select()
    .single();
    
  if (companyError) return { error: companyError.message, data: null };
  
  // Update user with company
  const { error: userError } = await supabase
    .from("users")
    .update({ company_id: company.id })
    .eq("id", user.id);
    
  if (userError) return { error: userError.message, data: null };
  
  revalidatePath("/dashboard");
  return { data: company, error: null };
}

// Integrations
export async function getIntegrations() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };
  
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();
    
  if (!userData?.company_id) return { error: "No company", data: null };
  
  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("company_id", userData.company_id)
    .order("connected_at", { ascending: false });
    
  return { data, error: error?.message };
}

