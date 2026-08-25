begin;

create extension if not exists pgcrypto;

create table public.parent_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parent_profiles(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 20),
  age_band text not null check (age_band in ('4-6', '7-9', '10-12')),
  avatar_key text not null,
  goals jsonb not null default '[]'::jsonb,
  xp integer not null default 0 check (xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id text primary key,
  slug text not null unique,
  title jsonb not null,
  short_description jsonb not null,
  icon_key text not null,
  levels integer not null default 10 check (levels > 0),
  age_availability text[] not null,
  is_active boolean not null default true
);

create table public.missions (
  id text primary key,
  skill_id text not null references public.skills(id),
  age_bands text[] not null,
  difficulty smallint not null check (difficulty between 1 and 5),
  title jsonb not null,
  description jsonb not null,
  estimated_minutes integer not null check (estimated_minutes > 0),
  xp_reward integer not null check (xp_reward > 0),
  steps jsonb not null check (jsonb_typeof(steps) = 'array'),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.child_skill_preferences (
  child_id uuid not null references public.children(id) on delete cascade,
  skill_id text not null references public.skills(id),
  priority smallint not null default 1 check (priority between 1 and 5),
  primary key (child_id, skill_id)
);

create table public.mission_assignments (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  mission_id text not null references public.missions(id),
  assigned_at timestamptz not null default now(),
  status text not null default 'assigned' check (status in ('assigned', 'started', 'completed', 'skipped')),
  unique (child_id, mission_id)
);

create table public.mission_attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  mission_id text not null references public.missions(id),
  idempotency_key uuid not null,
  answers jsonb not null default '[]'::jsonb,
  score_percent integer not null check (score_percent between 0 and 100),
  xp_earned integer not null check (xp_earned >= 0),
  completed_at timestamptz not null default now(),
  unique (child_id, mission_id),
  unique (child_id, idempotency_key)
);

create table public.skill_progress (
  child_id uuid not null references public.children(id) on delete cascade,
  skill_id text not null references public.skills(id),
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  completed_missions integer not null default 0 check (completed_missions >= 0),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (child_id, skill_id)
);

create table public.badges (
  id text primary key,
  title jsonb not null,
  description jsonb not null,
  icon_key text not null,
  unlock_rule jsonb not null,
  is_active boolean not null default true
);

create table public.child_badges (
  child_id uuid not null references public.children(id) on delete cascade,
  badge_id text not null references public.badges(id),
  unlocked_at timestamptz not null default now(),
  primary key (child_id, badge_id)
);

create table public.parent_settings (
  parent_id uuid primary key references public.parent_profiles(id) on delete cascade,
  language text not null default 'en' check (language in ('en', 'ar')),
  notifications_enabled boolean not null default true,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'family')),
  updated_at timestamptz not null default now()
);

create or replace function public.owns_child(target_child_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.children c where c.id = target_child_id and c.parent_id = auth.uid()) $$;

alter table public.parent_profiles enable row level security;
alter table public.children enable row level security;
alter table public.skills enable row level security;
alter table public.missions enable row level security;
alter table public.child_skill_preferences enable row level security;
alter table public.mission_assignments enable row level security;
alter table public.mission_attempts enable row level security;
alter table public.skill_progress enable row level security;
alter table public.badges enable row level security;
alter table public.child_badges enable row level security;
alter table public.parent_settings enable row level security;

create policy parent_profile_self on public.parent_profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy children_owned on public.children for all to authenticated using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy skills_read on public.skills for select to authenticated using (is_active);
create policy missions_read on public.missions for select to authenticated using (is_published);
create policy preferences_owned on public.child_skill_preferences for all to authenticated using (public.owns_child(child_id)) with check (public.owns_child(child_id));
create policy assignments_owned on public.mission_assignments for all to authenticated using (public.owns_child(child_id)) with check (public.owns_child(child_id));
create policy attempts_owned on public.mission_attempts for select to authenticated using (public.owns_child(child_id));
create policy progress_owned on public.skill_progress for select to authenticated using (public.owns_child(child_id));
create policy badges_read on public.badges for select to authenticated using (is_active);
create policy child_badges_owned on public.child_badges for select to authenticated using (public.owns_child(child_id));
create policy settings_self on public.parent_settings for all to authenticated using (parent_id = auth.uid()) with check (parent_id = auth.uid());

