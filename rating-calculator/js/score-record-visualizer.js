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

function _renderScoreRowHelper(columnValues, rowClassName, isHeading) {
  const tr = document.createElement("tr");
  if (rowClassName) {
    tr.classList.add(rowClassName);
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
    "",
    true
  );
}

function renderScoreRow(record, index) {
  return _renderScoreRowHelper([
    index,
    record.songName,
    record.difficulty,
    record.innerLv.toFixed(1),
    record.achievement.toFixed(4) + "%",
    record.rankFactor,
    record.rating,
  ], DIFFICULTY_CLASSNAME_MAP.get(record.difficulty), false);
}