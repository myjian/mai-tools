import {DIFFICULTIES} from './shared-constants.js';

const NUM_TOP_NEW_SONGS = 15;
const NUM_TOP_OLD_SONGS = 25;
const MIN_LEVEL = 1;

function compareSongRatings(record1, record2) {
  if (record1.rating > record2.rating) {
    return -1;
  }
  if (record2.rating > record1.rating) {
    return 1;
  }
  if (record1.innerLv > record2.innerLv) {
    return -1;
  }
  if (record2.innerLv > record1.innerLv) {
    return 1;
  }
  if (record1.achievement > record2.achievement) {
    return -1;
  }
  if (record2.achievement < record1.achievement) {
    return 1;
  }
  return 0;
}

function _getDefaultLevel(officialLevel) {
  if (!officialLevel) {
    return MIN_LEVEL;
  }
  const baseLevel = parseInt(officialLevel);
  // 9 : 9.0 - 9.6
  // 9+: 9.7 - 9.9
  return officialLevel.endsWith("+") ? baseLevel + 0.7 : baseLevel;
}

function getSongNickname(songName, genre) {
  if (songName === "Link") {
    return genre.includes("niconico") ? "Link(nico)" : "Link(org)"
  }
  return songName;
}

function getSongProperties(songPropsByName, songName, genre, chartType) {
  let songPropsArray = songPropsByName.get(songName);
  if (songPropsArray && songPropsArray.length > 0) {
    if (songPropsArray.length > 1) {
      // Song has multiple charts
      const isDX = chartType === "DX" ? 1 : 0;
      songPropsArray = songPropsArray.filter(d => d.dx === isDX);
      if (songPropsArray.length > 1) {
        // Duplicate song names
        const nickname = getSongNickname(songName, genre);
        songPropsArray = songPropsArray.filter(d => d.nickname === nickname);
      }
    }
    if (songPropsArray.length === 1) {
      return songPropsArray[0];
    }
  }
  console.warn(`Could not find song properties for ${songName}`);
  return null;
}

function analyzeSongRating(record, songProps) {
  let innerLevel = _getDefaultLevel(record.level);
  let levelIsEstimate = true;
  if (songProps) {
    const lvIndex = DIFFICULTIES.indexOf(record.difficulty);
    const lv = songProps.lv[lvIndex];
    if (typeof lv === "number") {
      levelIsEstimate = lv < 0;
      innerLevel = Math.abs(lv);
    }
  }
  if (levelIsEstimate) {
    let debugName = getSongNickname(record.songName, record.genre);
    if (record.chartType === "DX") {
      debugName += "[dx]";
    }
    debugName += ` - ${record.difficulty} ${record.level}`;
    console.warn(`Missing inner lv data for ${debugName}`);
  }

  return {
    ...record,
    estimate: levelIsEstimate,
    innerLv: innerLevel,
    rating: innerLevel * record.multiplier,
  };
}

export async function analyzePlayerRating(songPropsByName, playerScores, gameVersion) {
  const newSongScores = [];
  const oldSongScores = [];
  for (const record of playerScores) {
    const songProps = getSongProperties(
      songPropsByName,
      record.songName,
      record.genre,
      record.chartType
    );
    let isOldChart = record.chartType === "STANDARD";
    if (songProps) {
      // can differentiate between DX & DX Plus
      isOldChart = songProps.debut !== gameVersion;
    }
    const recordWithRating = analyzeSongRating(record, songProps);
    if (isOldChart) {
      oldSongScores.push(recordWithRating);
    } else {
      newSongScores.push(recordWithRating);
    }
  }

  newSongScores.sort(compareSongRatings);
  oldSongScores.sort(compareSongRatings);

  let newSongsRating = 0;
  const newTopSongCount = Math.min(NUM_TOP_NEW_SONGS, newSongScores.length);
  for (let i = 0; i < newTopSongCount; i++) {
    newSongsRating += Math.floor(newSongScores[i].rating);
  }

  let oldSongsRating = 0;
  const oldTopSongCount = Math.min(NUM_TOP_OLD_SONGS, oldSongScores.length);
  for (let i = 0; i < oldTopSongCount; i++) {
    oldSongsRating += Math.floor(oldSongScores[i].rating);
  }

  return {
    totalRating: newSongsRating + oldSongsRating,
    newSongScores,
    newSongsRating,
    newTopSongCount,
    oldSongScores,
    oldSongsRating,
    oldTopSongCount,
  };
}
