-- Portfolio backend: content, admin authorization, contact messages and storage.
-- Apply with the Supabase CLI (`supabase db push`) or in the SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key default 'main' check (id = 'main'),
  name text not null check (char_length(name) between 1 and 100),
  first_name text not null check (char_length(first_name) between 1 and 60),
  last_name text not null check (char_length(last_name) between 1 and 60),
  eyebrow text not null check (char_length(eyebrow) between 1 and 100),
  roles text[] not null default '{}',
  introduction text not null check (char_length(introduction) between 1 and 600),
  about text not null check (char_length(about) between 1 and 2000),
  details jsonb not null default '[]'::jsonb check (jsonb_typeof(details) = 'array'),
  resume_url text,
  portrait_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  number text not null check (char_length(number) between 1 and 10),
  name text not null check (char_length(name) between 1 and 120),
  type text not null check (char_length(type) between 1 and 120),
  description text not null check (char_length(description) between 1 and 2000),
  technologies text[] not null default '{}',
  live_url text,
  github_url text,
  case_study_url text,
  image_url text,
  status text not null default 'Project',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  category text not null check (char_length(category) between 1 and 100),
  number text not null check (char_length(number) between 1 and 10),
  skills text[] not null default '{}',
  is_placeholder boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$ begin
  create type public.journey_kind as enum ('education', 'experience', 'focus');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.journey_items (
  id uuid primary key default gen_random_uuid(),
  period text not null check (char_length(period) between 1 and 80),
  title text not null check (char_length(title) between 1 and 160),
  description text not null check (char_length(description) between 1 and 2000),
  kind public.journey_kind not null,
  is_placeholder boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null check (char_length(category) between 1 and 100),
  description text not null check (char_length(description) between 1 and 600),
  content text not null default '' check (char_length(content) <= 100000),
  tags text[] not null default '{}',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_date_required check (not published or published_at is not null)
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null unique check (char_length(label) between 1 and 60),
  url text,
  visible boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_]+$'),
  value jsonb not null,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null check (char_length(subject) between 1 and 160),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  ip_hash text not null check (char_length(ip_hash) = 64),
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx on public.projects (published, sort_order);
create index if not exists skill_groups_public_order_idx on public.skill_groups (published, sort_order);
create index if not exists journey_items_public_order_idx on public.journey_items (published, sort_order);
create index if not exists articles_public_order_idx on public.articles (published, sort_order);
create index if not exists articles_published_at_idx on public.articles (published_at desc) where published;
create index if not exists social_links_public_order_idx on public.social_links (visible, sort_order);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_rate_limit_idx on public.contact_messages (ip_hash, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin(candidate uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users where user_id = candidate);
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists skill_groups_updated_at on public.skill_groups;
create trigger skill_groups_updated_at before update on public.skill_groups for each row execute function public.set_updated_at();
drop trigger if exists journey_items_updated_at on public.journey_items;
create trigger journey_items_updated_at before update on public.journey_items for each row execute function public.set_updated_at();
drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at before update on public.articles for each row execute function public.set_updated_at();
drop trigger if exists social_links_updated_at on public.social_links;
create trigger social_links_updated_at before update on public.social_links for each row execute function public.set_updated_at();
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.journey_items enable row level security;
alter table public.articles enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

create policy "admins can view their authorization" on public.admin_users
  for select to authenticated using (user_id = auth.uid());
create policy "public can read profile" on public.profiles
  for select to anon, authenticated using (true);
create policy "public can read published projects" on public.projects
  for select to anon, authenticated using (published);
create policy "admins can read all projects" on public.projects
  for select to authenticated using (public.is_admin());
create policy "public can read published skills" on public.skill_groups
  for select to anon, authenticated using (published);
create policy "admins can read all skills" on public.skill_groups
  for select to authenticated using (public.is_admin());
create policy "public can read published journey" on public.journey_items
  for select to anon, authenticated using (published);
create policy "admins can read all journey" on public.journey_items
  for select to authenticated using (public.is_admin());
create policy "public can read published articles" on public.articles
  for select to anon, authenticated using (published);
create policy "admins can read all articles" on public.articles
  for select to authenticated using (public.is_admin());
create policy "public can read visible social links" on public.social_links
  for select to anon, authenticated using (visible);
create policy "admins can read all social links" on public.social_links
  for select to authenticated using (public.is_admin());
create policy "public can read public settings" on public.site_settings
  for select to anon, authenticated using (is_public);
create policy "admins can read all settings" on public.site_settings
  for select to authenticated using (public.is_admin());

create policy "admins manage profile" on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage projects" on public.projects for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage skills" on public.skill_groups for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage journey" on public.journey_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage articles" on public.articles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage social links" on public.social_links for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins read contact messages" on public.contact_messages for select to authenticated
  using (public.is_admin());
create policy "admins update contact messages" on public.contact_messages for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins delete contact messages" on public.contact_messages for delete to authenticated
  using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public can view portfolio assets" on storage.objects
  for select to public using (bucket_id = 'portfolio-assets');
create policy "admins upload portfolio assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-assets' and public.is_admin());
create policy "admins update portfolio assets" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-assets' and public.is_admin());
create policy "admins delete portfolio assets" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-assets' and public.is_admin());

insert into public.profiles (
  id, name, first_name, last_name, eyebrow, roles, introduction, about, details
) values (
  'main',
  'Hisham Abdulla',
  'Hisham',
  'Abdulla',
  'Hello, I''m',
  array['Full-stack developer', 'Machine learning learner', 'Technology enthusiast'],
  'I build digital experiences and explore how software, technology, and intelligent systems work from beginning to end.',
  'I’m interested in the full shape of a digital product: how it reads, how it feels, how the system behind it works, and what can be learned by building it well.',
  '[{"label":"Name","value":"Hisham Abdulla","isPlaceholder":false},{"label":"Role","value":"Full-stack developer","isPlaceholder":false},{"label":"Education","value":"Details to be added","isPlaceholder":true},{"label":"Location","value":"Details to be added","isPlaceholder":true},{"label":"Availability","value":"Details to be added","isPlaceholder":true}]'::jsonb
) on conflict (id) do nothing;

insert into public.projects (
  number, name, type, description, technologies, live_url, status, featured, published, sort_order
) select
  '01', 'BroDoctor', 'Medical Learning Platform',
  'A web-based learning platform for medical education. Further case-study details can be added once the product scope and implementation are documented.',
  array['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
  'https://brodoctor.online', 'Featured project', true, true, 10
where not exists (select 1 from public.projects where name = 'BroDoctor');

insert into public.skill_groups (category, number, skills, is_placeholder, published, sort_order)
select seed.category, seed.number, seed.skills, seed.is_placeholder, true, seed.sort_order
from (values
  ('Frontend', '01', array['React', 'TypeScript', 'Tailwind CSS'], false, 10),
  ('Backend', '02', array['Supabase'], false, 20),
  ('Databases', '03', array['PostgreSQL'], false, 30),
  ('Machine Learning / Data', '04', array['Details to be added'], true, 40),
  ('Tools / Infrastructure', '05', array['Details to be added'], true, 50)
) as seed(category, number, skills, is_placeholder, sort_order)
where not exists (select 1 from public.skill_groups);

insert into public.journey_items (period, title, description, kind, is_placeholder, published, sort_order)
select seed.period, seed.title, seed.description, seed.kind::public.journey_kind, true, true, seed.sort_order
from (values
  ('Timeline', 'Education & experience', 'Verified education, employment, certifications and dates will be added here.', 'education', 10),
  ('01', 'Currently building', 'Project details to be added', 'focus', 20),
  ('02', 'Currently learning', 'Learning focus to be added', 'focus', 30),
  ('03', 'Currently exploring', 'Exploration notes to be added', 'focus', 40)
) as seed(period, title, description, kind, sort_order)
where not exists (select 1 from public.journey_items);

insert into public.social_links (label, url, visible, sort_order)
select seed.label, null, true, seed.sort_order
from (values ('GitHub', 10), ('LinkedIn', 20), ('Email', 30), ('Instagram', 40)) as seed(label, sort_order)
on conflict (label) do nothing;
