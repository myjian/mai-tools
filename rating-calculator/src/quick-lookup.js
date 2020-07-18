import {getRankDefinitions} from './rank-functions.js';
import {calculateRatingRange} from './rating-functions.js';

const MIN_RANK_OPTION = "A";
const RANK_FACTOR_CELL_BASE_CLASSNAME = "qlRankFactorCell";
const RANK_FACTOR_CELL_CLASSNAMES = ["qlRankTitleCell", "qlThresholdCell"];

function renderRankFactorRow(columnValues, rowClassnames, isHeading) {
  const tr = document.createElement("tr");
  for (const cn of rowClassnames) {
    tr.classList.add(cn);
  }
  columnValues.forEach((v, index) => {
    const cell = document.createElement(
      (isHeading || index === 0) ? "th" : "td"
    );
    cell.innerText = v;
    cell.classList.add(RANK_FACTOR_CELL_BASE_CLASSNAME);
    if (index < RANK_FACTOR_CELL_CLASSNAMES.length) {
      cell.classList.add(RANK_FACTOR_CELL_CLASSNAMES[index]);
    }
    tr.append(cell);
  });
  return tr;
}

export function calculateRankMultipliers(
  isDxPlus,
  thead,
  tbody
) {
  thead.innerHTML = "";
  tbody.innerHTML = "";
  thead.appendChild(
    renderRankFactorRow(
      ["Rank", "達成率", "係數", "倍率 (係數 × 達成率)"],
      [], // rowClassname
      true, // isHeading
    )
  );
  const rankDefs = getRankDefinitions(isDxPlus);
  const stopIndex = rankDefs.findIndex(r => r.title === MIN_RANK_OPTION) + 1;
  rankDefs.slice(0, stopIndex).forEach((r, idx, arr) => {
    const minMultiplier = r.th * r.factor / 100;
    const maxMultiplier = idx > 0 ? (arr[idx-1].th - 0.0001) * r.factor / 100 : minMultiplier;
    const minMulText = minMultiplier.toFixed(3);
    const maxMulText = maxMultiplier.toFixed(3);
    const multiplierRange = minMulText !== maxMulText ? `${minMulText} - ${maxMulText}` : minMulText;
    tbody.appendChild(
      renderRankFactorRow(
        [r.title, r.th, r.factor, multiplierRange],
        [],
        false
      )
    );
  });
}
