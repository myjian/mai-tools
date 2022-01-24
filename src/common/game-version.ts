export enum DxVersion {
  SPLASH = 15,
  SPLASH_PLUS = 16,
  UNIVERSE = 17,
}

export function validateGameVersion(
  ver: number | string | null,
  fallback: DxVersion = DxVersion.SPLASH_PLUS
): DxVersion {
  const numVer = typeof ver === "string" ? parseInt(ver) : ver;
  if (!ver || isNaN(numVer)) {
    return fallback;
  }
  if (numVer >= DxVersion.SPLASH && numVer <= DxVersion.UNIVERSE) {
    return numVer;
  }
  return fallback;
}
