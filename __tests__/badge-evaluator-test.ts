import { badges } from "@/data/badges";
import { evaluateBadges } from "@/features/rewards/badge-evaluator";
describe("BadgeEvaluator", () => {
  test("unlocks data-driven skill badges", () => {
    const unlocked = evaluateBadges(badges, {
      completedMissionIds: ["m1"],
      completedBySkill: { money: 1 },
    });
    expect(unlocked.map((item) => item.id)).toContain("smart-saver");
  });
  test("does not return an already unlocked badge", () => {
    const unlocked = evaluateBadges(
      badges,
      { completedMissionIds: ["m1"], completedBySkill: { money: 1 } },
      ["smart-saver"],
    );
    expect(unlocked.map((item) => item.id)).not.toContain("smart-saver");
  });
});
