import {GameVersion, RATING_CALCULATOR_SUPPORTED_VERSIONS} from './game-version';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day
const CACHE_KEY_PREFIX = 'dxLv';

const MagicSauce: Record<GameVersion, string> = {
  [GameVersion.DX]: null,
  [GameVersion.UNIVERSE_PLUS]:
    'aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vZWU1NjlkNzRmNDIyZDRlMjU1MDY1ZDhiMDJlYTI5NGEvcmF3LzkzMmZiMDNhMzgxMjEyMTAwODBkNmY1Mzc5MTNhMDg0MjQ3ZTUzMWMvbWFpZHhfaW5fbHZfdW5pdmVyc2VwbHVzLmpz',
  [GameVersion.FESTiVAL]:
    'aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfZmVzdGl2YWwuanM=',
  [GameVersion.FESTiVAL_PLUS]:
    'aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfZmVzdGl2YWxwbHVzLmpz',
};

export async function fetchMagic(gameVer: GameVersion): Promise<string> {
  const sauce = MagicSauce[gameVer] || MagicSauce[GameVersion.UNIVERSE_PLUS];
  const res = await fetch(atob(sauce));
  if (res.ok) {
    return res.text();
  }
  return '';
}

function getInternalLvCacheKey(gameVer: GameVersion): string {
  return CACHE_KEY_PREFIX + gameVer;
}

export function readMagicFromCache(gameVer: GameVersion) {
  const key = getInternalLvCacheKey(gameVer);
  const rawItem = window.localStorage.getItem(key);
  console.log('Reading cache for "' + key + '" =>', rawItem);
  if (!rawItem) {
    return null;
  }
  const dataWithMeta = JSON.parse(rawItem);
  const cacheDate = new Date(dataWithMeta.date);
  const currentDate = new Date();
  if (currentDate.valueOf() - cacheDate.valueOf() > CACHE_DURATION) {
    console.warn('Cache for "' + key + '" is expired.');
    for (const ver of RATING_CALCULATOR_SUPPORTED_VERSIONS) {
      window.localStorage.removeItem(getInternalLvCacheKey(ver));
    }
    return null;
  }
  return dataWithMeta.content;
}

export function writeMagicToCache(gameVer: GameVersion, content: string) {
  const key = getInternalLvCacheKey(gameVer);
  console.log('Updating cache for "' + key + '"');
  const item = {date: new Date(), content};
  window.localStorage.setItem(key, JSON.stringify(item));
}
