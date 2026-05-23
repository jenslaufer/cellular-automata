export const WOLFRAM_CLASSES = [
  {
    id: "class-1",
    label: "Class I",
    name: "Uniformity",
    description:
      "Rules that evolve to a uniform, homogeneous state. Almost all initial conditions produce the same stable end state.",
    rules: [
      0, 8, 32, 40, 128, 136, 160, 168, 2, 10, 34, 42, 130, 138, 162, 170, 4, 12, 36, 44, 132,
      140, 164, 172, 6, 14, 38, 46, 134, 142, 166, 174, 200, 204, 232, 235, 236, 238,
    ],
  },
  {
    id: "class-2",
    label: "Class II",
    name: "Periodicity",
    description:
      "Rules that produce repeating or stable periodic patterns. Small changes to the initial state have only local effects.",
    rules: [
      1, 3, 5, 9, 11, 13, 15, 19, 23, 25, 27, 28, 29, 33, 35, 37, 41, 43, 50, 51, 57, 58, 72, 73,
      74, 76, 77, 78, 94, 104, 108, 130, 178, 184, 188, 190, 194, 196, 198, 218, 232,
    ],
  },
  {
    id: "class-3",
    label: "Class III",
    name: "Chaos",
    description:
      "Rules that produce chaotic, pseudo-random patterns. Small changes in initial conditions lead to very different outcomes.",
    rules: [
      18, 22, 30, 45, 60, 75, 86, 89, 90, 101, 105, 106, 109, 120, 121, 122, 126, 129, 135, 146,
      149, 150, 151, 153, 154, 161, 165, 182, 195, 210, 225,
    ],
  },
  {
    id: "class-4",
    label: "Class IV",
    name: "Complexity",
    description:
      "Rules that produce complex, localized structures capable of long-range interactions. Associated with universal computation.",
    rules: [54, 62, 110, 137, 147, 193],
  },
];

export function classForRule(rule) {
  for (const cls of WOLFRAM_CLASSES) {
    if (cls.rules.includes(rule)) {
      return cls.id;
    }
  }
  return null;
}
