-- Product features expansion. Apply after 202607160001_initial_schema.sql.
create type public.subscription_plan as enum ('free', 'pro');

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists plan public.subscription_plan not null default 'free';

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), slug text not null unique check (slug ~ '^[a-z0-9-]+$'), name text not null,
  description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(), slug text not null unique check (slug ~ '^[a-z0-9-]+$'), name text not null,
  description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.prompts add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.prompts add column if not exists short_description text;
alter table public.prompts add column if not exists full_description text;
alter table public.prompts add column if not exists is_featured boolean not null default false;
alter table public.prompts add column if not exists published_at timestamptz;
create table if not exists public.prompt_technologies (
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete cascade,
  primary key (prompt_id, technology_id)
);
alter table public.generated_prompts add column if not exists title text;
alter table public.generated_prompts add column if not exists input_data jsonb not null default '{}'::jsonb;
alter table public.generated_prompts add column if not exists updated_at timestamptz not null default now();
alter table public.copy_logs alter column prompt_id drop not null;
alter table public.copy_logs add column if not exists generated_prompt_id uuid references public.generated_prompts(id) on delete cascade;
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade,
  plan public.subscription_plan not null default 'free', status text not null default 'active', provider text,
  current_period_end timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create index if not exists prompts_category_status_idx on public.prompts(category_id, status, created_at desc);
create index if not exists prompts_featured_idx on public.prompts(is_featured) where is_featured;
create index if not exists generated_prompts_user_created_idx on public.generated_prompts(user_id, created_at desc);
create index if not exists copy_logs_user_created_idx on public.copy_logs(user_id, created_at desc);

alter table public.categories enable row level security;
alter table public.technologies enable row level security;
alter table public.prompt_technologies enable row level security;
alter table public.subscriptions enable row level security;
drop policy if exists "public can read categories" on public.categories;
create policy "public can read categories" on public.categories for select using (true);
drop policy if exists "public can read technologies" on public.technologies;
create policy "public can read technologies" on public.technologies for select using (true);
drop policy if exists "public can read prompt technologies" on public.prompt_technologies;
create policy "public can read prompt technologies" on public.prompt_technologies for select using (true);
drop policy if exists "users read own subscription" on public.subscriptions;
create policy "users read own subscription" on public.subscriptions for select using (auth.uid() = user_id or public.is_admin());

create or replace function public.set_generated_prompt_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists generated_prompts_updated_at on public.generated_prompts;
create trigger generated_prompts_updated_at before update on public.generated_prompts for each row execute function public.set_generated_prompt_updated_at();
