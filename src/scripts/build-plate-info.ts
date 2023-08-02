import {ChartType, getChartType} from '../common/chart-type';
import {getSongName} from '../common/fetch-score-util';
import {GameRegion} from '../common/game-region';
import {getSongIdx, isNiconicoLink} from '../common/song-name-helper';

const FILE_PREFIX = window.location.origin === GameRegion.Jp ? 'jp' : 'intl';

const PLATE_PREFIX: Record<string | number, string> = {
  0: '真',
  1: '真',
  2: '超',
  3: '檄',
  4: '橙',
  5: '暁',
  6: '桃',
  7: '櫻',
  8: '紫',
  9: '堇',
  10: '白',
  11: '雪',
  12: '輝',
  13: '熊',
  14: '華',
  15: '爽',
  16: '煌',
  17: '宙',
  18: '星',
  19: '祭',
};

async function buildSongDb(versionName: string, platePrefix: string) {
  const rows = Array.from(document.querySelectorAll('.w_450.m_15.f_0') as NodeListOf<HTMLElement>);
  const result: Record<string, string[] | string | Record<string, string>> = {
    version_name: versionName,
    plate_name: {
      FC: `${platePrefix}極`,
      SSS: `${platePrefix}將`,
      AP: `${platePrefix}神`,
      FSD: `${platePrefix}舞舞`,
    },
    dx_songs: [],
    std_songs: [],
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

async function main() {
  const version = (
    (document.querySelector('select[name=version]') ||
      document.querySelector('select[name]')) as HTMLSelectElement
  ).selectedOptions[0];
  const platePrefix = PLATE_PREFIX[version.value];
  const fileContent = JSON.stringify(await buildSongDb(version.textContent, platePrefix), null, 2);
  const file = new Blob([fileContent], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(file);
  console.log(url);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = FILE_PREFIX + version.value + '.json';
  anchor.innerText = anchor.download;
  anchor.style.color = 'black';
  document.body.prepend(anchor);
}

main();
