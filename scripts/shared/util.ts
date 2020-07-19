const queryParams = new URLSearchParams(document.location.search);
let lang: "en" | "zh" = "en";
if (queryParams.get("hl")) {
  lang = queryParams.get("hl").startsWith("zh") ? "zh" : "en";
} else if (navigator.language.startsWith("zh")) {
  lang = "zh";
}
export const LANG = lang;
const UIString = {
  zh: {
    advStart: "🕓 下載黃譜成績中…",
    advDone: "✔ 黃譜成績下載完畢！",
    expStart: "🕓 下載紅譜成績中…",
    expDone: "✔ 紅譜成績下載完畢！",
    masStart: "🕓 下載紫譜成績中…",
    masDone: "✔ 紫譜成績下載完畢！",
    remStart: "🕓 下載白譜成績中…",
    remDone: "✔ 白譜成績下載完畢！",
  },
  en: {
    advStart: "🕓 Downloading Advanced scores…",
    advDone: "✔ Advanced scores downloaded!",
    expStart: "🕓 Downloading Expert scores…",
    expDone: "✔ Expert scores downloaded!",
    masStart: "🕓 Downloading Master scores…",
    masDone: "✔ Master scores downloaded!",
    remStart: "🕓 Downloading Re:Master scores…",
    remDone: "✔ Re:Master scores downloaded!",
  },
}[LANG];

export const SCORE_URLS = new Map([
  ["Re:MASTER", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=4"],
  ["MASTER", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=3"],
  ["EXPERT", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=2"],
  ["ADVANCED", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=1"],
]);

export function handleError(msg: string) {
  alert(msg);
}

export function statusText(what: string, end?: boolean) {
  switch (what) {
    case "Re:MASTER":
      return end ? UIString.remDone : UIString.remStart;
    case "MASTER":
      return end ? UIString.masDone : UIString.masStart;
    case "EXPERT":
      return end ? UIString.expDone : UIString.expStart;
    case "ADVANCED":
      return end ? UIString.advDone : UIString.advStart;
  }
}

function getSongName(row: HTMLElement) {
  return (row.getElementsByClassName("music_name_block")[0] as HTMLElement).innerText;
}

function getChartLevel(row: HTMLElement) {
  return (row.getElementsByClassName("music_lv_block")[0] as HTMLElement).innerText;
}

function getChartDifficulty(row: HTMLElement) {
  const d = row.children[0].className.match(/music_([a-z]+)_score_back/)[1].toUpperCase();
  return d.indexOf("RE") === 0 ? "Re:MASTER" : d;
}

function getChartType(row: HTMLElement) {
  if (row.id) {
    return row.id.includes("sta_") ? "STANDARD" : "DX";
  }
  return (row.children[1] as HTMLImageElement).src.includes("_standard") ? "STANDARD" : "DX";
}

function getAchievement(row: HTMLElement) {
  const ach = row.querySelector(".music_score_block.w_120") as HTMLElement;
  return ach && ach.innerText;
}

function processRow(row: HTMLElement, state: {genre: string; scoreList: string[]}) {
  const isGenreRow = row.classList.contains("screw_block");
  const isScoreRow =
    row.classList.contains("w_450") &&
    row.classList.contains("m_15") &&
    row.classList.contains("p_r") &&
    row.classList.contains("f_0");
  if (isGenreRow) {
    state.genre = row.innerText;
  } else if (isScoreRow) {
    const songName = getSongName(row);
    const level = getChartLevel(row);
    const difficulty = getChartDifficulty(row);
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

export async function fetchPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

export async function fetchScores(url: string, scoreList: string[]) {
  const dom = await fetchPage(url);
  const rows = dom.querySelectorAll(".main_wrapper.t_c .m_15") as NodeListOf<HTMLElement>;
  const state = {genre: "", scoreList: scoreList};
  rows.forEach((row) => processRow(row, state));
}
