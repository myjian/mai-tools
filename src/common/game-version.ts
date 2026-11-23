/**
 * Checklist when adding new game version:
 *   - Update MagicSauceByVersion and FALLBACK_VERSION in src/common/infra/magic-api.ts
 *   - Update deleted songs in src/common/removed-songs.ts
 *   - Update LATEST_VERSION in this file
 */
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
  'でらっくす',
  'でらっくす PLUS',
  'Splash', // 15
  'Splash PLUS',
  'UNiVERSE', // 17
  'UNiVERSE PLUS',
  'FESTiVAL', // 19
  'FESTiVAL PLUS',
  'BUDDiES', // 21
  'BUDDiES PLUS',
  'PRiSM', // 23
  'PRiSM PLUS',
  'CiRCLE', // 25
  'CiRCLE PLUS',
  'MAGiCAL', // 27
  // NOTE: values here are shown in rating table, so avoid adding suffixes like "(beta)"
];

export const enum GameVersion {
  FiNALE = 12,
  DX = 13,
  UNIVERSE_PLUS = 18,
  FESTiVAL = 19,
  FESTiVAL_PLUS = 20,
  BUDDiES = 21,
  BUDDiES_PLUS = 22,
  PRiSM = 23,
  PRiSM_PLUS = 24,
  CiRCLE = 25,
  CiRCLE_PLUS = 26,
  MAGiCAL = 27,
}

export const LATEST_VERSION = GameVersion.MAGiCAL;

export function validateGameVersion(
  ver: number | string | null,
  minVer: number,
  maxVer: GameVersion = LATEST_VERSION,
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
  return VERSION_NAMES[ver] || '?';
}
