import {FullChartRecord} from './chart-record';
import {getChartType} from './chart-type';
import {Difficulty} from './difficulties';
import {getChartLevel, getSongName} from './fetch-score-util';
import {getDefaultLevel} from './level-helper';
import {fetchPage} from './net-helpers';
import {getSongProperties, SongProperties} from './song-props';

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
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  state: {genre: string}
): FullChartRecord {
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
      chartType,
      level,
      levelIsPrecise,
      achievement: parseFloat(achievement),
    };
  }
}

export async function fetchFriendScores(
  friendIdx: string,
  difficulty: Difficulty,
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>
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
    processRow(row, difficulty, songPropsByName, state)
  );
  return recordsWithNull.filter((record) => record != null);
}
