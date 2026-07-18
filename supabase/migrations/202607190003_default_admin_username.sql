-- Stores the login name separately from Supabase Auth's internal bootstrap email.
alter table public.profiles add column if not exists username text;
create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username)) where username is not null;
alter table public.profiles add constraint profiles_username_format check (username is null or username ~ '^[a-zA-Z0-9._-]{3,40}$');
