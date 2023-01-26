const VERSION_NAMES = [
  "maimai", // 0
  "maimai PLUS",
  "GreeN", // 2
  "GreeN PLUS",
  "ORANGE", // 4
  "ORANGE PLUS",
  "PiNK", // 6
  "PiNK PLUS",
  "MURASAKi", // 8
  "MURASAKi PLUS",
  "MiLK", // 10
  "MiLK PLUS",
  "FiNALE", // 12
  "maimaiでらっくす",
  "maimaiでらっくす PLUS",
  "Splash", // 15
  "Splash PLUS",
  "UNiVERSE", // 17
  "UNiVERSE PLUS",
  "FESTiVAL", // 19
];

export const enum DxVersion {
  DX = 13,
  UNIVERSE = 17,
  UNIVERSE_PLUS = 18,
  FESTiVAL = 19,
}

export const RATING_CALCULATOR_SUPPORTED_VERSIONS = [
  DxVersion.UNIVERSE,
  DxVersion.UNIVERSE_PLUS,
  DxVersion.FESTiVAL,
];

export function validateGameVersion(
  ver: number | string | null,
  minVer: number,
  fallback: DxVersion = DxVersion.FESTiVAL,
): DxVersion {
  const numVer = typeof ver === "string" ? parseInt(ver) : ver;
  if (!ver || isNaN(numVer)) {
    return fallback;
  }
  if (numVer >= minVer && numVer <= DxVersion.FESTiVAL) {
    return numVer;
  }
  return fallback;
}

export function getVersionName(ver: DxVersion) {
  return VERSION_NAMES[ver];
}
