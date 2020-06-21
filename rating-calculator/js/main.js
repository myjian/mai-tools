const DX_PLUS_VERSION_TEXT = "plus";

const queryParams = new URLSearchParams(document.location.search);
const dxVersionQueryParam = queryParams.get("dxVersion");
const quickLookupArea = document.querySelector(".quickLookup");
const rankFactorModeSelect = document.getElementById("rankFactorMode");

async function readInnerLvFromText(text) {
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
  return innerLvMap;
}

async function readPlayerScoreFromText(text, isDxPlus) {
  const lines = text.split("\n");
  const playerScores = [];
  for (const line of lines) {
    const scoreRecord = parseScoreLine(line, isDxPlus);
    if (scoreRecord) {
      playerScores.push(scoreRecord);
    }
  }
  return playerScores;
}

document.getElementById("calculateRatingBtn").addEventListener("click", async (evt) => {
  evt.preventDefault();
  const innerLvInput = document.getElementById("innerLvInput");
  const innerLvMap = await readInnerLvFromText(innerLvInput.value);
  console.log("Inner Level:");
  console.log(innerLvMap);

  const isDxPlus = rankFactorModeSelect.value === DX_PLUS_VERSION_TEXT;
  console.log(`isDxPlus ${isDxPlus}`);
  const playerScoreInput = document.getElementById("playerScoreInput");
  const playerScores = await readPlayerScoreFromText(playerScoreInput.value, isDxPlus);
  console.log("Player Score:");
  console.log(playerScores);

  if (playerScores.length) {
    const ratingData = await analyzePlayerRating(innerLvMap, playerScores);
    console.log("Rating Data:");
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
    
    renderTopScores(
      ratingData.dxTopScores,
      document.getElementById("dxTopSongsThead"),
      document.getElementById("dxTopSongsTbody")
    );
    renderTopScores(
      ratingData.finaleTopScores,
      document.getElementById("finaleTopSongsThead"),
      document.getElementById("finaleTopSongsTbody")
    );
    
    const outputArea = document.querySelector(".outputArea");
    outputArea.classList.remove("hidden");
    outputArea.scrollIntoView({behavior: "smooth"});
  }
  quickLookupArea.classList.remove("hidden");
});

const officialLvSelect = document.getElementById("officialLvSelect");

function performQuickLookup() {
  calculateChartRatings(
    rankFactorModeSelect.value === DX_PLUS_VERSION_TEXT,
    officialLvSelect.value,
    document.getElementById("quickLookupThead"),
    document.getElementById("quickLookupTbody")
  );
}

if (dxVersionQueryParam) {
  rankFactorModeSelect.value =
    dxVersionQueryParam === DX_PLUS_VERSION_TEXT
    ? DX_PLUS_VERSION_TEXT
    : "dx";
}

initializeQuickLookup(officialLvSelect);
performQuickLookup();

rankFactorModeSelect.addEventListener("change", performQuickLookup);
officialLvSelect.addEventListener("change", performQuickLookup);

if (queryParams.get("quickLookup") != null) {
  quickLookupArea.classList.remove("hidden");
}

const symbol = document.querySelector("footer span");
symbol.addEventListener("dblclick", () => {
  const isDxPlus = rankFactorModeSelect.value === DX_PLUS_VERSION_TEXT;
  const lessMagic = MAGIC_NUMBERS.map(k => k - 1);
  if (isDxPlus) {
    lessMagic.splice(
      lessMagic.length - 3,
      0,
      ...MAGIC_NUMBERS2.map(k => k - 1)
    );
  }
  console.log(String.fromCharCode(...lessMagic));
});
