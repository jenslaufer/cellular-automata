import { describe, expect, it } from "vitest";
import { WOLFRAM_CLASSES, classForRule } from "../src/composables/useWolframClasses.js";

describe("WOLFRAM_CLASSES structure", () => {
  it("has exactly 4 classes", () => {
    expect(WOLFRAM_CLASSES).toHaveLength(4);
  });

  it("all 4 classes have non-empty rules arrays", () => {
    for (const cls of WOLFRAM_CLASSES) {
      expect(Array.isArray(cls.rules)).toBe(true);
      expect(cls.rules.length).toBeGreaterThan(0);
    }
  });

  it("all 4 classes have non-empty description strings", () => {
    for (const cls of WOLFRAM_CLASSES) {
      expect(typeof cls.description).toBe("string");
      expect(cls.description.length).toBeGreaterThan(0);
    }
  });

  it("class ids are class-1 through class-4", () => {
    const ids = WOLFRAM_CLASSES.map((c) => c.id);
    expect(ids).toEqual(["class-1", "class-2", "class-3", "class-4"]);
  });

  it("class labels are Class I through Class IV", () => {
    const labels = WOLFRAM_CLASSES.map((c) => c.label);
    expect(labels).toEqual(["Class I", "Class II", "Class III", "Class IV"]);
  });
});

describe("classForRule", () => {
  it("returns class-1 for rule 0", () => {
    expect(classForRule(0)).toBe("class-1");
  });

  it("returns class-3 for rule 30", () => {
    expect(classForRule(30)).toBe("class-3");
  });

  it("returns class-4 for rule 110", () => {
    expect(classForRule(110)).toBe("class-4");
  });

  it("returns class-3 for rule 90", () => {
    expect(classForRule(90)).toBe("class-3");
  });

  it("returns null for rule 7 (unmapped rule)", () => {
    expect(classForRule(7)).toBeNull();
  });
});
