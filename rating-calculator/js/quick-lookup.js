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
      // Remove last value
      values.pop();
    }
    values.push(`${r.title}\n>${r.th}%\n${factor}`)
    lastFactor = factor;
    if (r.title === MIN_RANK_OPTION) {
      break;
    }
  }
  return _renderRankDistributionRowHelper(
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
  RANK_DEFINITIONS.reduce((done, r, idx, arr) => {
    if (done) {
      return true;
    }
    const factor = getRatingFactor(r, isDxPlus);
    let maxAc = idx > 0 ? arr[idx - 1].th : 100.5;
    if (idx > 1 && factor === getRatingFactor(arr[idx-1], isDxPlus)) {
      // Deal with double entries of SS+
      // DX plus and DX compatibility is hard :-(
      values.pop();
      maxAc = arr[idx - 2].th;
    }
    maxAc -= 0.0001;
    const minRating = Math.floor(innerLv * r.th * factor / 100);
    const maxRating = Math.floor(innerLv * maxAc * factor / 100);
    if (maxRating > minRating) {
      values.push(`${minRating} - ${maxRating}`);
    } else {
      values.push(minRating.toString());
    }

    if (r.title === MIN_RANK_OPTION) {
      return true; // mark done = true
    }
  }, false);
  return _renderRankDistributionRowHelper(
    values,
    false, // isHeading
    false, // showTotal
    "", // rowClassname
    LEVEL_RATING_CELL_BASE_CLASSNAME,
    LEVEL_RATING_CELL_CLASSNAMES
  );
}

function calculateChartRatings(
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

function initializeQuickLookup(officialLvSelect) {
  officialLvSelect.innerHTML = "";
  _getOfficialLvOptions().forEach((option) => {
    officialLvSelect.appendChild(option);
  });
}
