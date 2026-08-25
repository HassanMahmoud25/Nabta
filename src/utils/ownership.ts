import type { ChildProfile } from '@/features/children/types';
export function parentOwnsChild(parentId: string, child: Pick<ChildProfile, 'parentId'>) { return Boolean(parentId) && child.parentId === parentId; }
