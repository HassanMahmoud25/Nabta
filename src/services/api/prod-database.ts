import * as Crypto from 'expo-crypto';
import { z } from 'zod';
import type { ChildProfile, ChildProfileInput, CreateChildInput } from '@/features/children/types';
import type { SkillProgress } from '@/features/progress/types';
import type { CompleteMissionInput, CompleteMissionResult, MissionCompletion } from './contracts';
import { scoreMission } from '@/features/missions/scoring';
import { getSupabaseClient } from '@/services/supabase/client';

const childRowSchema = z.object({ id: z.string(), parent_id: z.string(), nickname: z.string(), age_band: z.enum(['4-6', '7-9', '10-12']), avatar_key: z.string(), goals: z.array(z.string()).default([]), xp: z.number(), created_at: z.string(), updated_at: z.string() });
const preferenceSchema = z.object({ child_id: z.string(), skill_id: z.string() });
const progressSchema = z.object({ child_id: z.string(), skill_id: z.string(), xp: z.number(), level: z.number(), completed_missions: z.number(), progress_percent: z.number() });
const attemptSchema = z.object({ child_id: z.string(), mission_id: z.string(), score_percent: z.number(), xp_earned: z.number(), completed_at: z.string(), missions: z.object({ skill_id: z.string() }).nullable().optional() });

function mapChild(row: z.infer<typeof childRowSchema>, selectedSkills: string[]): ChildProfile { return { id: row.id, parentId: row.parent_id, nickname: row.nickname, ageBand: row.age_band, avatarKey: row.avatar_key, goals: row.goals, xp: row.xp, selectedSkills, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapProgress(row: z.infer<typeof progressSchema>): SkillProgress { return { childId: row.child_id, skillId: row.skill_id, xp: row.xp, level: row.level, completedMissions: row.completed_missions, progressPercent: row.progress_percent }; }

export const prodDatabase = {
  async listChildren(parentId: string) {
    const client = getSupabaseClient();
    const [{ data: childData, error: childError }, { data: preferenceData, error: preferenceError }] = await Promise.all([
      client.from('children').select('*').eq('parent_id', parentId).order('created_at'),
      client.from('child_skill_preferences').select('child_id, skill_id'),
    ]);
    if (childError) throw childError; if (preferenceError) throw preferenceError;
    const children = z.array(childRowSchema).parse(childData ?? []); const preferences = z.array(preferenceSchema).parse(preferenceData ?? []);
    return children.map((child) => mapChild(child, preferences.filter((item) => item.child_id === child.id).map((item) => item.skill_id)));
  },
  async getChild(childId: string) {
    const client = getSupabaseClient(); const { data, error } = await client.from('children').select('*').eq('id', childId).maybeSingle(); if (error) throw error; if (!data) return null;
    const { data: preferences, error: preferencesError } = await client.from('child_skill_preferences').select('child_id, skill_id').eq('child_id', childId); if (preferencesError) throw preferencesError;
    return mapChild(childRowSchema.parse(data), z.array(preferenceSchema).parse(preferences ?? []).map((item) => item.skill_id));
  },
  async createChild(input: CreateChildInput) {
    const client = getSupabaseClient();
    const { data, error } = await client.rpc('create_child_profile', { p_nickname: input.nickname, p_age_band: input.ageBand, p_avatar_key: input.avatarKey, p_goals: input.goals, p_skill_ids: input.selectedSkills }); if (error) throw error;
    const childId = z.string().uuid().parse(data); const child = await this.getChild(childId);
    if (!child || child.parentId !== input.parentId) throw new Error('Child profile not found.'); return child;
  },
  async updateChild(parentId: string, childId: string, input: ChildProfileInput) {
    const client = getSupabaseClient(); const { error } = await client.rpc('update_child_profile', { p_child_id: childId, p_nickname: input.nickname, p_age_band: input.ageBand, p_avatar_key: input.avatarKey, p_goals: input.goals, p_skill_ids: input.selectedSkills }); if (error) throw error;
    const child = await this.getChild(childId); if (!child || child.parentId !== parentId) throw new Error('Child profile not found.'); return child;
  },
  async deleteChild(_parentId: string, childId: string) { const { error } = await getSupabaseClient().rpc('delete_child_profile', { p_child_id: childId }); if (error) throw error; },
  async getProgress(childId: string) { const { data, error } = await getSupabaseClient().from('skill_progress').select('*').eq('child_id', childId); if (error) throw error; return z.array(progressSchema).parse(data ?? []).map(mapProgress); },
  async getCompletions(childId: string): Promise<MissionCompletion[]> {
    const { data, error } = await getSupabaseClient().from('mission_attempts').select('child_id, mission_id, score_percent, xp_earned, completed_at, missions(skill_id)').eq('child_id', childId).order('completed_at', { ascending: false }); if (error) throw error;
    return z.array(attemptSchema).parse(data ?? []).map((row) => ({ childId: row.child_id, missionId: row.mission_id, skillId: row.missions?.skill_id ?? '', completedAt: row.completed_at, xpEarned: row.xp_earned, scorePercent: row.score_percent }));
  },
  async getBadges(childId: string) { const { data, error } = await getSupabaseClient().from('child_badges').select('badge_id').eq('child_id', childId); if (error) throw error; return z.array(z.object({ badge_id: z.string() })).parse(data ?? []).map((row) => row.badge_id); },
  async completeMission(input: CompleteMissionInput): Promise<CompleteMissionResult> {
    const score = scoreMission(input.mission, input.answers); const idempotencyKey = Crypto.randomUUID();
    const { data, error } = await getSupabaseClient().rpc('complete_mission', { p_child_id: input.childId, p_mission_id: input.mission.id, p_idempotency_key: idempotencyKey, p_answers: input.answers, p_score_percent: score.percent }); if (error) throw error;
    const result = z.array(z.object({ attempt_id: z.string(), xp_earned: z.number(), was_duplicate: z.boolean() })).parse(data); const row = result[0]; if (!row) throw new Error('Mission completion returned no result.');
    return { completion: { childId: input.childId, missionId: input.mission.id, skillId: input.mission.skillId, completedAt: new Date().toISOString(), xpEarned: row.xp_earned, scorePercent: score.percent }, newBadgeIds: [], duplicate: row.was_duplicate };
  },
};
