import {getChartLevel, getChartType, getSongName} from './fetch-score-util';
import {fetchPage} from './util';

const SCORE_URLS = new Map([
  [
    "Re:MASTER",
    "/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=4&idx=",
  ],
  ["MASTER", "/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=3&idx="],
  ["EXPERT", "/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=2&idx="],
  ["ADVANCED", "/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=1&idx="],
]);
export const FRIEND_DIFFICULTIES = SCORE_URLS.keys();

function getAchievement(row: HTMLElement): string | null {
  const ach = row.querySelector("td.w_120.f_b:last-child") as HTMLElement;
  const achText = ach && ach.innerText;
  return achText !== "0" ? achText : null;
}

function processRow(
  row: HTMLElement,
  difficulty: string,
  state: {genre: string; scoreList: string[]}
) {
  const isGenreRow = row.classList.contains("screw_block");
  const isScoreRow =
    row.classList.contains("w_450") &&
    row.classList.contains("m_15") &&
    row.classList.contains("p_3") &&
    row.classList.contains("f_0");
  if (isGenreRow) {
    state.genre = row.innerText;
  } else if (isScoreRow) {
    const songName = getSongName(row);
    const level = getChartLevel(row);
    const chartType = getChartType(row);
    const achievement = getAchievement(row);
    if (!achievement) {
      return;
    }
    state.scoreList.push(
      [songName, state.genre, difficulty, level, chartType, achievement].join("\t")
    );
  }
}

export async function fetchScores(friendIdx: string, difficulty: string, scoreList: string[]) {
  let url = SCORE_URLS.get(difficulty);
  if (!url) {
    return;
  }
  url += friendIdx;
  const dom = await fetchPage(url);
  const rows = dom.querySelectorAll(".main_wrapper.t_c .m_15") as NodeListOf<HTMLElement>;
  const state = {genre: "", scoreList: scoreList};
  rows.forEach((row) => processRow(row, difficulty, state));
}
