const VERSION_NAMES = [
  "maimai",
  "maimai PLUS",
  "GreeN",
  "GreeN PLUS",
  "ORANGE",
  "ORANGE PLUS",
  "PiNK",
  "PiNK PLUS",
  "MURASAKi",
  "MURASAKi PLUS",
  "MiLK",
  "MiLK PLUS",
  "FiNALE",
  "maimaiでらっくす",
  "maimaiでらっくす PLUS",
  "Splash",
  "Splash PLUS",
  "UNiVERSE",
  "UNiVERSE PLUS",
];

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

export function getVersionName(ver: DxVersion) {
  return VERSION_NAMES[ver];
}
