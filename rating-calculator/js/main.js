import {readFromCache, writeToCache} from './cache.js';
import {getCandidateSongs} from './candidate-songs.js';
import {parseInnerLevelLine} from './inner-lv-parser.js';
import {parseScoreLine} from './player-score-parser.js';
import {
  renderRankDistributionPerDifficulty,
  renderRankDistributionPerLevel,
} from './rank-distribution-visualizer.js';
import {analyzePlayerRating} from './rating-analyzer.js';
import {renderSongScores} from './score-record-visualizer.js';
import {DX_GAME_VERSION, DX_PLUS_GAME_VERSION} from './shared-constants.js';
import {calculateRankMultipliers} from './quick-lookup.js';
import {iWantSomeMagic} from './magic.js';

const CACHE_KEY_DX_INNER_LEVEL = "dxInnerLv";
const CACHE_KEY_DX_PLUS_INNER_LEVEL = "dxPlusInnerLv";

const queryParams = new URLSearchParams(document.location.search);
const dxVersionQueryParam = queryParams.get("gameVersion");
const quickLookupArea = document.querySelector(".quickLookup");
const gameVersionSelect = document.getElementById("gameVersion");
const innerLvInput = document.getElementById("innerLvInput");
const playerScoreInput = document.getElementById("playerScoreInput");

function getIsDxPlus() {
  return gameVersionSelect.value === DX_PLUS_GAME_VERSION.toString();
}

function handleGameVersionChange() {
  const cacheKey = getIsDxPlus() ? CACHE_KEY_DX_PLUS_INNER_LEVEL : CACHE_KEY_DX_INNER_LEVEL;
  const cachedInnerLv = readFromCache(cacheKey);
  if (cachedInnerLv) {
    innerLvInput.value = cachedInnerLv;
  }
  calculateRankMultipliers(
    getIsDxPlus(),
    document.getElementById("quickLookupThead"),
    document.getElementById("quickLookupTbody")
  );
}

function readSongProperties(isDxPlus) {
  const processText = (lines) => {
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
  };
  return new Promise((resolve) => {
    let linesFromInput = innerLvInput.value.split("\n");
    if (linesFromInput.length > 1) {
      resolve(processText(linesFromInput));
    } else {
      console.log("Magic happening...");
      fetch(iWantSomeMagic(isDxPlus))
        .then(response => response.text())
        .then(responseText => {
          innerLvInput.value = responseText;
          resolve(processText(responseText.split("\n")));
        });
    }
  });
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
  const isDxPlus = getIsDxPlus();
  console.log(`isDxPlus ${isDxPlus}`);
  const songPropsByName = await readSongProperties(isDxPlus);
  console.log("Inner Level:");
  console.log(songPropsByName);
  if (songPropsByName.size > 600) {
    const cacheKey = isDxPlus ? CACHE_KEY_DX_PLUS_INNER_LEVEL : CACHE_KEY_DX_INNER_LEVEL;
    writeToCache(cacheKey, innerLvInput.value);
  }

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

    renderSongScores(
      newTopScores,
      false, // isCandidate
      document.getElementById("newTopSongsThead"),
      document.getElementById("newTopSongsTbody")
    );
    renderSongScores(
      oldTopScores,
      false, // isCandidate
      document.getElementById("oldTopSongsThead"),
      document.getElementById("oldTopSongsTbody")
    );

    const newCandidateScores = getCandidateSongs(
      ratingData.newSongScores,
      ratingData.newTopSongCount,
      isDxPlus
    );
    const oldCandidateScores = getCandidateSongs(
      ratingData.oldSongScores,
      ratingData.oldTopSongCount,
      isDxPlus
    );
    renderSongScores(
      newCandidateScores,
      true, // isCandidate
      document.getElementById("newCandidateSongsThead"),
      document.getElementById("newCandidateSongsTbody")
    );
    renderSongScores(
      oldCandidateScores,
      true, // isCandidate
      document.getElementById("oldCandidateSongsThead"),
      document.getElementById("oldCandidateSongsTbody")
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

if (dxVersionQueryParam) {
  gameVersionSelect.value =
    dxVersionQueryParam === DX_PLUS_GAME_VERSION.toString()
    ? DX_PLUS_GAME_VERSION
    : DX_GAME_VERSION;
}

handleGameVersionChange();
gameVersionSelect.addEventListener("change", handleGameVersionChange);

if (queryParams.get("quickLookup") === "hide") {
  quickLookupArea.classList.add("hidden");
}

if (window.opener) {
  window.addEventListener("message", (evt) => {
    console.log(evt.origin, evt.data);
    if (evt.origin === "https://maimaidx-eng.com" || evt.origin === "https://maimaidx.jp") {
      switch (evt.data.action) {
        case "replacePlayerScore":
          playerScoreInput.value = evt.data.payload;
          break;
        case "appendPlayerScore":
          playerScoreInput.value += evt.data.payload + "\n";
          break;
        case "calculateRating":
          calculateAndShowRating();
          break;
      }
    }
  });
  const referrer = document.referrer && new URL(document.referrer).origin;
  if (referrer) {
    window.opener.postMessage("ready", referrer);
  } else {
    window.opener.postMessage("ready", "https://maimaidx-eng.com");
    window.opener.postMessage("ready", "https://maimaidx.jp");
  }
}
