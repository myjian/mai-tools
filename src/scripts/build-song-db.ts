import {ChartType, getChartType} from '../common/chart-type';
import {getSongName} from '../common/fetch-score-util';
import {getSongIdx, isNiconicoLink} from '../common/song-name-helper';

async function buildSongDb(versionName: string, platePrefix: string) {
  const rows = Array.from(document.querySelectorAll('.w_450.m_15.f_0') as NodeListOf<HTMLElement>);
  const result: Record<string, string[] | string | Record<string, string>> = {
    version_name: versionName,
    dx_songs: [],
    std_songs: [],
    plate_name: {
      FC: `${platePrefix}極`,
      SSS: `${platePrefix}將`,
      AP: `${platePrefix}神`,
      FSD: `${platePrefix}舞舞`,
    },
  };
  for (const d of rows) {
    const idx = getSongIdx(d);
    let n = getSongName(d);
    // const di = getChartDifficulty(d);
    // let lv = getChartLevel(d);
    const c = getChartType(d);
    if (n === 'Link') {
      n = (await isNiconicoLink(idx)) ? 'Link(nico)' : 'Link(org)';
      // } else if (n === '+♂' || n === '39') {
      //   n = "'" + n;
    }
    // if (c === ChartType.DX) {
    //   n += ' [dx]';
    // }
    // if (!lv.includes('+')) {
    //   lv = "'" + lv;
    // }
    // songs.push([n, di, lv].join('\t'));
    if (c === ChartType.DX) {
      (result.dx_songs as string[]).push(n);
    } else {
      (result.std_songs as string[]).push(n);
    }
  }
  return result;
}

async function main(platePrefix: string) {
  const versionName = (document.querySelector('select[name=version]') as HTMLSelectElement)
    .selectedOptions[0].textContent;
  console.log(JSON.stringify(await buildSongDb(versionName, platePrefix), null, 2));
}

declare global {
  interface Window {
    buildSongRecords: (platePrefix: string) => void;
  }
}

window.buildSongRecords = main;
