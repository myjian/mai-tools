import {ChartRecord, FullChartRecord} from './chart-record';
import {getChartType} from './chart-type';
import {Difficulty} from './difficulties';
import {determineDxStar} from './dx-star';
import {
  getAchievement,
  getApFcStatus,
  getChartLevel,
  getSongName,
  getSyncStatus,
} from './fetch-score-util';
import {getDefaultLevel} from './level-helper';
import {fetchPage} from './net-helpers';
import {SongDatabase} from './song-props';

export const SELF_SCORE_URLS = new Map([
  [Difficulty.ReMASTER, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=4'],
  [Difficulty.MASTER, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=3'],
  [Difficulty.EXPERT, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=2'],
  [Difficulty.ADVANCED, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=1'],
  [Difficulty.BASIC, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=0'],
]);

export function getMyDxScoreInfo(row: HTMLElement): {
  max: number;
  player: number;
  ratio: number;
  star: number;
} {
  const scoreBlocks = row.querySelectorAll('.music_score_block');
  if (scoreBlocks.length !== 2) {
    return null;
  }
  const dxScoreNodes = scoreBlocks[1].childNodes;
  const textNode = dxScoreNodes[dxScoreNodes.length - 1];
  const scoreSegments =
    textNode instanceof Text
      ? textNode.wholeText.split('/').map((segment) => segment.replace(',', '').trim())
      : [];
  if (scoreSegments.length !== 2) {
    return null;
  }
  try {
    const playerScore = parseInt(scoreSegments[0]);
    const maxScore = parseInt(scoreSegments[1]);
    if (isNaN(playerScore) || isNaN(maxScore)) {
      throw new Error(`failed to parse DX score. Input was ${JSON.stringify(scoreSegments)}`);
    }
    const ratio = playerScore / maxScore;
    const star = determineDxStar(ratio);
    return {max: maxScore, player: playerScore, ratio, star};
  } catch (err) {
    console.warn(err);
  }
  return {max: 0, player: 0, ratio: 0, star: 0};
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
    row.classList.contains('p_r') &&
    row.classList.contains('f_0');
  if (isGenreRow) {
    state.genre = row.innerText;
    return null;
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
      level,
      levelIsPrecise,
      chartType,
      achievement,
    };
  }
}

export async function fetchScores(
  difficulty: Difficulty,
  domCache: Map<Difficulty, Document>,
  songDb: SongDatabase
): Promise<ChartRecord[]> {
  let dom = domCache.get(difficulty);
  if (!dom) {
    const url = SELF_SCORE_URLS.get(difficulty);
    if (!url) {
      return;
    }
    dom = await fetchPage(url);
    domCache.set(difficulty, dom);
  }
  const rows = dom.querySelectorAll('.main_wrapper.t_c .m_15') as NodeListOf<HTMLElement>;
  const state = {genre: ''};
  const recordsWithNull = Array.from(rows).map((row) => processRow(row, difficulty, songDb, state));
  return recordsWithNull.filter((record) => record != null);
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
    fcap: getApFcStatus(row),
    sync: getSyncStatus(row),
    dxscore: getMyDxScoreInfo(row),
    version: props ? props.debut : -1,
  };
}

/** Similar to fetchScores, but return more fields per each record. */
export async function fetchScoresFull(
  difficulty: Difficulty,
  domCache: Map<Difficulty, Document>,
  songDb: SongDatabase
): Promise<FullChartRecord[]> {
  let dom = domCache.get(difficulty);
  if (!dom) {
    const url = SELF_SCORE_URLS.get(difficulty);
    if (!url) {
      return;
    }
    dom = await fetchPage(url);
    domCache.set(difficulty, dom);
  }
  const rows = dom.querySelectorAll('.main_wrapper.t_c .m_15') as NodeListOf<HTMLElement>;
  const state = {genre: ''};
  const recordsWithNull = Array.from(rows).map((row) =>
    processRowFull(row, difficulty, songDb, state)
  );
  return recordsWithNull.filter((record) => record != null);
}
