import { useQuery } from '@tanstack/react-query'; import { queryKeys } from '@/services/api/query-keys'; import { dashboardService } from './dashboard-service';
export function useDashboard(childId: string | null) { return useQuery({ queryKey: childId ? queryKeys.dashboard(childId) : ['dashboard', 'disabled'], queryFn: () => dashboardService.get(childId!), enabled: Boolean(childId) }); }

