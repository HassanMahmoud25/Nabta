import { devDatabase } from '@/services/api/dev-database';
import { prodDatabase } from '@/services/api/prod-database';
import { env } from '@/config/env';
import type { ChildProfileInput, CreateChildInput } from './types';
export const childrenService = {
  async list(parentId: string) { return env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase.listChildren(parentId) : prodDatabase.listChildren(parentId); },
  async get(childId: string) { return env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase.getChild(childId) : prodDatabase.getChild(childId); },
  async create(input: CreateChildInput) { return env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase.createChild(input) : prodDatabase.createChild(input); },
  async update(parentId: string, childId: string, input: ChildProfileInput) { return env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase.updateChild(parentId, childId, input) : prodDatabase.updateChild(parentId, childId, input); },
  async delete(parentId: string, childId: string) { return env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase.deleteChild(parentId, childId) : prodDatabase.deleteChild(parentId, childId); },
};
