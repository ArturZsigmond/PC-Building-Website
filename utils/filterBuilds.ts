export function filterBuildsByGPU(builds: any[], gpuFilter: string) {
    return builds.filter(build => !gpuFilter || build.gpu === gpuFilter);
  }
  