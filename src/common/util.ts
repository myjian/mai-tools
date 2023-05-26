import {getChartType} from './chart-type';
import {Difficulty} from './difficulties';
import {getSongName} from './fetch-score-util';
import {SELF_SCORE_URLS} from './fetch-self-score';
import {GameVersion} from './game-version';
import {getSongIdx, isNicoNicoLink} from './song-name-helper';
import {BasicSongProps} from './song-props';

export const ALLOWED_ORIGINS = [
  'https://cdpn.io',
  'https://myjian.github.io',
  'http://localhost:8080',
];

export function handleError(msg: string) {
  alert(msg);
}

export async function fetchPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export async function fetchGameVersion(dom: Document | HTMLElement): Promise<GameVersion> {
  const gameVer = dom.querySelector(
    'select[name=version] option:last-of-type'
  ) as HTMLOptionElement;
  if (gameVer) {
    return parseInt(gameVer.value) as GameVersion;
  }
  dom = await fetchPage('/maimai-mobile/record/musicVersion/');
  return fetchGameVersion(dom);
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
      nickname = (await isNicoNicoLink(idx)) ? 'Link(nico)' : 'Link(org)';
    }
    songs.push({dx: isDx, name, nickname});
  }
  return songs;
}

export async function fetchAllSongs(dom?: Document) {
  if (!dom) {
    const url = SELF_SCORE_URLS.get(Difficulty.ADVANCED);
    dom = await fetchPage(url);
  }
  return await parseSongList(dom);
}

export async function fetchNewSongs(ver: GameVersion): Promise<BasicSongProps[]> {
  // diff=0 means BASIC
  const dom = await fetchPage(`/maimai-mobile/record/musicVersion/search/?version=${ver}&diff=0`);
  return await parseSongList(dom);
}

export async function fetchSongDetailPage(idx: string) {
  const query = new URLSearchParams({idx}).toString();
  return fetchPage('/maimai-mobile/record/musicDetail/?' + query);
}

export function getPostMessageFunc(w: WindowProxy, origin: string) {
  return (action: string, payload: any) => {
    const obj = {action, payload};
    w.postMessage(obj, origin);
  };
}
