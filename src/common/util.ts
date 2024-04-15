import {getChartType} from './chart-type';
import {Difficulty} from './difficulties';
import {getSongName} from './fetch-score-util';
import {SELF_SCORE_URLS} from './fetch-self-score';
import {fetchPage} from './net-helpers';
import {getSongIdx, isNiconicoLink} from './song-name-helper';
import {BasicSongProps} from './song-props';

export const ALLOWED_ORIGINS = [
  'https://cdpn.io',
  'https://myjian.github.io',
  'http://localhost:8080',
];

export function handleError(msg: string) {
  alert(msg);
}

async function parseSongList(dom: Document) {
  // This is simplified from scripts/build-song-db.ts
  const rows = Array.from(dom.querySelectorAll('.w_450.m_15.f_0') as NodeListOf<HTMLElement>);
  const songs: BasicSongProps[] = [];
  for (const d of rows) {
    const idx = getSongIdx(d);
    const name = getSongName(d);
    const isDx = getChartType(d);
    let nickname: string | undefined;
    if (name === 'Link') {
      nickname = (await isNiconicoLink(idx)) ? 'Link (nico)' : 'Link (org)';
    }
    songs.push({dx: isDx, name, nickname});
  }
  return songs;
}

export async function fetchAllSongs(dom?: Document) {
  if (!dom) {
    const url = SELF_SCORE_URLS.get(Difficulty.BASIC);
    dom = await fetchPage(url);
  }
  return await parseSongList(dom);
}

export async function fetchSongDetailPage(idx: string) {
  const query = new URLSearchParams({idx}).toString();
  return fetchPage('/maimai-mobile/record/musicDetail/?' + query);
}

export function getPostMessageFunc(w: WindowProxy, origin: string) {
  return (action: string, payload: unknown) => {
    const obj = {action, payload};
    w.postMessage(obj, origin);
  };
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function cached<T>(
  key: string,
  duration: number,
  fn: () => Promise<T>,
  now: number = Date.now()
): Promise<T> {
  const item = window.localStorage.getItem(key);
  if (item) {
    const {value, expiration} = JSON.parse(item);
    if (expiration && expiration > now) { // valid
      // console.log(`Found cache: ${key}=${value}`);
      return value;
    }
  }

  // expired or not found
  const value = await fn();
  window.localStorage.setItem(key, JSON.stringify({value, expiration: now + duration}));
  return value;
}

export function expireCache(key: string) {
  window.localStorage.removeItem(key);
}
