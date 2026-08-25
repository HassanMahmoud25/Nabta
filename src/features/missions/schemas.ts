import { z } from 'zod';
const localizedTextSchema = z.object({ en: z.string().min(1), ar: z.string().min(1) });
const optionSchema = z.object({ id: z.string().min(1), label: localizedTextSchema, feedback: localizedTextSchema, score: z.number().min(0) });
const stepSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('scenario-choice'), scenario: localizedTextSchema, illustrationKey: z.string().optional(), options: z.array(optionSchema).min(2) }),
  z.object({ id: z.string(), type: z.literal('multiple-choice'), prompt: localizedTextSchema, options: z.array(optionSchema).min(2), allowMultiple: z.boolean().optional() }),
  z.object({ id: z.string(), type: z.literal('ordering'), prompt: localizedTextSchema, items: z.array(z.object({ id: z.string(), label: localizedTextSchema })).min(2), correctOrder: z.array(z.string()).min(2), feedback: localizedTextSchema }),
  z.object({ id: z.string(), type: z.literal('parent-activity'), prompt: localizedTextSchema, instructions: localizedTextSchema, completionLabel: localizedTextSchema }),
]);
export const missionSchema = z.object({
  id: z.string().min(1), skillId: z.string().min(1), ageBands: z.array(z.enum(['4-6', '7-9', '10-12'])).min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]), title: localizedTextSchema,
  description: localizedTextSchema, estimatedMinutes: z.number().int().positive(), xpReward: z.number().int().positive(), steps: z.array(stepSchema).min(1),
});

