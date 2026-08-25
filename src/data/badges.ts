import type { BadgeDefinition } from '@/features/rewards/types';
export const badges: BadgeDefinition[] = [
  { id: 'smart-saver', title: { en: 'Smart Saver', ar: 'المدخر الذكي' }, description: { en: 'Complete a Money mission.', ar: 'أكمل مهمة عن المال.' }, icon: 'money', rule: { type: 'skill-missions', skillId: 'money', count: 1 } },
  { id: 'digital-defender', title: { en: 'Digital Defender', ar: 'حامي الإنترنت' }, description: { en: 'Complete an Internet Safety mission.', ar: 'أكمل مهمة عن أمان الإنترنت.' }, icon: 'safety', rule: { type: 'skill-missions', skillId: 'internet-safety', count: 1 } },
  { id: 'great-teammate', title: { en: 'Great Teammate', ar: 'زميل رائع' }, description: { en: 'Complete three missions.', ar: 'أكمل ثلاث مهمات.' }, icon: 'social', rule: { type: 'total-missions', count: 3 } },
  { id: 'problem-solver', title: { en: 'Problem Solver', ar: 'حلّال المشكلات' }, description: { en: 'Complete a Problem Solving mission.', ar: 'أكمل مهمة في حل المشكلات.' }, icon: 'problem', rule: { type: 'skill-missions', skillId: 'problem-solving', count: 1 } },
  { id: 'responsibility-star', title: { en: 'Responsibility Star', ar: 'نجم المسؤولية' }, description: { en: 'Complete a Responsibility mission.', ar: 'أكمل مهمة عن المسؤولية.' }, icon: 'responsibility', rule: { type: 'skill-missions', skillId: 'responsibility', count: 1 } },
];
