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
  "FESTiVAL",
];

export const enum DxVersion {
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
  fallback: DxVersion = DxVersion.UNIVERSE_PLUS
): DxVersion {
  const numVer = typeof ver === "string" ? parseInt(ver) : ver;
  if (!ver || isNaN(numVer)) {
    return fallback;
  }
  if (
    numVer >= RATING_CALCULATOR_SUPPORTED_VERSIONS[0] &&
    numVer <= RATING_CALCULATOR_SUPPORTED_VERSIONS[RATING_CALCULATOR_SUPPORTED_VERSIONS.length - 1]
  ) {
    return numVer;
  }
  return fallback;
}

export function getVersionName(ver: DxVersion) {
  return VERSION_NAMES[ver];
}