grant select, insert, update, delete on public.parent_profiles, public.children, public.child_skill_preferences, public.mission_assignments, public.parent_settings to authenticated;
grant select on public.skills, public.missions, public.badges, public.mission_attempts, public.skill_progress, public.child_badges to authenticated;

create or replace function public.complete_mission(
  p_child_id uuid, p_mission_id text, p_idempotency_key uuid, p_answers jsonb, p_score_percent integer
) returns table(attempt_id uuid, xp_earned integer, was_duplicate boolean)
language plpgsql security definer set search_path = public as $$
declare
  v_attempt public.mission_attempts%rowtype;
  v_reward integer;
  v_skill_id text;
begin
  if not public.owns_child(p_child_id) then raise exception 'not authorized' using errcode = '42501'; end if;
  if p_score_percent not between 0 and 100 then raise exception 'invalid score' using errcode = '22023'; end if;

  select * into v_attempt from public.mission_attempts where child_id = p_child_id and (mission_id = p_mission_id or idempotency_key = p_idempotency_key) limit 1;
  if found then return query select v_attempt.id, v_attempt.xp_earned, true; return; end if;

  select m.skill_id, round(m.xp_reward * case when p_score_percent >= 80 then 1.0 when p_score_percent >= 50 then 0.85 else 0.70 end)::integer
    into v_skill_id, v_reward from public.missions m where m.id = p_mission_id and m.is_published;
  if v_skill_id is null then raise exception 'mission not found' using errcode = 'P0002'; end if;

  insert into public.mission_attempts(child_id, mission_id, idempotency_key, answers, score_percent, xp_earned)
    values (p_child_id, p_mission_id, p_idempotency_key, coalesce(p_answers, '[]'::jsonb), p_score_percent, v_reward)
    returning * into v_attempt;

  update public.children set xp = xp + v_reward, updated_at = now() where id = p_child_id;
  insert into public.skill_progress(child_id, skill_id, xp, level, completed_missions, progress_percent)
    values (p_child_id, v_skill_id, v_reward, floor(v_reward / 250.0)::integer + 1, 1, round((v_reward % 250) / 250.0 * 100))
  on conflict (child_id, skill_id) do update set
    xp = public.skill_progress.xp + excluded.xp,
    level = floor((public.skill_progress.xp + excluded.xp) / 250.0)::integer + 1,
    completed_missions = public.skill_progress.completed_missions + 1,
    progress_percent = round(((public.skill_progress.xp + excluded.xp) % 250) / 250.0 * 100), updated_at = now();
  update public.mission_assignments set status = 'completed' where child_id = p_child_id and mission_id = p_mission_id;

  insert into public.child_badges(child_id, badge_id)
  select p_child_id, b.id from public.badges b
  where b.is_active and (
    (b.unlock_rule->>'type' = 'total-missions' and
      (select count(*) from public.mission_attempts a where a.child_id = p_child_id) >= (b.unlock_rule->>'count')::integer)
    or
    (b.unlock_rule->>'type' = 'skill-missions' and b.unlock_rule->>'skillId' = v_skill_id and
      (select count(*) from public.mission_attempts a join public.missions m on m.id = a.mission_id where a.child_id = p_child_id and m.skill_id = v_skill_id) >= (b.unlock_rule->>'count')::integer)
  ) on conflict do nothing;

  return query select v_attempt.id, v_reward, false;
end $$;

revoke all on function public.complete_mission(uuid, text, uuid, jsonb, integer) from public;
grant execute on function public.complete_mission(uuid, text, uuid, jsonb, integer) to authenticated;

commit;
