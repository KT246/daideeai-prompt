create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'admin');
create type public.prompt_access as enum ('free', 'pro');
create type public.prompt_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 160),
  description text not null check (char_length(description) between 10 and 500),
  category text not null,
  technologies text[] not null default '{}',
  use_case text not null,
  instructions text not null,
  content text not null,
  access public.prompt_access not null default 'free',
  status public.prompt_status not null default 'draft',
  copy_count bigint not null default 0 check (copy_count >= 0),
  like_count bigint not null default 0 check (like_count >= 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prompts_published_created_idx on public.prompts (created_at desc) where status = 'published';
create index prompts_published_copy_idx on public.prompts (copy_count desc) where status = 'published';
create index prompts_category_idx on public.prompts (category) where status = 'published';
create index prompts_technologies_idx on public.prompts using gin (technologies);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, prompt_id)
);
create index favorites_user_created_idx on public.favorites (user_id, created_at desc);

create table public.copy_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index copy_logs_user_created_idx on public.copy_logs (user_id, created_at desc);

create table public.generated_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  generator text not null check (generator in ('crud', 'builder', 'debugging', 'system-checking')),
  content text not null check (char_length(content) between 50 and 30000),
  created_at timestamptz not null default now()
);
create index generated_prompts_user_created_idx on public.generated_prompts (user_id, created_at desc);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email)); return new; end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger prompts_updated_at before update on public.prompts for each row execute procedure public.set_updated_at();

create or replace function public.increment_prompt_copy(prompt_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  update public.prompts set copy_count = copy_count + 1 where id = prompt_id and status = 'published';
  if not found then raise exception 'Prompt not found'; end if;
  if auth.uid() is not null then insert into public.copy_logs (user_id, prompt_id) values (auth.uid(), prompt_id); end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.prompts enable row level security;
alter table public.favorites enable row level security;
alter table public.copy_logs enable row level security;
alter table public.generated_prompts enable row level security;

create policy "profiles: select own" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "prompts: read published" on public.prompts for select using (status = 'published' or public.is_admin());
create policy "prompts: admin manage" on public.prompts for all using (public.is_admin()) with check (public.is_admin());
create policy "favorites: own rows" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "copy logs: read own" on public.copy_logs for select using (user_id = auth.uid());
create policy "generated prompts: own rows" on public.generated_prompts for all using (user_id = auth.uid()) with check (user_id = auth.uid());

grant execute on function public.increment_prompt_copy(uuid) to anon, authenticated;
