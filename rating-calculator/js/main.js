const pageState = {};

function readInnerLvFromText(text) {
  const lines = text.split("\n");
  // innerLvMap: song name -> array of inner lv data
  // most arrays have only 1 entry, but some arrays have more than 1 entries
  // because song name duplicates or it has both DX and Standard charts.
  const innerLvMap = new Map();
  for (const line of lines) {
    const innerLvData = parseInnerLevelLine(line);
    if (innerLvData) {
      if (!innerLvMap.has(innerLvData.songName)) {
        innerLvMap.set(innerLvData.songName, []);
      }
      innerLvMap.get(innerLvData.songName).push(innerLvData);
    }
  }
  pageState.innerLvMap = innerLvMap;
  console.log("Read inner level done!");
  console.log(pageState.innerLvMap);
  return innerLvMap;
}

function readPlayerScoreFromText(text) {
  const lines = text.split("\n");
  const playerScores = [];
  for (const line of lines) {
    const scoreRecord = parseScoreLine(line);
    if (scoreRecord) {
      playerScores.push(scoreRecord);
    }
  }
  pageState.playerScores = playerScores;
  console.log("Read player score is done!");
  console.log(pageState.playerScores);
  return playerScores;
}

document.getElementById("calculateRatingBtn").addEventListener("click", (evt) => {
  evt.preventDefault();
  new Promise((resolve) => {
    const inputElem = document.getElementById("innerLvInput");
    resolve(readInnerLvFromText(inputElem.value));
  }).then((innerLvMap) => {
    const inputElem = document.getElementById("playerScoreInput");
    return {
      innerLvMap,
      playerScores: readPlayerScoreFromText(inputElem.value),
    };
  }).then((param) => {
    return analyzePlayerRating(param.innerLvMap, param.playerScores);
  }).then((ratingData) => {
    console.log(ratingData);
    
    const totalRating = document.getElementById("totalRating");
    totalRating.innerText = ratingData.totalRating;
    
    const dxRating = document.getElementById("dxRating");
    dxRating.innerText = ratingData.dxRating;

    const finaleRating = document.getElementById("finaleRating");
    finaleRating.innerText = ratingData.finaleRating;
    
    const combinedTopScores = [].concat(ratingData.dxTopScores, ratingData.finaleTopScores);
    renderRankDistributionPerLevel(
      combinedTopScores,
      document.getElementById("lrDistThead"),
      document.getElementById("lrDistTbody")
    );
    renderRankDistributionPerDifficulty(
      combinedTopScores,
      document.getElementById("drDistThead"),
      document.getElementById("drDistTbody")
    );
    
    const dxTopSongsThead = document.getElementById("dxTopSongsThead");
    dxTopSongsThead.innerHTML = "";
    dxTopSongsThead.appendChild(renderScoreHeadRow());
    const dxTopSongsTbody = document.getElementById("dxTopSongsTbody");
    dxTopSongsTbody.innerHTML = "";
    ratingData.dxTopScores.forEach((scoreRecord, index) => {
      dxTopSongsTbody.appendChild(renderScoreRow(scoreRecord, index + 1))
    });

    const finaleTopSongsThead = document.getElementById("finaleTopSongsThead");
    finaleTopSongsThead.innerHTML = "";
    finaleTopSongsThead.appendChild(renderScoreHeadRow());
    const finaleTopSongsTbody = document.getElementById("finaleTopSongsTbody");
    finaleTopSongsTbody.innerHTML = "";
    ratingData.finaleTopScores.forEach((scoreRecord, index) => {
      finaleTopSongsTbody.appendChild(renderScoreRow(scoreRecord, index + 1))
    });
    
    const outputArea = document.querySelector(".outputArea");
    outputArea.classList.remove("hidden");
    outputArea.scrollIntoView({behavior: "smooth"});

    const quickCalculation = document.querySelector(".quickCalculation");
    quickCalculation.classList.remove("hidden");
  });
});

const majorLvSelect = document.getElementById("majorLvSelect");
const minorLvSelect = document.getElementById("minorLvSelect");
const rankSelect = document.getElementById("rankSelect");
const chartRatingElem = document.getElementById("chartRating");

function performQuickCalc() {
  calculateChartRating(
    majorLvSelect.value,
    minorLvSelect.value,
    rankSelect.value,
    chartRating
  );
}


initializeQuickCalc(majorLvSelect, minorLvSelect, rankSelect);
performQuickCalc();

majorLvSelect.addEventListener("change", performQuickCalc);
minorLvSelect.addEventListener("change", performQuickCalc);
rankSelect.addEventListener("change", performQuickCalc);
