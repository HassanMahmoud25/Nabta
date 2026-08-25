import { missions } from "@/data/missions";
import { scoreMission } from "@/features/missions/scoring";
describe("mission scoring", () => {
  test("scores choices from step data", () => {
    const mission = missions[0]!;
    const answers = mission.steps
      .map((step) => ({ stepId: step.id, optionIds: ["wise", "pause"] }))
      .map((answer, index) => ({
        ...answer,
        optionIds: [index === 0 ? "wise" : "pause"],
      }));
    expect(scoreMission(mission, answers).percent).toBe(100);
  });
});
