import { create } from 'zustand'; import type { MissionAnswer } from '@/features/missions/types';
type MissionSessionState = { missionId: string | null; currentStep: number; answers: MissionAnswer[]; temporaryScore: number; startedAt: string | null; begin: (missionId: string) => void; answer: (answer: MissionAnswer, score: number) => void; next: () => void; clear: () => void };
export const useMissionSessionStore = create<MissionSessionState>((set) => ({
  missionId: null, currentStep: 0, answers: [], temporaryScore: 0, startedAt: null,
  begin: (missionId) => set((state) => state.missionId === missionId ? state : { missionId, currentStep: 0, answers: [], temporaryScore: 0, startedAt: new Date().toISOString() }),
  answer: (answer, score) => set((state) => ({ answers: [...state.answers.filter((item) => item.stepId !== answer.stepId), answer], temporaryScore: state.temporaryScore + score })),
  next: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  clear: () => set({ missionId: null, currentStep: 0, answers: [], temporaryScore: 0, startedAt: null }),
}));

