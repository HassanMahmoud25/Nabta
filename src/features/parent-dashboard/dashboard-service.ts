import { devDatabase } from '@/services/api/dev-database';
import { prodDatabase } from '@/services/api/prod-database';
import { env } from '@/config/env';
import type { DashboardData } from '@/services/api/contracts';
export const dashboardService = {
  async get(childId: string): Promise<DashboardData | null> {
    const database = env.useDevFixtures || !env.hasSupabaseConfig ? devDatabase : prodDatabase;
    const child = await database.getChild(childId); if (!child) return null;
    const progress = await database.getProgress(childId); const recentMissions = await database.getCompletions(childId);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const sorted = [...progress].sort((a, b) => b.progressPercent - a.progressPercent);
    return { child, totalXp: child.xp, weeklyMissions: recentMissions.filter((item) => new Date(item.completedAt).getTime() >= weekAgo).length, progress, recentMissions: recentMissions.slice(0, 5), strongest: sorted.slice(0, 2), needsPractice: [...sorted].reverse().slice(0, 2) };
  },
};
