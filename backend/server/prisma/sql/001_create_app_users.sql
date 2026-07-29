-- Custom auth table (independent of Supabase Auth / auth.users).
-- Stores email + bcrypt password hash + role for our own JWT authentication.
create table if not exists public.app_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  full_name     text,
  role          text not null default 'viewer',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint app_users_role_check check (role in ('admin', 'viewer'))
);
