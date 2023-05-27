import {Difficulty, getDifficultyTextColor} from './difficulties';

import type {GameVersion} from './game-version';

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 day
const CACHE_KEY = 'MaiToolsGameVer';
const EXPIRATION_KEY = 'MaiToolsGameVerExpire';

// 540 (60 mins * 9) = Japan Timezone (UTC+9)
// 1 minute = 60 seconds = 60000 millisecond
const TIMEZONE_OFFSET = (new Date().getTimezoneOffset() + 540) * 60000;

export async function fetchPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export async function fetchGameVersion(dom: Document | HTMLElement): Promise<GameVersion> {
  const cacheExpiration = parseInt(window.localStorage.getItem(EXPIRATION_KEY));
  if (!isNaN(cacheExpiration) && cacheExpiration >= Date.now()) {
    const cachedGameVer = parseInt(window.localStorage.getItem(CACHE_KEY));
    if (!isNaN(cachedGameVer)) {
      return cachedGameVer;
    }
  }
  const gameVerOption = dom.querySelector('select[name=version] option:last-of-type');
  if (gameVerOption instanceof HTMLOptionElement) {
    const gameVer = parseInt(gameVerOption.value) as GameVersion;
    window.localStorage.setItem(CACHE_KEY, String(gameVer));
    window.localStorage.setItem(EXPIRATION_KEY, String(Date.now() + CACHE_DURATION));
    return gameVer;
  }
  dom = await fetchPage('/maimai-mobile/record/musicVersion/');
  return fetchGameVersion(dom);
}

export function getEpochTimeFromText(datetimeStr: string): number {
  const m = datetimeStr.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
  const date = new Date(
    parseInt(m[1]),
    parseInt(m[2]) - 1,
    parseInt(m[3]),
    parseInt(m[4]),
    parseInt(m[5])
  );
  return date.getTime() - TIMEZONE_OFFSET;
}

export function removeScrollControl(dom: Document) {
  let button = dom.getElementById('page-top');
  if (button) button.remove();

  button = dom.getElementById('page-bottom');
  if (button) button.remove();
}

/**
 * Add level information to play record. This would be displayed at where the "CLEAR!"
 * image is. Only supported on play record list page and single play record page.
 */
export async function addLvToSongTitle(row: HTMLElement, diff: Difficulty, chartLv: string) {
  const songTitleDiv = row.querySelector('.basic_block.break') as HTMLElement;
  const clearImg = songTitleDiv.querySelector('img');
  if (clearImg) {
    clearImg.remove();
  }
  const lvElem = document.createElement('div');
  lvElem.className = 'f_r'; // float: right
  lvElem.append('Lv ' + chartLv);
  lvElem.style.color = getDifficultyTextColor(diff);
  songTitleDiv.append(lvElem);
}
