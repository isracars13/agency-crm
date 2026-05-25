-- Run this in Supabase SQL Editor → New Query

create table if not exists clients (
  id              text primary key,
  name            text not null,
  business_name   text,
  phone           text,
  neighborhood    text default 'מרכז',
  status          text default 'lead',
  monthly_payment numeric default 0,
  start_date      date,
  notes           text,
  created_at      timestamptz default now()
);

create table if not exists events (
  id          text primary key,
  title       text not null,
  date        date not null,
  client_id   text references clients(id) on delete set null,
  description text,
  created_at  timestamptz default now()
);

-- Enable RLS — only logged-in users can access data
alter table clients enable row level security;
alter table events  enable row level security;

-- Allow all operations for authenticated users
create policy "authenticated full access" on clients
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on events
  for all to authenticated using (true) with check (true);
