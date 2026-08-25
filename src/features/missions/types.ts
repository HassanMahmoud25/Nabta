import type { AgeBand, LocalizedText } from "@/types/common";

export type ChoiceOption = {
  id: string;
  label: LocalizedText;
  feedback: LocalizedText;
  score: number;
};
export type ScenarioChoiceStep = {
  id: string;
  type: "scenario-choice";
  scenario: LocalizedText;
  illustrationKey?: string;
  options: ChoiceOption[];
};
export type MultipleChoiceStep = {
  id: string;
  type: "multiple-choice";
  prompt: LocalizedText;
  options: ChoiceOption[];
  allowMultiple?: boolean;
};
export type OrderingItem = { id: string; label: LocalizedText };
export type OrderingStep = {
  id: string;
  type: "ordering";
  prompt: LocalizedText;
  items: OrderingItem[];
  correctOrder: string[];
  feedback: LocalizedText;
};
export type ParentActivityStep = {
  id: string;
  type: "parent-activity";
  prompt: LocalizedText;
  instructions: LocalizedText;
  completionLabel: LocalizedText;
};
export type MissionStep =
  | ScenarioChoiceStep
  | MultipleChoiceStep
  | OrderingStep
  | ParentActivityStep;

export type Mission = {
  id: string;
  skillId: string;
  ageBands: AgeBand[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  title: LocalizedText;
  description: LocalizedText;
  estimatedMinutes: number;
  xpReward: number;
  steps: MissionStep[];
};

export type MissionAnswer = { stepId: string; optionIds: string[] };
