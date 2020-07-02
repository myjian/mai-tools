import {readFromCache, writeToCache} from './cache.js';
import {parseInnerLevelLine} from './inner-lv-parser.js';
import {parseScoreLine} from './player-score-parser.js';
import {
  renderRankDistributionPerDifficulty,
  renderRankDistributionPerLevel,
} from './rank-distribution-visualizer.js';
import {analyzePlayerRating} from './rating-analyzer.js';
import {renderTopScores} from './score-record-visualizer.js';
import {DX_GAME_VERSION} from './shared-constants.js';
import {
  calculateChartRatings,
  initializeQuickLookup,
} from './quick-lookup.js';

const GAME_VERSION_PLUS = "plus";

const CACHE_KEY_DX_INNER_LEVEL = "dxInnerLv";
const CACHE_KEY_DX_PLUS_INNER_LEVEL = "dxPlusInnerLv";

const queryParams = new URLSearchParams(document.location.search);
const dxVersionQueryParam = queryParams.get("dxVersion");
const quickLookupArea = document.querySelector(".quickLookup");
const gameVersionSelect = document.getElementById("gameVersion");
const innerLvInput = document.getElementById("innerLvInput");
const playerScoreInput = document.getElementById("playerScoreInput");

function getIsDxPlus() {
  return gameVersionSelect.value === GAME_VERSION_PLUS;
}

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

async function calculateAndShowRating() {
  const songPropsByName = await readSongPropsFromText(innerLvInput.value);
  console.log("Inner Level:");
  console.log(songPropsByName);
  if (songPropsByName.size > 600) {
    const cacheKey = getIsDxPlus() ? CACHE_KEY_DX_PLUS_INNER_LEVEL : CACHE_KEY_DX_INNER_LEVEL;
    writeToCache(cacheKey, innerLvInput.value);
    console.log("inner lv written to cache");
  }

  const isDxPlus = getIsDxPlus();
  console.log(`isDxPlus ${isDxPlus}`);
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
}

document.getElementById("calculateRatingBtn").addEventListener("click", async (evt) => {
  evt.preventDefault();
  calculateAndShowRating();
});

const officialLvSelect = document.getElementById("officialLvSelect");

function performQuickLookup() {
  calculateChartRatings(
    getIsDxPlus(),
    officialLvSelect.value,
    document.getElementById("quickLookupThead"),
    document.getElementById("quickLookupTbody")
  );
}

function handleGameVersionChange() {
  if (innerLvInput.value.length === 0) {
    const cacheKey = getIsDxPlus() ? CACHE_KEY_DX_PLUS_INNER_LEVEL : CACHE_KEY_DX_INNER_LEVEL;
    const cachedInnerLv = readFromCache(cacheKey);
    if (cachedInnerLv) {
      console.log("inner lv read from cache");
      innerLvInput.value = cachedInnerLv;
    }
  }
  performQuickLookup();
}

if (dxVersionQueryParam) {
  gameVersionSelect.value =
    dxVersionQueryParam === GAME_VERSION_PLUS
    ? GAME_VERSION_PLUS
    : "dx";
}

initializeQuickLookup(officialLvSelect);
handleGameVersionChange();

gameVersionSelect.addEventListener("change", handleGameVersionChange);
officialLvSelect.addEventListener("change", performQuickLookup);

if (queryParams.get("quickLookup") != null) {
  quickLookupArea.classList.remove("hidden");
}

window.addEventListener("message", (evt) => {
  if (event.origin === "https://maimaidx-eng.com/" || event.origin === "https://maimaidx.jp/") {
    switch (evt.data.action) {
      case "replacePlayerScore":
        playerScoreInput.value = evt.data.payload;
        calculateAndShowRating();
        break;
      case "appendPlayerScore":
        playerScoreInput.value += evt.data.payload;
        break;
    }
  }
});
