begin;

create or replace function public.create_child_profile(
  p_nickname text,
  p_age_band text,
  p_avatar_key text,
  p_goals jsonb,
  p_skill_ids text[]
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_child_id uuid;
  v_skill_id text;
  v_priority integer := 0;
begin
  if auth.uid() is null then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if char_length(trim(p_nickname)) not between 2 and 20 or p_age_band not in ('4-6', '7-9', '10-12') then
    raise exception 'invalid child profile' using errcode = '22023';
  end if;
  if coalesce(array_length(p_skill_ids, 1), 0) = 0 then
    raise exception 'at least one skill is required' using errcode = '22023';
  end if;

  insert into public.parent_profiles(id, onboarding_completed)
    values (auth.uid(), true)
    on conflict (id) do update set onboarding_completed = true, updated_at = now();
  insert into public.children(parent_id, nickname, age_band, avatar_key, goals)
    values (auth.uid(), trim(p_nickname), p_age_band, p_avatar_key, coalesce(p_goals, '[]'::jsonb))
    returning id into v_child_id;

  foreach v_skill_id in array p_skill_ids loop
    v_priority := v_priority + 1;
    insert into public.child_skill_preferences(child_id, skill_id, priority)
      values (v_child_id, v_skill_id, least(v_priority, 5));
    insert into public.skill_progress(child_id, skill_id) values (v_child_id, v_skill_id);
  end loop;
  return v_child_id;
end $$;

create or replace function public.update_child_profile(
  p_child_id uuid,
  p_nickname text,
  p_age_band text,
  p_avatar_key text,
  p_goals jsonb,
  p_skill_ids text[]
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_skill_id text;
  v_priority integer := 0;
begin
  if not public.owns_child(p_child_id) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if char_length(trim(p_nickname)) not between 2 and 20 or p_age_band not in ('4-6', '7-9', '10-12') then
    raise exception 'invalid child profile' using errcode = '22023';
  end if;
  if coalesce(array_length(p_skill_ids, 1), 0) = 0 then
    raise exception 'at least one skill is required' using errcode = '22023';
  end if;

  update public.children set nickname = trim(p_nickname), age_band = p_age_band, avatar_key = p_avatar_key,
    goals = coalesce(p_goals, '[]'::jsonb), updated_at = now() where id = p_child_id;

  delete from public.child_skill_preferences where child_id = p_child_id and not (skill_id = any(p_skill_ids));
  foreach v_skill_id in array p_skill_ids loop
    v_priority := v_priority + 1;
    insert into public.child_skill_preferences(child_id, skill_id, priority)
      values (p_child_id, v_skill_id, least(v_priority, 5))
      on conflict (child_id, skill_id) do update set priority = excluded.priority;
    insert into public.skill_progress(child_id, skill_id) values (p_child_id, v_skill_id) on conflict do nothing;
  end loop;
end $$;

create or replace function public.delete_child_profile(p_child_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.owns_child(p_child_id) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  delete from public.children where id = p_child_id;
end $$;

revoke all on function public.update_child_profile(uuid, text, text, text, jsonb, text[]) from public;
revoke all on function public.delete_child_profile(uuid) from public;
revoke all on function public.create_child_profile(text, text, text, jsonb, text[]) from public;
grant execute on function public.create_child_profile(text, text, text, jsonb, text[]) to authenticated;
grant execute on function public.update_child_profile(uuid, text, text, text, jsonb, text[]) to authenticated;
grant execute on function public.delete_child_profile(uuid) to authenticated;

commit;
