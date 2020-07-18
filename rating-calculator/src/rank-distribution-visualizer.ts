import {getRankDefinitions, getRankTitle} from './rank-functions';
import {DIFFICULTIES, DIFFICULTY_CLASSNAME_MAP, OFFICIAL_LEVELS} from './shared-constants';
import {ChartRecord} from './types';

const THRESHOLD_TO_PLUS = 0.6;
const LEVEL_RANK_CELL_BASE_CLASSNAME = "levelRankCell";
const LEVEL_RANK_CELL_CLASSNAMES = ["officialLevelCell"];
const DIFF_RANK_CELL_BASE_CLASSNAME = "diffRankCell";
const DIFF_RANK_TOP_LEFT_CELL_CLASSNAME = "difficultyRankDistHead";
const LAST_CELL_CLASSNAME = "totalCell";

function getOfficialLevel(level: number) {
  const baseLevel = Math.floor(level);
  const minorLevel = level - baseLevel;
  return minorLevel > THRESHOLD_TO_PLUS ? baseLevel + "+" : baseLevel.toString();
}

function getRankDistribution(scoreList: ReadonlyArray<ChartRecord>) {
  const countPerRank = new Map();
  for (const rankDef of getRankDefinitions(true)) {
    countPerRank.set(rankDef.title, 0);
  }
  scoreList.forEach((record) => {
    const rankTitle = getRankTitle(record.achievement);
    const rankCount = countPerRank.get(rankTitle);
    countPerRank.set(rankTitle, rankCount + 1);
  });
  return countPerRank;
}

function renderRankDistributionRowHelper(
  values: ReadonlyArray<string>,
  isHeading: boolean,
  showTotal: boolean,
  rowClassname: string | undefined,
  baseCellClassname: string,
  perColumnClassnames: ReadonlyArray<string>,
) {
  const tr = document.createElement("tr");
  if (rowClassname) {
    tr.classList.add(rowClassname);
  }
  let cell: HTMLTableCellElement;
  values.forEach((v, index) => {
    const tagName = (isHeading || index === 0) ? "th" : "td"
    cell = document.createElement(tagName);
    cell.innerText = v;
    cell.classList.add(baseCellClassname);
    if (index < perColumnClassnames.length) {
      cell.classList.add(perColumnClassnames[index]);
    }
    tr.appendChild(cell);
  });
  if (showTotal) {
    cell.classList.add(LAST_CELL_CLASSNAME);
  }
  return tr;
}

function renderRankDistributionHeadRow(
  minRank: string,
  showTotal: boolean,
  baseCellClassname: string | undefined,
  perColumnClassnames: ReadonlyArray<string>,
) {
  const values = [""];
  for (const rankDef of getRankDefinitions(true)) {
    values.push(rankDef.title);
    if (rankDef.title === minRank) {
      break;
    }
  }
  if (showTotal) {
    values.push("TOTAL");
  }
  return renderRankDistributionRowHelper(
    values, true, showTotal, "", baseCellClassname, perColumnClassnames
  );
}

function renderRankDistributionRow(
  rowHead: string,
  rankDist: ReturnType<typeof getRankDistribution>,
  minRank: string,
  showTotal: boolean,
  rowClassname: string | undefined,
  baseCellClassname: string,
  perColumnClassnames: ReadonlyArray<string>,
) {
  const values = [rowHead];
  let totalCount = 0;
  for (const [rank, count] of rankDist) {
    values.push(count);
    totalCount += count;
    if (rank === minRank) {
      break;
    }
  }
  if (showTotal) {
    values.push(totalCount.toString());
  }
  return renderRankDistributionRowHelper(
    values, false, showTotal, rowClassname, baseCellClassname, perColumnClassnames
  );
}

export function renderRankDistributionPerLevel(
  scoreList: ReadonlyArray<ChartRecord>,
  thead: HTMLTableSectionElement,
  tbody: HTMLTableSectionElement
) {
  thead.innerHTML = "";
  tbody.innerHTML = "";

  const scoresPerLevel = new Map();
  OFFICIAL_LEVELS.forEach((level) => {
    scoresPerLevel.set(level, []);
  });
  scoreList.forEach((record) => {
    const officialLv = getOfficialLevel(record.level);
    const levelScores = scoresPerLevel.get(officialLv);
    levelScores.push(record);
  });

  const overallRankDistribution = getRankDistribution(scoreList);
  let minRank;
  for (const [rank, count] of overallRankDistribution) {
    if (count > 0) {
      minRank = rank;
    }
  }
  thead.appendChild(renderRankDistributionHeadRow(
    minRank,
    false,
    LEVEL_RANK_CELL_BASE_CLASSNAME,
    LEVEL_RANK_CELL_CLASSNAMES
  ));
  for (const [level, levelScores] of scoresPerLevel) {
    if (levelScores.length > 0) {
      const rankDistribution = getRankDistribution(levelScores);
      tbody.appendChild(renderRankDistributionRow(
        level,
        rankDistribution,
        minRank,
        false,
        "",
        LEVEL_RANK_CELL_BASE_CLASSNAME,
        LEVEL_RANK_CELL_CLASSNAMES
      ));
    }
  }
}

export function renderRankDistributionPerDifficulty(
  scoreList: ReadonlyArray<ChartRecord>,
  thead: HTMLTableSectionElement,
  tbody: HTMLTableSectionElement,
) {
  thead.innerHTML = "";
  tbody.innerHTML = "";

  const scoresPerDifficulty = new Map();
  const difficultiesFromHardest = [].concat(DIFFICULTIES);
  difficultiesFromHardest.reverse();
  difficultiesFromHardest.forEach((d) => {
    scoresPerDifficulty.set(d, []);
  });
  scoreList.forEach((record) => {
    const scores = scoresPerDifficulty.get(record.difficulty);
    scores.push(record);
  });

  const overallRankDistribution = getRankDistribution(scoreList);
  let minRank;
  for (const [rank, count] of overallRankDistribution) {
    if (count > 0) {
      minRank = rank;
    }
  }
  thead.appendChild(renderRankDistributionHeadRow(
    minRank,
    true,
    DIFF_RANK_CELL_BASE_CLASSNAME,
    [DIFF_RANK_TOP_LEFT_CELL_CLASSNAME]
  ));
  for (const [d, scores] of scoresPerDifficulty) {
    if (scores.length > 0) {
      const rankDistribution = getRankDistribution(scores);
      tbody.appendChild(renderRankDistributionRow(
        d,
        rankDistribution,
        minRank,
        true,
        DIFFICULTY_CLASSNAME_MAP.get(d),
        DIFF_RANK_CELL_BASE_CLASSNAME,
        []
      ));
    }
  }
}
