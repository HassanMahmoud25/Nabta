import type { Mission, MissionAnswer } from "./types";
export type MissionScore = {
  earned: number;
  possible: number;
  percent: number;
};
export function scoreMission(
  mission: Mission,
  answers: MissionAnswer[],
): MissionScore {
  let earned = 0;
  let possible = 0;
  for (const step of mission.steps) {
    if (step.type === "parent-activity") {
      possible += 1;
      if (answers.some((answer) => answer.stepId === step.id)) earned += 1;
      continue;
    }
    if (step.type === "ordering") {
      possible += step.correctOrder.length;
      const answer = answers.find((item) => item.stepId === step.id);
      answer?.optionIds.forEach((id, index) => {
        if (id === step.correctOrder[index]) earned += 1;
      });
      continue;
    }
    const maximum = Math.max(...step.options.map((option) => option.score));
    possible += maximum;
    const selectedIds =
      answers.find((item) => item.stepId === step.id)?.optionIds ?? [];
    earned += step.options
      .filter((option) => selectedIds.includes(option.id))
      .reduce((total, option) => total + option.score, 0);
  }
  return {
    earned,
    possible,
    percent: possible === 0 ? 0 : Math.round((earned / possible) * 100),
  };
}
