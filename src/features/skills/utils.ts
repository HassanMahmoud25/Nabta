import { skills } from '@/data/skills';
export function getSkill(skillId: string) { return skills.find((skill) => skill.id === skillId); }

