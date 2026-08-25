import { parentOwnsChild } from "@/utils/ownership";
describe("parent-child ownership helper", () => {
  test("accepts only the owning parent", () => {
    expect(parentOwnsChild("parent-a", { parentId: "parent-a" })).toBe(true);
    expect(parentOwnsChild("parent-b", { parentId: "parent-a" })).toBe(false);
  });
});
