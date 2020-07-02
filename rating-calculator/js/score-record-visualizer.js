import {getRankTitle} from './rank-functions.js';
import {DIFFICULTY_CLASSNAME_MAP} from './shared-constants.js';

const SCORE_RECORD_ROW_CLASSNAME = "scoreRecordRow";
const SCORE_RECORD_CELL_BASE_CLASSNAME = "scoreRecordCell";
const SCORE_RECORD_CELL_CLASSNAMES = [
  "orderCell",
  "songTitleCell",
  "difficultyCell",
  "innerLvCell",
  "achievementCell",
  "rankFactorCell",
  "ratingCell",
];

function _renderScoreRowHelper(columnValues, rowClassnames, isHeading) {
  const tr = document.createElement("tr");
  for (const cn of rowClassnames) {
    tr.classList.add(cn);
  }
  columnValues.forEach((v, index) => {
    const cell = document.createElement(isHeading ? "th" : "td");
    cell.innerText = v;
    cell.classList.add(SCORE_RECORD_CELL_BASE_CLASSNAME);
    cell.classList.add(SCORE_RECORD_CELL_CLASSNAMES[index]);
    tr.appendChild(cell);
  });
  return tr;
}

function renderScoreHeadRow() {
  return _renderScoreRowHelper(
    ["編號", "歌曲", "難度", "譜面\n定數", "達成率", "Rank\n係數", "Rating"],
    [],
    true
  );
}

function renderScoreRow(record, index) {
  let lvText = record.innerLv.toFixed(1);
  if (record.estimate) {
    lvText = "*" + lvText;
  }
  return _renderScoreRowHelper(
    [
      index,
      record.songName,
      record.difficulty,
      lvText,
      record.achievement.toFixed(4) + "%",
      `${getRankTitle(record.achievement)} (${record.rankFactor})`,
      Math.floor(record.rating),
    ],
    [SCORE_RECORD_ROW_CLASSNAME, DIFFICULTY_CLASSNAME_MAP.get(record.difficulty)],
    false
  );
}

export function renderTopScores(records, thead, tbody) {
  thead.innerHTML = "";
  tbody.innerHTML = "";
  thead.appendChild(renderScoreHeadRow());
  records.forEach((r, index) => {
    tbody.appendChild(renderScoreRow(r, index + 1))
  });
}
