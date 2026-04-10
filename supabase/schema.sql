-- ContextIQ Database Schema
-- Run this in your Supabase SQL editor

-- Companies
create table companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  plan text default 'starter' check (plan in ('starter', 'growth', 'enterprise')),
  mrr integer default 0,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Users
create table users (
  id uuid references auth.users primary key,
  email text not null,
  company_id uuid references companies(id),
  role text default 'admin' check (role in ('admin', 'viewer')),
  created_at timestamptz default now()
);

-- Integrations
create table integrations (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) not null,
  type text not null,
  status text default 'disconnected' check (status in ('connected', 'disconnected', 'syncing')),
  credentials_encrypted text,
  connected_at timestamptz,
  created_at timestamptz default now()
);

-- Customers
create table customers (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) not null,
  name text not null,
  logo_url text,
  mrr integer default 0,
  contract_end date,
  health_score integer default 50 check (health_score >= 0 and health_score <= 100),
  created_at timestamptz default now()
);

-- Health Events
create table health_events (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) not null,
  score integer not null,
  reason text,
  created_at timestamptz default now()
);

-- AI Actions
create table ai_actions (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) not null,
  type text not null check (type in ('email_sent', 'playbook_triggered', 'qbr_generated', 'alert_created')),
  status text default 'pending' check (status in ('completed', 'pending', 'failed', 'in_progress')),
  payload jsonb,
  result jsonb,
  created_at timestamptz default now()
);

-- Emails
create table emails (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) not null,
  subject text not null,
  body text not null,
  status text default 'draft' check (status in ('draft', 'pending_approval', 'approved', 'sent', 'opened', 'clicked')),
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  created_at timestamptz default now()
);

-- Playbooks
create table playbooks (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) not null,
  name text not null,
  trigger_type text not null,
  trigger_value text not null,
  actions_json jsonb default '[]',
  active boolean default true,
  created_at timestamptz default now()
);

-- Playbook Runs
create table playbook_runs (
  id uuid default gen_random_uuid() primary key,
  playbook_id uuid references playbooks(id) not null,
  customer_id uuid references customers(id) not null,
  started_at timestamptz default now(),
  completed_at timestamptz,
  outcome text check (outcome in ('success', 'failed', 'in_progress'))
);

-- Row Level Security
alter table companies enable row level security;
alter table users enable row level security;
alter table integrations enable row level security;
alter table customers enable row level security;
alter table health_events enable row level security;
alter table ai_actions enable row level security;
alter table emails enable row level security;
alter table playbooks enable row level security;
alter table playbook_runs enable row level security;

-- RLS Policies (users can only access their own company's data)
create policy "Users can view own company" on companies for select using (id in (select company_id from users where id = auth.uid()));
create policy "Users can view own profile" on users for select using (id = auth.uid());
create policy "Users can view company integrations" on integrations for select using (company_id in (select company_id from users where id = auth.uid()));
create policy "Users can view company customers" on customers for select using (company_id in (select company_id from users where id = auth.uid()));
create policy "Users can view company health events" on health_events for select using (customer_id in (select id from customers where company_id in (select company_id from users where id = auth.uid())));
create policy "Users can view company ai actions" on ai_actions for select using (customer_id in (select id from customers where company_id in (select company_id from users where id = auth.uid())));
create policy "Users can view company emails" on emails for select using (customer_id in (select id from customers where company_id in (select company_id from users where id = auth.uid())));
create policy "Users can view company playbooks" on playbooks for select using (company_id in (select company_id from users where id = auth.uid()));
create policy "Users can view company playbook runs" on playbook_runs for select using (playbook_id in (select id from playbooks where company_id in (select company_id from users where id = auth.uid())));
