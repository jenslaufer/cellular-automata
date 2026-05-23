import { describe, expect, it } from "vitest";
import { makeInitial, nextGeneration, ruleToBits } from "./useAutomaton.js";

describe("ruleToBits", () => {
  it("decodes 30 as 00011110 (LSB first)", () => {
    expect(Array.from(ruleToBits(30))).toEqual([0, 1, 1, 1, 1, 0, 0, 0]);
  });

  it("decodes 0 as all zeros", () => {
    expect(Array.from(ruleToBits(0))).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("decodes 255 as all ones", () => {
    expect(Array.from(ruleToBits(255))).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
  });
});

describe("nextGeneration", () => {
  it("rule 90 (XOR) on single center cell produces Sierpinski row 1", () => {
    const bits = ruleToBits(90);
    const row = makeInitial(7, "single");
    expect(Array.from(row)).toEqual([0, 0, 0, 1, 0, 0, 0]);
    const next = nextGeneration(row, bits);
    expect(Array.from(next)).toEqual([0, 0, 1, 0, 1, 0, 0]);
  });

  it("rule 0 collapses everything to zero", () => {
    const bits = ruleToBits(0);
    const row = makeInitial(5, "random");
    const next = nextGeneration(row, bits);
    expect(Array.from(next)).toEqual([0, 0, 0, 0, 0]);
  });

  it("rule 255 fills with ones", () => {
    const bits = ruleToBits(255);
    const row = makeInitial(5, "single");
    const next = nextGeneration(row, bits);
    expect(Array.from(next)).toEqual([1, 1, 1, 1, 1]);
  });

  it("wraps toroidally", () => {
    const bits = ruleToBits(90);
    const row = new Uint8Array([1, 0, 0, 0, 0]);
    const next = nextGeneration(row, bits);
    // neighbors of cell 0: left=row[4]=0, center=1, right=0 → triplet 010 → bit 2 of rule 90 = 0
    // neighbors of cell 4: left=0, center=0, right=row[0]=1 → triplet 001 → bit 1 of rule 90 = 1
    expect(next[0]).toBe(0);
    expect(next[4]).toBe(1);
    expect(next[1]).toBe(1);
  });
});

describe("makeInitial", () => {
  it("places single cell at center", () => {
    const row = makeInitial(11, "single");
    expect(row[5]).toBe(1);
    expect(row.reduce((a, b) => a + b, 0)).toBe(1);
  });

  it("left mode places cell at index 0", () => {
    const row = makeInitial(5, "left");
    expect(row[0]).toBe(1);
    expect(row.reduce((a, b) => a + b, 0)).toBe(1);
  });

  it("random mode produces a row of the right length", () => {
    const row = makeInitial(100, "random");
    expect(row.length).toBe(100);
  });
});
