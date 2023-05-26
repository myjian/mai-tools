import {FullChartRecord} from './chart-record';
import {getChartType} from './chart-type';
import {Difficulty} from './difficulties';
import {getChartLevel, getSongName} from './fetch-score-util';
import {getDefaultLevel} from './level-helper';
import {fetchPage} from './net-helpers';
import {getSongProperties, SongProperties} from './song-props';

export const SELF_SCORE_URLS = new Map([
  [Difficulty.ReMASTER, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=4'],
  [Difficulty.MASTER, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=3'],
  [Difficulty.EXPERT, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=2'],
  [Difficulty.ADVANCED, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=1'],
  [Difficulty.BASIC, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=0'],
]);

function getAchievement(row: HTMLElement) {
  const ach = row.querySelector('.music_score_block.w_120') as HTMLElement;
  return ach && ach.innerText;
}

function processRow(
  row: HTMLElement,
  difficulty: Difficulty,
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  state: {genre: string}
): FullChartRecord {
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
    const props = getSongProperties(songPropsByName, songName, state.genre, chartType);
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
      achievement: parseFloat(achievement),
    };
  }
}

export async function fetchScores(
  difficulty: Difficulty,
  domCache: Map<Difficulty, Document>,
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>
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
    processRow(row, difficulty, songPropsByName, state)
  );
  return recordsWithNull.filter((record) => record != null);
}
