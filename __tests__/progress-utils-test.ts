import {
  calculateLevel,
  calculateProgressPercent,
  calculateXpReward,
} from "@/features/progress/progress-utils";
describe("progress utilities", () => {
  test("calculates levels at stable 250 XP boundaries", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(249)).toBe(1);
    expect(calculateLevel(250)).toBe(2);
  });
  test("calculates progress within the current level", () => {
    expect(calculateProgressPercent(125)).toBe(50);
    expect(calculateProgressPercent(250)).toBe(0);
  });
  test("keeps reward positive while reflecting thoughtful scores", () => {
    expect(calculateXpReward(100, 90)).toBe(100);
    expect(calculateXpReward(100, 40)).toBe(70);
  });
});
