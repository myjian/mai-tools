import {GameVersion} from './game-version';

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

export function removeScrollControl(dom: Document) {
  let button = dom.getElementById('page-top');
  if (button) button.remove();

  button = dom.getElementById('page-bottom');
  if (button) button.remove();
}
