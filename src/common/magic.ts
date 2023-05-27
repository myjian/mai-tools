import {DIFFICULTIES} from './difficulties';
import {GameVersion, RATING_CALCULATOR_SUPPORTED_VERSIONS} from './game-version';
import {normalizeSongName} from './song-name-helper';

import type {SongProperties} from './song-props';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day
const CACHE_KEY_PREFIX = 'magicVer';
const EXPIRATION_KEY = 'magicExpire';
const OLD_KEYS_TO_CLEANUP = ['dxLv15', 'dxLv16', 'dxLv17', 'dxLv18', 'dxLv19', 'dxLv20'];

const MagicSauce: Record<GameVersion, string> = {
  [GameVersion.DX]: null,
  [GameVersion.UNIVERSE_PLUS]:
    'aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vZWU1NjlkNzRmNDIyZDRlMjU1MDY1ZDhiMDJlYTI5NGEvcmF3LzkzMmZiMDNhMzgxMjEyMTAwODBkNmY1Mzc5MTNhMDg0MjQ3ZTUzMWMvbWFpZHhfaW5fbHZfdW5pdmVyc2VwbHVzLmpz',
  [GameVersion.FESTiVAL]:
    'aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfZmVzdGl2YWwuanM=',
  [GameVersion.FESTiVAL_PLUS]:
    'aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfZmVzdGl2YWxwbHVzLmpz',
};

const DX_REGEX = /\bdx\s*:\s*([0-9]+)/;
const LV_REGEX = /\blv\s*:\s*(\[.+?\])/;
const VERSION_REGEX = /\bv\s*:\s*(-?[0-9]+)/;
const SONGNAME_REGEX = /\bn\s*:\s*["'](.+?)['"]\s*[,\}]/;
const SONGNICKNAME_REGEX = /\bnn\s*:\s*["'](.+?)['"]\s*[,\}]/;

/**
 * Parse song properties from text.
 *
 * Example text format:
 * {dx:0, v: 2, lv:[4.0, 6.0, 8.8, 10.9, 12.3], n:"Bad Apple!! feat nomico", nn:"Bad Apple!!"},
 * {dx:1, v:13, lv:[3.0, 7.0, 9.2, 11.8, 0], n:"METEOR"},
 */
function parseLine(line: string): SongProperties | undefined {
  const dxMatch = line.match(DX_REGEX);
  const lvMatch = line.match(LV_REGEX);
  const debutVerMatch = line.match(VERSION_REGEX);
  const songNameMatch = line.match(SONGNAME_REGEX);
  const nicknameMatch = line.match(SONGNICKNAME_REGEX);
  if (dxMatch && lvMatch && debutVerMatch && songNameMatch) {
    let lvList = JSON.parse(lvMatch[1]) as number[];
    if (lvList.length > DIFFICULTIES.length) {
      const newReMasterLv = lvList.pop()!;
      lvList[DIFFICULTIES.length - 1] = newReMasterLv;
    }
    return {
      dx: parseInt(dxMatch[1]) as 0 | 1,
      lv: lvList,
      debut: Math.abs(parseInt(debutVerMatch[1])),
      name: normalizeSongName(songNameMatch[1]),
      nickname: nicknameMatch && nicknameMatch[1],
    };
  }
}

async function fetchMagic(gameVer: GameVersion): Promise<SongProperties[]> {
  const sauce = MagicSauce[gameVer] || MagicSauce[GameVersion.UNIVERSE_PLUS];
  const res = await fetch(atob(sauce));
  if (res.ok) {
    const text = await res.text();
    return text
      .split('\n')
      .map(parseLine)
      .filter((props) => props != null);
  }
  return [];
}

function getInternalLvCacheKey(gameVer: GameVersion): string {
  return CACHE_KEY_PREFIX + gameVer;
}

function readMagicFromCache(gameVer: GameVersion): SongProperties[] {
  const expiration = parseInt(window.localStorage.getItem(EXPIRATION_KEY));
  if (isNaN(expiration) || Date.now() > expiration) {
    for (const oldKey of OLD_KEYS_TO_CLEANUP) {
      window.localStorage.removeItem(oldKey);
    }
    for (const ver of RATING_CALCULATOR_SUPPORTED_VERSIONS) {
      window.localStorage.removeItem(getInternalLvCacheKey(ver));
    }
    return null;
  }
  const key = getInternalLvCacheKey(gameVer);
  const magic = window.localStorage.getItem(key);
  console.log(`Found cache: ${key}=${magic}`);
  return JSON.parse(magic);
}

function writeMagicToCache(gameVer: GameVersion, magic: SongProperties[]) {
  const key = getInternalLvCacheKey(gameVer);
  window.localStorage.setItem(key, JSON.stringify(magic));
  window.localStorage.setItem(EXPIRATION_KEY, String(Date.now() + CACHE_DURATION));
  console.log(`Updated cache for ${key}`);
}

export async function loadMagic(gameVer: GameVersion): Promise<SongProperties[]> {
  // Read from cache
  const cachedGameData = readMagicFromCache(gameVer);
  if (cachedGameData) {
    return cachedGameData;
  }
  // Read from Internet
  console.log('Magic happening...');
  const songs = await fetchMagic(gameVer);
  if (songs.length) {
    writeMagicToCache(gameVer, songs);
  }
  return songs;
}
