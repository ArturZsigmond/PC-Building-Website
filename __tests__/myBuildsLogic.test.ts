import { describe, expect, test } from "@jest/globals";

// A simplified version of sorting logic
const sortBuildsByRam = (builds: any[], sort: string) => {
  if (!sort) return builds;
  return [...builds].sort((a, b) =>
    sort === "16GB"
      ? parseInt(a.ram) - parseInt(b.ram)
      : parseInt(b.ram) - parseInt(a.ram)
  );
};

const builds = [
  { cpu: "Intel", gpu: "RTX 5080", ram: "16GB", case: "case1.jpg", price: 2560 },
  { cpu: "AMD", gpu: "RTX 5090", ram: "32GB", case: "case2.jpg", price: 3225 },
  { cpu: "Intel", gpu: "GTX 690", ram: "16GB", case: "case3.jpg", price: 950 },
];

describe("Sorting and basic logic tests", () => {
  test("sorts by 16GB first (ascending)", () => {
    const sorted = sortBuildsByRam(builds, "16GB");
    expect(sorted[0].ram).toBe("16GB");
  });

  test("sorts by 32GB first (descending)", () => {
    const sorted = sortBuildsByRam(builds, "32GB");
    expect(sorted[0].ram).toBe("32GB");
  });

  test("does not sort if sort is empty", () => {
    const sorted = sortBuildsByRam(builds, "");
    expect(sorted).toEqual(builds);
  });

  test("filters by CPU and GPU correctly", () => {
    const filtered = builds.filter(
      (b) => b.cpu === "Intel" && b.gpu === "RTX 5080"
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].cpu).toBe("Intel");
  });

  test("calculates price extremes correctly", () => {
    const prices = builds.map(b => b.price);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const avg = prices.reduce((acc, v) => acc + v, 0) / prices.length;

    expect(max).toBe(3225);
    expect(min).toBe(950);
    expect(Math.round(avg)).toBe(2245);
  });
});
