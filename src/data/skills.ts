import type { SkillDefinition } from '@/features/skills/types';
const allAges = ['4-6', '7-9', '10-12'] as const;
export const skills: SkillDefinition[] = ([
  ['money', 'Money', 'المال', 'Practice saving, spending, and planning.', 'تدرّب على التوفير والإنفاق والتخطيط.', 'wallet'],
  ['responsibility', 'Responsibility', 'المسؤولية', 'Follow through and care for shared things.', 'التزم بمهامك واعتنِ بالأشياء المشتركة.', 'star'],
  ['internet-safety', 'Internet Safety', 'الأمان على الإنترنت', 'Make safer choices online.', 'اتخذ قرارات أكثر أمانًا على الإنترنت.', 'shield'],
  ['emotions', 'Emotions', 'المشاعر', 'Notice, name, and manage feelings.', 'لاحظ المشاعر وسمّها وتعامل معها.', 'heart'],
  ['communication', 'Communication', 'التواصل', 'Speak clearly and listen with care.', 'تحدث بوضوح واستمع باهتمام.', 'chat'],
  ['time-management', 'Time Management', 'إدارة الوقت', 'Plan time and choose priorities.', 'خطط لوقتك واختر أولوياتك.', 'clock'],
  ['health', 'Health Habits', 'العادات الصحية', 'Build everyday healthy routines.', 'كوّن عادات يومية صحية.', 'leaf'],
  ['problem-solving', 'Problem Solving', 'حل المشكلات', 'Pause, explore, and test solutions.', 'توقف وفكر وجرّب الحلول.', 'puzzle'],
  ['social-skills', 'Social Skills', 'المهارات الاجتماعية', 'Cooperate and understand others.', 'تعاون وافهم الآخرين.', 'people'],
  ['independence', 'Independence', 'الاعتماد على النفس', 'Practice safe, capable independence.', 'تدرّب على الاستقلال الآمن.', 'compass'],
] as const).map(([id, enTitle, arTitle, enDescription, arDescription, iconKey], index) => ({
  id, slug: id, title: { en: enTitle, ar: arTitle }, shortDescription: { en: enDescription, ar: arDescription }, iconKey, levels: 10,
  ageAvailability: [...allAges], comingSoon: index > 7,
}));
