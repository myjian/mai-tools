const VERSION_NAMES = [
  'maimai', // 0
  'maimai PLUS',
  'GreeN', // 2
  'GreeN PLUS',
  'ORANGE', // 4
  'ORANGE PLUS',
  'PiNK', // 6
  'PiNK PLUS',
  'MURASAKi', // 8
  'MURASAKi PLUS',
  'MiLK', // 10
  'MiLK PLUS',
  'FiNALE', // 12
  'maimaiでらっくす',
  'maimaiでらっくす PLUS',
  'Splash', // 15
  'Splash PLUS',
  'UNiVERSE', // 17
  'UNiVERSE PLUS',
  'FESTiVAL', // 19
  'FESTiVAL PLUS',
];

export const enum GameVersion {
  DX = 13,
  UNIVERSE_PLUS = 18,
  FESTiVAL = 19,
  FESTiVAL_PLUS = 20,
}

export const LATEST_VERSION = GameVersion.FESTiVAL_PLUS;

export const RATING_CALCULATOR_SUPPORTED_VERSIONS = [
  GameVersion.UNIVERSE_PLUS,
  GameVersion.FESTiVAL,
  GameVersion.FESTiVAL_PLUS,
];

export function validateGameVersion(
  ver: number | string | null,
  minVer: number,
  maxVer: GameVersion = LATEST_VERSION
): GameVersion {
  const numVer = typeof ver === 'string' ? parseInt(ver) : ver;
  if (!ver || isNaN(numVer)) {
    return maxVer;
  }
  if (numVer >= minVer && numVer <= maxVer) {
    return numVer;
  }
  return maxVer;
}

export function getVersionName(ver: GameVersion) {
  return VERSION_NAMES[ver];
}
