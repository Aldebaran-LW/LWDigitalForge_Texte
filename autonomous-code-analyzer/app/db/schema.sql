-- Schema mínimo (rode no seu Supabase SQL editor)

create table if not exists public.repositories (
  id bigserial primary key,
  repo_url text unique not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.analysis_runs (
  id bigserial primary key,
  repo_url text not null,
  ref text null,
  triggered_by text not null,
  status text not null,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analysis_findings (
  id bigserial primary key,
  run_id bigint not null references public.analysis_runs(id) on delete cascade,
  severity text not null,
  code text not null,
  message text not null,
  path text null,
  line int null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analysis_runs_repo_url_idx on public.analysis_runs(repo_url);
create index if not exists analysis_findings_run_id_idx on public.analysis_findings(run_id);
