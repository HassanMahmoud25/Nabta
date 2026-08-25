import { missions } from "@/data/missions";
import type { ChildProfile } from "@/features/children/types";
import { selectNextMission } from "@/features/learning-path/learning-path-service";
const child: ChildProfile = {
  id: "child",
  parentId: "parent",
  nickname: "Omar",
  ageBand: "7-9",
  avatarKey: "explorer",
  selectedSkills: ["money", "responsibility"],
  goals: [],
  xp: 0,
  createdAt: "2026-08-24T00:00:00.000Z",
  updatedAt: "2026-08-24T00:00:00.000Z",
};
describe("LearningPathService", () => {
  test("filters by age and selected skills", () => {
    const next = selectNextMission({
      child,
      missions,
      progress: [],
      completedMissionIds: [],
    });
    expect(next?.ageBands).toContain("7-9");
    expect(child.selectedSkills).toContain(next?.skillId);
  });
  test("avoids repeating the recent skill when an alternative is equal", () => {
    const next = selectNextMission({
      child,
      missions,
      progress: [],
      completedMissionIds: [],
      recentSkillId: "money",
    });
    expect(next?.skillId).toBe("responsibility");
  });
  test("never returns completed missions", () => {
    const first = selectNextMission({
      child,
      missions,
      progress: [],
      completedMissionIds: [],
    });
    const next = selectNextMission({
      child,
      missions,
      progress: [],
      completedMissionIds: first ? [first.id] : [],
    });
    expect(next?.id).not.toBe(first?.id);
  });
});
