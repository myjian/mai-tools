import {ChartType, getChartType} from '../common/chart-type';
import {getChartDifficulty, getChartLevel, getSongName} from '../common/fetch-score-util';
import {getSongIdx, isNiconicoLink} from '../common/song-name-helper';

async function buildSongDb() {
  const rows = Array.from(document.querySelectorAll('.w_450.m_15.f_0') as NodeListOf<HTMLElement>);
  const songs = [];
  for (const d of rows) {
    const idx = getSongIdx(d);
    let n = getSongName(d);
    const di = getChartDifficulty(d);
    let lv = getChartLevel(d);
    const c = getChartType(d);
    if (n === 'Link') {
      n = (await isNiconicoLink(idx)) ? 'Link (nico)' : 'Link (org)';
    } else if (n === '+♂' || n === '39') {
      n = "'" + n;
    }
    if (c === ChartType.DX) {
      n += ' [dx]';
    }
    if (!lv.includes('+')) {
      lv = "'" + lv;
    }
    songs.push([n, di, lv].join('\t'));
  }
  return songs;
}

async function main() {
  console.log(await buildSongDb());
}

main();
