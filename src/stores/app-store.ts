import { create } from 'zustand';
import { storage } from '@/services/storage/local-storage';
import type { ExperienceMode } from '@/theme/tokens';

const activeChildKey = (parentId: string) => `nash2.active-child.${parentId}`;
export function selectValidActiveChild(currentId: string | null, persistedId: string | null, childIds: string[]) {
  if (currentId && childIds.includes(currentId)) return currentId;
  if (persistedId && childIds.includes(persistedId)) return persistedId;
  return childIds[0] ?? null;
}

type AppState = {
  activeChildId: string | null;
  activeParentId: string | null;
  switchingToChildId: string | null;
  mode: ExperienceMode;
  reconcileActiveChild: (parentId: string, childIds: string[]) => string | null;
  setActiveChild: (childId: string | null, parentId?: string) => void;
  finishChildSwitch: () => void;
  enterKidsMode: (childId: string, parentId?: string) => void;
  enterParentMode: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  activeChildId: null, activeParentId: null, switchingToChildId: null, mode: 'parent',
  reconcileActiveChild: (parentId, childIds) => {
    const current = get().activeParentId === parentId ? get().activeChildId : null;
    const next = selectValidActiveChild(current, storage.get<string>(activeChildKey(parentId)), childIds);
    if (next) storage.set(activeChildKey(parentId), next); else storage.remove(activeChildKey(parentId));
    set({ activeParentId: parentId, activeChildId: next, switchingToChildId: null }); return next;
  },
  setActiveChild: (activeChildId, parentId) => {
    const ownerId = parentId ?? get().activeParentId; if (ownerId && activeChildId) storage.set(activeChildKey(ownerId), activeChildId); else if (ownerId) storage.remove(activeChildKey(ownerId));
    set((state) => ({ activeChildId, activeParentId: ownerId ?? state.activeParentId, switchingToChildId: activeChildId !== state.activeChildId ? activeChildId : null }));
  },
  finishChildSwitch: () => set({ switchingToChildId: null }),
  enterKidsMode: (activeChildId, parentId) => {
    const ownerId = parentId ?? get().activeParentId; if (ownerId) storage.set(activeChildKey(ownerId), activeChildId);
    set({ activeChildId, activeParentId: ownerId, switchingToChildId: null, mode: 'kids' });
  },
  enterParentMode: () => set({ mode: 'parent' }),
}));
