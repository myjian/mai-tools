import {ChartRecord} from './chart-record';
import {getChartType} from './chart-type';
import {fixTimezone} from './date-util';
import {Difficulty, getDifficultyByName} from './difficulties';
import {calculateDetailedDxStar, getDxStarText} from './dx-star';
import {getSongGenreFromImg} from './song-name-helper';
import {SongDatabase} from './song-props';

export const PLAY_HISTORY_PATH = '/maimai-mobile/record/';

export interface PlayRecord extends ChartRecord {
  date: Date;
  songImgSrc: string;
  rank: string;
  marks: string;
  isNewRecord: boolean;
}

// Only include tab and new line, but not space.
const FRONT_WHITESPACE_REGEX = /^[\n\t]+/g;
const END_WHITESPACE_REGEX = /[\n\t]+$/g;

const AP_FC_IMG_NAME_TO_TEXT = new Map([
  ['fc', 'FC'],
  ['fcplus', 'FC+'],
  ['ap', 'AP'],
  ['applus', 'AP+'],
]);

const SYNC_IMG_NAME_TO_TEXT = new Map([
  ['fs', 'FS'],
  ['fsplus', 'FS+'],
  ['fsd', 'FSD'],
  ['fsdplus', 'FSD+'],
]);

function getPlayDate(row: HTMLElement) {
  const playDateText = (row.querySelector('.sub_title').children[1] as HTMLElement).innerText;
  const m = playDateText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
  const japanDt = new Date(
    parseInt(m[1]),
    parseInt(m[2]) - 1,
    parseInt(m[3]),
    parseInt(m[4]),
    parseInt(m[5])
  );
  return fixTimezone(japanDt);
}

function getSongName(row: HTMLElement) {
  try {
    return Array.from((row.querySelector('.m_5.p_5.f_13') as HTMLElement).childNodes)
      .reverse()
      .find((node) => node instanceof Text)
      .textContent.replace(FRONT_WHITESPACE_REGEX, '')
      .replace(END_WHITESPACE_REGEX, '');
  } catch (e) {
    console.log(e);
    console.log(row);
    return '';
  }
}

function getSongImgSrc(row: HTMLElement): string {
  const img = row.querySelector('.music_img') as HTMLImageElement;
  return img ? img.src : '';
}

function getDifficulty(row: HTMLElement) {
  const recordBody = row.children[1];
  const cn = recordBody.className;
  let diff = cn.substring(cn.indexOf('_') + 1, cn.lastIndexOf('_'));
  return getDifficultyByName(diff);
}

function getAchievement(row: HTMLElement) {
  return parseFloat((row.querySelector('.playlog_achievement_txt') as HTMLElement).innerText);
}

function getDxStar(row: HTMLElement): string {
  const dxStarIndex = calculateDetailedDxStar(row);
  return getDxStarText(dxStarIndex);
}

function getRank(row: HTMLElement): string {
  const rankImgSrc = (row.querySelector('img.playlog_scorerank') as HTMLImageElement).src.replace(
    /\?ver=.*$/,
    ''
  );
  return rankImgSrc
    .substring(rankImgSrc.lastIndexOf('/') + 1, rankImgSrc.lastIndexOf('.'))
    .replace('plus', '+')
    .toUpperCase();
}

function getMarks(row: HTMLElement): string {
  const results = [];
  // FC/AP
  const stampImgs = row.querySelectorAll(
    '.playlog_result_innerblock > img'
  ) as NodeListOf<HTMLImageElement>;
  const fcapSrc = stampImgs[0].src.replace(/\?ver=.*$/, '');
  const fcapImgName = fcapSrc.substring(fcapSrc.lastIndexOf('/') + 1, fcapSrc.lastIndexOf('.'));
  if (AP_FC_IMG_NAME_TO_TEXT.has(fcapImgName)) {
    results.push(AP_FC_IMG_NAME_TO_TEXT.get(fcapImgName));
  }

  // SYNC
  const fullSyncSrc = stampImgs[1].src.replace(/\?ver=.*$/, '');
  const fullSyncImgName = fullSyncSrc.substring(
    fullSyncSrc.lastIndexOf('/') + 1,
    fullSyncSrc.lastIndexOf('.')
  );
  if (SYNC_IMG_NAME_TO_TEXT.has(fullSyncImgName)) {
    results.push(SYNC_IMG_NAME_TO_TEXT.get(fullSyncImgName));
  }

  // DX Star
  const dxStar = getDxStar(row);
  if (dxStar) {
    results.push(dxStar);
  }
  return results.join(' ');
}

export function getIsNewRecord(row: HTMLElement): boolean {
  return !!row.querySelector(
    '.playlog_achievement_label_block + img.playlog_achievement_newrecord'
  );
}

export function getChartRecordFromPlayRecordRow(
  row: HTMLElement,
  songDb: SongDatabase
): ChartRecord {
  const songName = getSongName(row);
  const chartType = getChartType(row);
  const songImgSrc = getSongImgSrc(row);
  const genre = getSongGenreFromImg(songName, songImgSrc);
  const difficulty = getDifficulty(row);
  const props = songDb.getSongProperties(songName, genre, chartType);
  const level = difficulty !== Difficulty.UTAGE && props ? props.lv[difficulty] : 0;

  return {
    songName,
    genre,
    chartType,
    difficulty,
    achievement: getAchievement(row),
    level,
  };
}

export function getPlayRecordFromRow(row: HTMLElement, songDb: SongDatabase): PlayRecord {
  const baseRecord = getChartRecordFromPlayRecordRow(row, songDb);

  return {
    ...baseRecord,
    date: getPlayDate(row),
    songImgSrc: getSongImgSrc(row),
    rank: getRank(row),
    marks: getMarks(row),
    isNewRecord: getIsNewRecord(row),
  };
}
