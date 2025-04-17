import { describe, test, expect } from "@jest/globals"; 
import { filterBuildsByGPU } from "../utils/filterBuilds";

describe("GPU Filtering Function", () => {
  const mockBuilds = [
    { cpu: "Intel", gpu: "RTX 5080", ram: "16GB", case: "case1.jpg" },
    { cpu: "AMD", gpu: "RTX 5080", ram: "32GB", case: "case4.jpg" },
    { cpu: "Intel", gpu: "RTX 5090", ram: "16GB", case: "case2.jpg" },
    { cpu: "Intel", gpu: "GTX 690", ram: "16GB", case: "case3.jpg" }
  ];

  test("returns all builds when no GPU filter is applied", () => {
    const result = filterBuildsByGPU(mockBuilds, "");
    expect(result).toHaveLength(4);
  });

  test("filters builds with RTX 5080 GPU", () => {
    const result = filterBuildsByGPU(mockBuilds, "RTX 5080");
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { cpu: "Intel", gpu: "RTX 5080", ram: "16GB", case: "case1.jpg" },
      { cpu: "AMD", gpu: "RTX 5080", ram: "32GB", case: "case4.jpg" }
    ]);
  });

  test("filters builds with RTX 5090 GPU", () => {
    const result = filterBuildsByGPU(mockBuilds, "RTX 5090");
    expect(result).toHaveLength(1);
    expect(result[0].gpu).toBe("RTX 5090");
  });

  test("filters builds with GTX 690 GPU", () => {
    const result = filterBuildsByGPU(mockBuilds, "GTX 690");
    expect(result).toHaveLength(1);
    expect(result[0].gpu).toBe("GTX 690");
  });

  test("returns an empty array if no builds match the filter", () => {
    const result = filterBuildsByGPU(mockBuilds, "Non-existent GPU");
    expect(result).toHaveLength(0);
  });
});
