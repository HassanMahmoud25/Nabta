import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/query-keys';
import { useAppStore } from '@/stores/app-store';
import { analytics } from '@/services/analytics/analytics';
import { childrenService } from './children-service';
import type { ChildProfileInput, CreateChildInput } from './types';

export function useChildren(parentId: string | undefined) { return useQuery({ queryKey: parentId ? queryKeys.children(parentId) : ['children', 'disabled'], queryFn: () => childrenService.list(parentId!), enabled: Boolean(parentId) }); }
export function useChild(childId: string | null) { return useQuery({ queryKey: childId ? queryKeys.child(childId) : ['child', 'disabled'], queryFn: () => childrenService.get(childId!), enabled: Boolean(childId) }); }

export function useReconciledChildren(parentId: string | undefined) {
  const query = useChildren(parentId); const activeChildId = useAppStore((state) => state.activeChildId); const activeParentId = useAppStore((state) => state.activeParentId); const reconcile = useAppStore((state) => state.reconcileActiveChild);
  useEffect(() => { if (parentId && query.data) reconcile(parentId, query.data.map((child) => child.id)); }, [parentId, query.data, reconcile]);
  return { ...query, activeChildId: activeParentId === parentId && query.data?.some((child) => child.id === activeChildId) ? activeChildId : null };
}

export function useCreateChild(parentId: string) { const client = useQueryClient(); const setActive = useAppStore((state) => state.setActiveChild); return useMutation({ mutationFn: (input: Omit<CreateChildInput, 'parentId'>) => childrenService.create({ ...input, parentId }), onSuccess: async (child) => { client.setQueryData(queryKeys.child(child.id), child); await client.invalidateQueries({ queryKey: queryKeys.children(parentId) }); setActive(child.id, parentId); analytics.track('child_added', { childId: child.id, ageBand: child.ageBand, skillCount: child.selectedSkills.length }); } }); }

export function useUpdateChild(parentId: string, childId: string) { const client = useQueryClient(); return useMutation({ mutationFn: (input: ChildProfileInput) => childrenService.update(parentId, childId, input), onSuccess: async (child) => { client.setQueryData(queryKeys.child(childId), child); await Promise.all([queryKeys.children(parentId), queryKeys.dashboard(childId), queryKeys.progress(childId), queryKeys.todayMission(childId), queryKeys.rewards(childId)].map((queryKey) => client.invalidateQueries({ queryKey }))); analytics.track('child_updated', { childId, ageBand: child.ageBand, skillCount: child.selectedSkills.length }); } }); }

export function useDeleteChild(parentId: string) { const client = useQueryClient(); const reconcile = useAppStore((state) => state.reconcileActiveChild); return useMutation({ mutationFn: (childId: string) => childrenService.delete(parentId, childId).then(() => childId), onSuccess: async (childId) => { client.removeQueries({ predicate: (query) => query.queryKey.includes(childId) }); await client.invalidateQueries({ queryKey: queryKeys.children(parentId) }); const children = await client.fetchQuery({ queryKey: queryKeys.children(parentId), queryFn: () => childrenService.list(parentId) }); reconcile(parentId, children.map((child) => child.id)); analytics.track('child_deleted', { childId, remainingChildren: children.length }); } }); }
