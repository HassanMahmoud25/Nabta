import { missions } from "@/data/missions";
import { missionSchema } from "@/features/missions/schemas";
describe("mission content validation", () => {
  test("all curated missions satisfy the discriminated schema", () => {
    for (const mission of missions)
      expect(missionSchema.safeParse(mission).success).toBe(true);
  });
  test("provides three age-specific missions for every polished skill", () => {
    for (const skillId of [
      "money",
      "responsibility",
      "internet-safety",
      "emotions",
      "problem-solving",
    ]) {
      const content = missions.filter((mission) => mission.skillId === skillId);
      expect(content).toHaveLength(3);
      expect(new Set(content.flatMap((mission) => mission.ageBands)).size).toBe(
        3,
      );
    }
  });
});
