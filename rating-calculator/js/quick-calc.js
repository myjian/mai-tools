const DEFAULT_SELECTED_MAJOR_CHART_LEVEL = 11;
const DEFAULT_SELECTED_MINOR_CHART_LEVEL = 2;
const DEFAULT_SELECTED_RANK_TITLE = "SSS";
const MIN_MAJOR_LEVEL_OPTION = 7;
const MIN_RANK_OPTION = "A";

function getMajorLvOptions() {
  const options = [];
  for (let i = MAX_CHART_LEVEL; i >= MIN_MAJOR_LEVEL_OPTION; i--) {
    const lv = i.toString();
    const option = document.createElement("option");
    option.value = lv;
    option.innerText = lv;
    option.selected = i === DEFAULT_SELECTED_MAJOR_CHART_LEVEL;
    options.push(option);
  }
  return options;
}

function getMinorLvOptions() {
  const options = [];
  for (let i = 9; i >= 0; i--) {
    const lv = i.toString();
    const option = document.createElement("option");
    option.value = lv;
    option.innerText = lv;
    option.selected = i === DEFAULT_SELECTED_MINOR_CHART_LEVEL;
    options.push(option);
  }
  return options;
}

function getRankOptions() {
  const options = [];
  for (const def of RANK_DEFINITIONS) {
    if (options.length && def.title === options[options.length - 1].innerText) {
      continue;
    }
    const option = document.createElement("option");
    option.value = def.factor * def.th / 100;
    option.innerText = def.title;
    option.selected = def.title === DEFAULT_SELECTED_RANK_TITLE;
    options.push(option);
    if (def.title === MIN_RANK_OPTION) {
      break;
    }
  }
  return options;
}

// multiplier = achievement * rankFactor
function calculateChartRating(majorLvText, minorLvText, multiplierText, outputElem) {
  const songFactor = parseFloat(majorLvText + "." + minorLvText);
  const multiplier = parseFloat(multiplierText);
  outputElem.innerText = Math.floor(songFactor * multiplier);
}

function initializeQuickCalc(majorLvSelect, minorLvSelect, rankSelect) {
  getMajorLvOptions().forEach((option) => {
    majorLvSelect.appendChild(option);
  });
  getMinorLvOptions().forEach((option) => {
    minorLvSelect.appendChild(option);
  });
  getRankOptions().forEach((option) => {
    rankSelect.appendChild(option);
  });
  
}