-- poligami.my — run this in the Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists public.pending_registrations (
  email text primary key,
  full_name text not null,
  phone text not null,
  token uuid not null default gen_random_uuid(),
  verified boolean not null default false,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  display_name text not null default '',
  phone text not null default '',
  age int,
  occupation text not null default '',
  bio text not null default '',
  photo_url text,
  role text not null default '',
  marriage_duration text not null default 'Belum berkahwin',
  children_count text not null default '0',
  state text not null default 'Selangor',
  partner_informed boolean not null default false,
  consulted boolean not null default false,
  checklist_done jsonb not null default '[]'::jsonb,
  mykad_front text,
  mykad_back text,
  onboarding_complete boolean not null default false,
  onboarding_step text not null default 'create-profile',
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  from_id uuid not null references public.profiles(id) on delete cascade,
  to_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (from_id, to_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  text text not null default '',
  media_url text,
  media_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null,
  from_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.likes enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.messages enable row level security;
alter table public.pending_registrations enable row level security;

create policy "profiles readable" on public.profiles for select using (true);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);

create policy "likes read" on public.likes for select using (auth.uid() = from_id or auth.uid() = to_id);
create policy "likes write" on public.likes for insert with check (auth.uid() = from_id);

create policy "posts read" on public.posts for select using (true);
create policy "posts write" on public.posts for insert with check (auth.uid() = author_id);

create policy "post likes read" on public.post_likes for select using (true);
create policy "post likes write" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "post likes delete" on public.post_likes for delete using (auth.uid() = user_id);

create policy "messages read" on public.messages
  for select using (conversation_id like '%' || auth.uid()::text || '%');
create policy "messages write" on public.messages for insert with check (auth.uid() = from_id);
