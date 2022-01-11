const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day

export function deleteFromCache(key: string) {
  window.localStorage.removeItem(key);
}

export function readFromCache(key: string) {
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
    window.localStorage.removeItem(key);
    return null;
  }
  return dataWithMeta.content;
}

export function writeToCache(key: string, content: string) {
  console.log('Updating cache for "' + key + '"');
  const item = {date: new Date(), content};
  window.localStorage.setItem(key, JSON.stringify(item));
}
