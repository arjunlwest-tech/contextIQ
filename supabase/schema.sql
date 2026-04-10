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

-- COMPREHENSIVE RLS Policies

-- Companies: Users can view their own company, admins can insert/update
CREATE POLICY "Users can view own company" 
  ON companies FOR SELECT 
  USING (id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can update company" 
  ON companies FOR UPDATE 
  USING (id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can create company during signup" 
  ON companies FOR INSERT 
  WITH CHECK (true);

-- Users: View own profile, update own data
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (id = auth.uid());

CREATE POLICY "Allow profile creation on signup" 
  ON users FOR INSERT 
  WITH CHECK (id = auth.uid());

-- Integrations: Full CRUD for company data
CREATE POLICY "Users can view company integrations" 
  ON integrations FOR SELECT 
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage integrations" 
  ON integrations FOR ALL 
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Customers: Full CRUD for company customers
CREATE POLICY "Users can view company customers" 
  ON customers FOR SELECT 
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage customers" 
  ON customers FOR ALL 
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Health Events: View for all company users, insert via triggers/API
CREATE POLICY "Users can view company health events" 
  ON health_events FOR SELECT 
  USING (customer_id IN (SELECT id FROM customers WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())));

CREATE POLICY "System can insert health events" 
  ON health_events FOR INSERT 
  WITH CHECK (true);

-- AI Actions: Full visibility, system can create
CREATE POLICY "Users can view company ai actions" 
  ON ai_actions FOR SELECT 
  USING (customer_id IN (SELECT id FROM customers WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())));

CREATE POLICY "System can create ai actions" 
  ON ai_actions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update ai actions" 
  ON ai_actions FOR UPDATE 
  USING (customer_id IN (SELECT id FROM customers WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin')));

-- Emails: Full CRUD
CREATE POLICY "Users can view company emails" 
  ON emails FOR SELECT 
  USING (customer_id IN (SELECT id FROM customers WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can manage company emails" 
  ON emails FOR ALL 
  USING (customer_id IN (SELECT id FROM customers WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())));

-- Playbooks: Full CRUD for admins
CREATE POLICY "Users can view company playbooks" 
  ON playbooks FOR SELECT 
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage playbooks" 
  ON playbooks FOR ALL 
  USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Playbook Runs: View for all, insert via system
CREATE POLICY "Users can view company playbook runs" 
  ON playbook_runs FOR SELECT 
  USING (playbook_id IN (SELECT id FROM playbooks WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())));

CREATE POLICY "System can create playbook runs" 
  ON playbook_runs FOR INSERT 
  WITH CHECK (true);

-- TRIGGERS AND FUNCTIONS

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (new.id, new.email, 'admin', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update health score when health event is added
CREATE OR REPLACE FUNCTION public.update_customer_health_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers 
  SET health_score = NEW.score
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update health score on new health event
DROP TRIGGER IF EXISTS on_health_event_added ON health_events;
CREATE TRIGGER on_health_event_added
  AFTER INSERT ON health_events
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_health_score();

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_health_events_customer_id ON health_events(customer_id);
CREATE INDEX idx_ai_actions_customer_id ON ai_actions(customer_id);
CREATE INDEX idx_emails_customer_id ON emails(customer_id);
CREATE INDEX idx_playbooks_company_id ON playbooks(company_id);
CREATE INDEX idx_integrations_company_id ON integrations(company_id);
