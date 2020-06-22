const DX_PLUS_VERSION_TEXT = "plus";

const queryParams = new URLSearchParams(document.location.search);
const dxVersionQueryParam = queryParams.get("dxVersion");
const quickLookupArea = document.querySelector(".quickLookup");
const rankFactorModeSelect = document.getElementById("rankFactorMode");

async function readSongPropsFromText(text) {
  const lines = text.split("\n");
  // songPropsByName: song name -> array of song properties
  // most arrays have only 1 entry, but some arrays have more than 1 entries
  // because song name duplicates or it has both DX and Standard charts.
  const songPropsByName = new Map();
  for (const line of lines) {
    const innerLvData = parseInnerLevelLine(line);
    if (innerLvData) {
      if (!songPropsByName.has(innerLvData.songName)) {
        songPropsByName.set(innerLvData.songName, []);
      }
      songPropsByName.get(innerLvData.songName).push(innerLvData);
    }
  }
  return songPropsByName;
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
  const songPropsByName = await readSongPropsFromText(innerLvInput.value);
  console.log("Inner Level:");
  console.log(songPropsByName);

  const isDxPlus = rankFactorModeSelect.value === DX_PLUS_VERSION_TEXT;
  console.log(`isDxPlus ${isDxPlus}`);
  const playerScoreInput = document.getElementById("playerScoreInput");
  const playerScores = await readPlayerScoreFromText(playerScoreInput.value, isDxPlus);
  console.log("Player Score:");
  console.log(playerScores);

  if (playerScores.length) {
    const gameVersion = isDxPlus ? DX_PLUS_GAME_VERSION : DX_GAME_VERSION;
    const ratingData = await analyzePlayerRating(
      songPropsByName,
      playerScores,
      gameVersion
    );
    console.log("Rating Data:");
    console.log(ratingData);

    const totalRating = document.getElementById("totalRating");
    totalRating.innerText = ratingData.totalRating;

    const newSongsRating = document.getElementById("newSongsRating");
    newSongsRating.innerText = ratingData.newSongsRating;

    const oldSongsRating = document.getElementById("oldSongsRating");
    oldSongsRating.innerText = ratingData.oldSongsRating;

    const newTopScores = ratingData.newSongScores.slice(0, ratingData.newTopSongCount);
    const oldTopScores = ratingData.oldSongScores.slice(0, ratingData.oldTopSongCount);
    const combinedTopScores = [].concat(newTopScores, oldTopScores);
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
      newTopScores,
      document.getElementById("newTopSongsThead"),
      document.getElementById("newTopSongsTbody")
    );
    renderTopScores(
      oldTopScores,
      document.getElementById("oldTopSongsThead"),
      document.getElementById("oldTopSongsTbody")
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
