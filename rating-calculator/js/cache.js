const YEAR_IN_MILLISECOND = 365 * 24 * 60 * 60 * 1000;

export function readFromCache(key) {
  const rawItem = window.localStorage.getItem(key);
  if (!rawItem) {
    return rawItem;
  }
  const dataWithMeta = JSON.parse(rawItem);
  const cacheDate = new Date(dataWithMeta.date);
  const currentDate = new Date()
  if (currentDate - cacheDate > YEAR_IN_MILLISECOND) {
    console.warn('Cache of "' + key + '" is over 1 year old.'); 
  }
  return dataWithMeta.content;
}

export function writeToCache(key, content) {
  const item = {date: new Date(), content: content};
  window.localStorage.setItem(key, JSON.stringify(item));
}