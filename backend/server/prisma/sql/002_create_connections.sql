-- Connection (friend) requests between users.
-- requester_id sends a request to addressee_id; once accepted they are "connected".
create table if not exists public.connections (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.app_users(id) on delete cascade,
  addressee_id uuid not null references public.app_users(id) on delete cascade,
  status       text not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint connections_status_check check (status in ('pending', 'accepted', 'rejected')),
  constraint connections_no_self_check check (requester_id <> addressee_id)
);

-- One relationship per pair, regardless of who sent the request.
-- (Blocks both A->B twice and a reverse B->A duplicate.)
create unique index if not exists connections_pair_uniq
  on public.connections (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

create index if not exists connections_addressee_idx on public.connections (addressee_id, status);
create index if not exists connections_requester_idx on public.connections (requester_id, status);
