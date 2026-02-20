-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  done boolean default false,
  category text not null default 'personal' check (category in ('work', 'personal', 'shopping')),
  created_at timestamptz default now()
);

-- Allow anonymous access for demo (no auth)
alter table tasks enable row level security;

create policy "Allow all for demo" on tasks
  for all using (true) with check (true);
