import {ChartRecord, FullChartRecord} from './chart-record';
import {getChartType} from './chart-type';
import {Difficulty} from './difficulties';
import {getApFcStatus, getChartLevel, getSongName, getSyncStatus} from './fetch-score-util';
import {getDefaultLevel} from './level-helper';
import {fetchPage} from './net-helpers';
import {SongDatabase} from './song-props';

export const FRIEND_SCORE_URLS = new Map([
  [
    Difficulty.ReMASTER,
    '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=4&idx=',
  ],
  [
    Difficulty.MASTER,
    '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=3&idx=',
  ],
  [
    Difficulty.EXPERT,
    '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=2&idx=',
  ],
  [
    Difficulty.ADVANCED,
    '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=1&idx=',
  ],
  [
    Difficulty.BASIC,
    '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=0&idx=',
  ],
]);

function getAchievement(row: HTMLElement): string | null {
  const ach = row.querySelector('td.w_120.f_b:last-child') as HTMLElement;
  const achText = ach && ach.innerText.trim();
  return achText !== '0' && achText !== '― %' ? achText : null;
}

function processRow(
  row: HTMLElement,
  difficulty: Difficulty,
  songDb: SongDatabase,
  state: {genre: string}
): ChartRecord {
  const isGenreRow = row.classList.contains('screw_block');
  const isScoreRow =
    row.classList.contains('w_450') &&
    row.classList.contains('m_15') &&
    row.classList.contains('p_3') &&
    row.classList.contains('f_0');
  if (isGenreRow) {
    state.genre = row.innerText;
    return;
  } else if (isScoreRow) {
    const achievement = getAchievement(row);
    if (!achievement) {
      return;
    }
    const songName = getSongName(row);
    const chartType = getChartType(row);
    const props = songDb.getSongProperties(songName, state.genre, chartType);
    let level = props ? props.lv[difficulty] : 0;
    const levelIsPrecise = level > 0;
    if (!level) {
      level = getDefaultLevel(getChartLevel(row));
    }
    return {
      songName,
      genre: state.genre,
      difficulty,
      chartType,
      level,
      levelIsPrecise,
      achievement: parseFloat(achievement),
    };
  }
}

function processRowFull(
  row: HTMLElement,
  difficulty: Difficulty,
  songDb: SongDatabase,
  state: {genre: string}
): FullChartRecord {
  const baseRecord = processRow(row, difficulty, songDb, state);
  if (baseRecord == null) {
    return null;
  }
  const props = songDb.getSongProperties(baseRecord.songName, state.genre, baseRecord.chartType);
  return {
    ...baseRecord,
    fcap: getApFcStatus(row, true),
    sync: getSyncStatus(row, true),
    version: props ? props.debut : -1,
    dxscore: {max: 0, player: 0, ratio: 0, star: 0}, // TODO
  };
}

export async function fetchFriendScores(
  friendIdx: string,
  difficulty: Difficulty,
  songDb: SongDatabase
): Promise<ChartRecord[]> {
  let url = FRIEND_SCORE_URLS.get(difficulty);
  if (!url) {
    return;
  }
  url += friendIdx;
  const dom = await fetchPage(url);
  const rows = dom.querySelectorAll('.main_wrapper.t_c .m_15') as NodeListOf<HTMLElement>;
  const state = {genre: ''};
  const recordsWithNull = Array.from(rows).map((row) => processRow(row, difficulty, songDb, state));
  return recordsWithNull.filter((record) => record != null);
}

export async function fetchFriendScoresFull(
  friendIdx: string,
  difficulty: Difficulty,
  songDb: SongDatabase
): Promise<FullChartRecord[]> {
  let url = FRIEND_SCORE_URLS.get(difficulty);
  if (!url) {
    return;
  }
  url += friendIdx;
  const dom = await fetchPage(url);
  const rows = dom.querySelectorAll('.main_wrapper.t_c .m_15') as NodeListOf<HTMLElement>;
  const state = {genre: ''};
  const recordsWithNull = Array.from(rows).map((row) =>
    processRowFull(row, difficulty, songDb, state)
  );
  return recordsWithNull.filter((record) => record != null);
}
