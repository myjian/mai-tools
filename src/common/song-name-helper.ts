import {ChartType, getChartTypeName} from './chart-type';
import {getSongName} from './fetch-score-util';
import {fetchSongDetailPage} from './util';

export const RATING_TARGET_SONG_NAME_PREFIX = '▶ ';

export function normalizeSongName(name: string) {
  if (name === 'D✪N’T  ST✪P  R✪CKIN’') {
    return 'D✪N’T ST✪P R✪CKIN’';
  }
  return name.replace(/" \+ '/g, '').replace(/' \+ "/g, '');
}

export function getSongIdx(row: HTMLElement): string {
  const form = row.getElementsByTagName('form');
  if (!form.length) {
    return null;
  }
  return (form[0].elements.namedItem('idx') as HTMLInputElement).value;
}

export function getSongNickname(name: string, genre: string) {
  if (name === 'Link') {
    return genre.includes('niconico') ? 'Link (nico)' : 'Link (org)';
  }
  return name;
}

export function getSongNicknameForDxRatingNet(name: string, genre: string) {
  if (name === 'Link') {
    return genre.includes('niconico') ? 'Link (2)' : 'Link';
  }
  return name;
}

export function getSongNicknameWithChartType(
  name: string,
  genre: string,
  chartType: ChartType
): string {
  return getSongNickname(name, genre) + ' [' + getChartTypeName(chartType) + ']';
}

let cachedGenreByIdx: Record<string, string> = {};

export function getCachedSongGenre(idx: string): string {
  return cachedGenreByIdx[idx];
}

export async function fetchSongGenre(idx: string): Promise<string> {
  const cachedGenre = getCachedSongGenre(idx);
  if (cachedGenre) {
    return cachedGenre;
  }
  const dom = await fetchSongDetailPage(idx);
  // TODO: remove `.includes` and use its value directly
  const genre = dom.body
    .querySelector<HTMLElement>('.m_10.m_t_5.t_r.f_12')
    .innerText.includes('niconico')
    ? 'niconico'
    : 'maimai';
  console.log(`${idx} is ${getSongName(dom.body)} from ${genre}`);
  cachedGenreByIdx[idx] = genre;
  return genre;
}

export function getSongGenreFromImg(songName: string, imgSrc: string): string {
  if (songName !== 'Link') {
    return '';
  }
  return imgSrc.includes('e90f79d9dcff84df') ? 'niconico' : 'maimai';
}
