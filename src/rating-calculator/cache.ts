import {DxVersion} from '../common/constants';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day

const CACHE_KEY_PREFIX = "dxLv";

function getInternalLvCacheKey(gameVer: DxVersion): string {
  return CACHE_KEY_PREFIX + gameVer;
}

export function readFromCache(gameVer: DxVersion) {
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
    window.localStorage.clear();
    return null;
  }
  return dataWithMeta.content;
}

export function writeToCache(gameVer: DxVersion, content: string) {
  const key = getInternalLvCacheKey(gameVer);
  console.log('Updating cache for "' + key + '"');
  const item = {date: new Date(), content};
  window.localStorage.setItem(key, JSON.stringify(item));
}
