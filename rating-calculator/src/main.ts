import {readFromCache, writeToCache} from './cache';
import {getCandidateSongs} from './candidate-songs';
import {getGradeByIndex} from './grade';
import {parseInnerLevelLine} from './inner-lv-parser';
import {iWantSomeMagic} from './magic';
import {parseScoreLine} from './player-score-parser';
import {calculateRankMultipliers} from './quick-lookup';
import {
  renderRankDistributionPerDifficulty,
  renderRankDistributionPerLevel,
} from './rank-distribution-visualizer';
import {analyzePlayerRating} from './rating-analyzer';
import {renderSongScores} from './score-record-visualizer';
import {DX_GAME_VERSION, DX_PLUS_GAME_VERSION} from './shared-constants';
import {SongProperties} from './types';

const CACHE_KEY_DX_INNER_LEVEL = "dxInnerLv";
const CACHE_KEY_DX_PLUS_INNER_LEVEL = "dxPlusInnerLv";

const queryParams = new URLSearchParams(document.location.search);
const dxVersionQueryParam = queryParams.get("gameVersion");
const quickLookupArea = document.querySelector(".quickLookup");
const gameVersionSelect = document.getElementById("gameVersion") as HTMLSelectElement;
const innerLvInput = document.getElementById("innerLvInput") as HTMLTextAreaElement;
const playerScoreInput = document.getElementById("playerScoreInput") as HTMLTextAreaElement;

let playerGradeIndex = 0;

function getIsDxPlus() {
  return gameVersionSelect.value === DX_PLUS_GAME_VERSION.toString();
}

function handleGameVersionChange() {
  calculateRankMultipliers(
    getIsDxPlus(),
    document.getElementById("quickLookupThead") as HTMLTableSectionElement,
    document.getElementById("quickLookupTbody") as HTMLTableSectionElement
  );
}

function readSongProperties(isDxPlus: boolean): Promise<Map<string, SongProperties[]>> {
  const processText = (text: string) => {
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
  };
  return new Promise((resolve) => {
    // Read from user input
    const input = innerLvInput.value;
    if (input.length > 0) {
      resolve(processText(input));
      return;
    }
    // Read from cache
    const cacheKey = isDxPlus ? CACHE_KEY_DX_PLUS_INNER_LEVEL : CACHE_KEY_DX_INNER_LEVEL;
    const cachedInnerLv = readFromCache(cacheKey);
    if (cachedInnerLv) {
      innerLvInput.value = cachedInnerLv;
      resolve(processText(cachedInnerLv));
      return;
    }
    // Read from Internet
    console.log("Magic happening...");
    fetch(iWantSomeMagic(isDxPlus))
      .then(response => response.text())
      .then(responseText => {
        innerLvInput.value = responseText;
        resolve(processText(responseText));
      });
  });
}

async function readPlayerScoreFromText(text: string, isDxPlus: boolean) {
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

    const playerGrade = playerGradeIndex > 0 ? getGradeByIndex(playerGradeIndex, isDxPlus) : null;
    if (playerGrade) {
      ratingData.totalRating += playerGrade.bonus;
      document.getElementById("gradeTitle").innerText = playerGrade.title;
      document.getElementById("gradeBonus").innerText = playerGrade.bonus.toString();
      document.getElementById("gradeRating").classList.remove("hidden");
    }

    const totalRating = document.getElementById("totalRating");
    totalRating.innerText = ratingData.totalRating.toString();

    const newSongsRating = document.getElementById("newSongsRating");
    newSongsRating.innerText = ratingData.newSongsRating.toString();

    const oldSongsRating = document.getElementById("oldSongsRating");
    oldSongsRating.innerText = ratingData.oldSongsRating.toString();

    const newTopScores = ratingData.newSongScores.slice(0, ratingData.newTopSongCount);
    const oldTopScores = ratingData.oldSongScores.slice(0, ratingData.oldTopSongCount);
    const combinedTopScores = [].concat(newTopScores, oldTopScores);
    renderRankDistributionPerLevel(
      combinedTopScores,
      document.getElementById("lrDistThead") as HTMLTableSectionElement,
      document.getElementById("lrDistTbody") as HTMLTableSectionElement
    );
    renderRankDistributionPerDifficulty(
      combinedTopScores,
      document.getElementById("drDistThead") as HTMLTableSectionElement,
      document.getElementById("drDistTbody") as HTMLTableSectionElement
    );

    renderSongScores(
      newTopScores,
      false, // isCandidate
      document.getElementById("newTopSongsThead") as HTMLTableSectionElement,
      document.getElementById("newTopSongsTbody") as HTMLTableSectionElement
    );
    renderSongScores(
      oldTopScores,
      false, // isCandidate
      document.getElementById("oldTopSongsThead") as HTMLTableSectionElement,
      document.getElementById("oldTopSongsTbody") as HTMLTableSectionElement
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
      document.getElementById("newCandidateSongsThead") as HTMLTableSectionElement,
      document.getElementById("newCandidateSongsTbody") as HTMLTableSectionElement
    );
    renderSongScores(
      oldCandidateScores,
      true, // isCandidate
      document.getElementById("oldCandidateSongsThead") as HTMLTableSectionElement,
      document.getElementById("oldCandidateSongsTbody") as HTMLTableSectionElement
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
    ? DX_PLUS_GAME_VERSION.toString()
    : DX_GAME_VERSION.toString();
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
      let payloadAsInt;
      switch (evt.data.action) {
        case "gameVersion":
          payloadAsInt = parseInt(evt.data.payload);
          if (payloadAsInt >= DX_PLUS_GAME_VERSION) {
            gameVersionSelect.value = DX_PLUS_GAME_VERSION.toString();
          }
          break;
        case "playerGrade":
          payloadAsInt = parseInt(evt.data.payload);
          if (payloadAsInt) {
            playerGradeIndex = payloadAsInt;
          }
          break;
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
