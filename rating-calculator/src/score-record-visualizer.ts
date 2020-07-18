import {getRankTitle} from './rank-functions';
import {DIFFICULTY_CLASSNAME_MAP} from './shared-constants';
import {ChartRecordWithRating} from './types';

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

function _renderScoreRowHelper(
  columnValues: ReadonlyArray<string>,
  rowClassnames: ReadonlyArray<string>,
  isHeading: boolean
) {
  const tr = document.createElement("tr");
  for (const cn of rowClassnames) {
    tr.classList.add(cn);
  }
  columnValues.forEach((v, index) => {
    const cell = document.createElement(isHeading ? "th" : "td");
    cell.innerText = v;
    cell.classList.add(SCORE_RECORD_CELL_BASE_CLASSNAME);
    cell.classList.add(SCORE_RECORD_CELL_CLASSNAMES[index]);
    tr.append(cell);
  });
  return tr;
}

function renderScoreHeadRow(isCandidate: boolean) {
  const columns = ["編號", "歌曲", "難度", "譜面\n定數", "達成率", "Rank\n係數", "Rating"];
  if (isCandidate) {
    columns[columns.length - 2] = "下個\n目標";
    columns[columns.length - 1] = "下個\nRating";
  }
  return _renderScoreRowHelper(columns, [], true);
}

function renderScoreRow(record: ChartRecordWithRating, isCandidate: boolean, index: number) {
  let lvText = record.level.toFixed(1);
  if (record.levelIsEstimate) {
    lvText = "*" + lvText;
  }
  const rankText = isCandidate
    ? Array.from(record.nextRanks.keys()).join("\n")
    : `${getRankTitle(record.achievement)} (${record.rankFactor})`;
  const ratingText = isCandidate
    ? Array.from(record.nextRanks.values())
        .map((r) => r.minRt)
        .join("\n")
    : Math.floor(record.rating).toString();
  const columns = [
    index.toString(),
    record.songName,
    record.difficulty,
    lvText,
    record.achievement.toFixed(4) + "%",
    rankText,
    ratingText,
  ];
  return _renderScoreRowHelper(
    columns,
    [SCORE_RECORD_ROW_CLASSNAME, DIFFICULTY_CLASSNAME_MAP.get(record.difficulty)],
    false
  );
}

export function renderSongScores(
  records: ReadonlyArray<ChartRecordWithRating>,
  isCandidate: boolean,
  thead: HTMLTableSectionElement,
  tbody: HTMLTableSectionElement
) {
  thead.innerHTML = "";
  tbody.innerHTML = "";
  thead.append(renderScoreHeadRow(isCandidate));
  records.forEach((r, index) => {
    tbody.append(renderScoreRow(r, isCandidate, index + 1));
  });
}
