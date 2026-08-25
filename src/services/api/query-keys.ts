export const queryKeys = {
  auth: ['auth'] as const,
  children: (parentId: string) => ['children', parentId] as const,
  child: (childId: string) => ['children', 'detail', childId] as const,
  todayMission: (childId: string) => ['missions', 'today', childId] as const,
  missionHistory: (childId: string) => ['missions', 'history', childId] as const,
  progress: (childId: string) => ['progress', childId] as const,
  dashboard: (childId: string) => ['dashboard', childId] as const,
  rewards: (childId: string) => ['rewards', childId] as const,
} as const;

