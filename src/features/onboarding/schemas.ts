import { z } from "zod";
export const nicknameSchema = z
  .string()
  .trim()
  .min(2, "Use at least 2 characters.")
  .max(20, "Use 20 characters or fewer.");
export const pinSchema = z
  .string()
  .regex(/^\d{4}$/, "Enter exactly four digits.");
