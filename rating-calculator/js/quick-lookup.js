import {OFFICIAL_LEVELS, RANK_DEFINITIONS} from './shared-constants.js';
import {getRatingFactor} from './rank-functions.js';
import {renderRankDistributionRowHelper} from './rank-distribution-visualizer.js';
import {calculateRatingRange} from './rating-functions.js';

const DEFAULT_OFFICIAL_LEVEL_OPTION = "10";
const MIN_OFFICIAL_LEVEL_OPTION = "7";
const MIN_RANK_OPTION = "AA";
const LEVEL_RATING_CELL_BASE_CLASSNAME = "levelRatingCell";
const LEVEL_RATING_CELL_CLASSNAMES = ["innerLvCell"];

function _getOfficialLvOptions() {
  const options = [];
  for (const lv of OFFICIAL_LEVELS) {
    if (lv.endsWith("+")) {
      continue;
    }
    const option = document.createElement("option");
    option.value = lv;
    option.innerText = `${lv} & ${lv}+`;
    option.selected = lv === DEFAULT_OFFICIAL_LEVEL_OPTION;
    options.push(option);
    if (lv === MIN_OFFICIAL_LEVEL_OPTION) {
      break;
    }
  }
  options.reverse();
  return options;
}

function _renderRankRatingHeadRow(isDxPlus) {
  const values = ["Rank\n達成率\n係數"];
  let lastFactor;
  for (const r of RANK_DEFINITIONS) {
    const factor = getRatingFactor(r, isDxPlus);
    if (factor === lastFactor) {
      // discard previous value
      values.pop();
    }
    values.push(`${r.title}\n>${r.th}%\n${factor}`)
    lastFactor = factor;
    if (r.title === MIN_RANK_OPTION) {
      break;
    }
  }
  return renderRankDistributionRowHelper(
    values,
    true, // isHeading
    false, // showTotal
    "", // rowClassname
    LEVEL_RATING_CELL_BASE_CLASSNAME,
    LEVEL_RATING_CELL_CLASSNAMES
  );
}

function _renderRankRatingRow(innerLv, isDxPlus) {
  const values = [innerLv.toFixed(1)];
  let lastFactor;
  for (const r of RANK_DEFINITIONS) {
    const factor = getRatingFactor(r, isDxPlus);
    if (factor === lastFactor) {
      // discard previous value
      values.pop();
    }
    const [minRating, maxRating] = calculateRatingRange(innerLv, r, isDxPlus);
    if (maxRating > minRating) {
      values.push(`${minRating} - ${maxRating}`);
    } else {
      values.push(minRating.toString());
    }
    lastFactor = factor;
    if (r.title === MIN_RANK_OPTION) {
      break;
    }
  }
  return renderRankDistributionRowHelper(
    values,
    false, // isHeading
    false, // showTotal
    "", // rowClassname
    LEVEL_RATING_CELL_BASE_CLASSNAME,
    LEVEL_RATING_CELL_CLASSNAMES
  );
}

export function calculateChartRatings(
  isDxPlus,
  officialLvText,
  thead,
  tbody
) {
  thead.innerHTML = "";
  tbody.innerHTML = "";
  thead.appendChild(_renderRankRatingHeadRow(isDxPlus))
  const baseLevel = parseInt(officialLvText);
  const isPlus = officialLvText.endsWith("+");
  const maxInnerLevel = baseLevel + 0.9;
  let innerLv = maxInnerLevel;
  for (let i = 0; i < 10; i++) {
    tbody.appendChild(_renderRankRatingRow(innerLv, isDxPlus));
    innerLv -= 0.1;
  }
}

export function initializeQuickLookup(officialLvSelect) {
  officialLvSelect.innerHTML = "";
  _getOfficialLvOptions().forEach((option) => {
    officialLvSelect.appendChild(option);
  });
}
