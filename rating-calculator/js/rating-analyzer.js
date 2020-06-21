const MIN_LEVEL = 1;
const DX_NUM_TOP_SONGS = 15;
const FINALE_NUM_TOP_SONGS = 25;

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
  const hasPlus = officialLevel.endsWith("+");
  // 9 : 9.0 - 9.6
  // 9+: 9.7 - 9.9
  return hasPlus ? baseLevel + 0.7 : baseLevel;
}

function _getInnerLvFromArray(innerLevels, difficulty) {
  const lvIndex = DIFFICULTIES.indexOf(difficulty);
  return innerLevels[lvIndex];
}

function getSongNickname(songName, genre) {
  if (songName === "Link") {
    return genre.includes("niconico") ? "Link(nico)" : "Link(org)"
  }
  return songName;
}

/*
 * If return value is negative, it means there is no inner lv data for the song.
 */
function getChartInnerLevel(innerLvMap, songName, genre, chartType, difficulty, officialLevel) {
  let innerLvArray = innerLvMap.get(songName);
  if (innerLvArray && innerLvArray.length) {
    if (innerLvArray.length > 1) {
      // Song has multiple charts
      const isDX = chartType === "DX" ? 1 : 0;
      innerLvArray = innerLvArray.filter(d => d.dx === isDX);
      if (innerLvArray.length > 1) {
        // Duplicate song names
        const nickname = getSongNickname(songName, genre);
        innerLvArray = innerLvArray.filter(d => d.nickname === nickname);
      }
    }
    if (innerLvArray.length === 1) {
      return _getInnerLvFromArray(innerLvArray[0].lv, difficulty);
    }
  }
  // Intentionally make it negative
  return -_getDefaultLevel(officialLevel);
}

function analyzeSongRating(innerLvMap, scoreRecord) {
  let innerLv = getChartInnerLevel(
    innerLvMap,
    scoreRecord.songName,
    scoreRecord.genre,
    scoreRecord.chartType,
    scoreRecord.difficulty,
    scoreRecord.level
  );
  const estimate = innerLv < 0;
  if (estimate) {
    innerLv = Math.abs(innerLv);
    let debugName = getSongNickname(scoreRecord.songName, scoreRecord.genre);
    if (scoreRecord.chartType === "DX") {
      debugName += "[dx]";
    }
    debugName += ` - ${scoreRecord.difficulty} ${scoreRecord.level}`;
    console.warn(`Missing inner lv data for ${debugName}`);
  }

  return {
    ...scoreRecord,
    estimate,
    innerLv,
    rating: Math.floor(innerLv * scoreRecord.multiplier),
  };
}

async function analyzePlayerRating(innerLvMap, playerScores) {
  const dxScores = playerScores.reduce((output, record) => {
    if (record.chartType === "DX") {
      const recordWithRating = analyzeSongRating(innerLvMap, record);
      output.push(recordWithRating);
    }
    return output;
  }, []);
  
  const finaleScores = playerScores.reduce((output, record) => {
    if (record.chartType === "STANDARD") {
      const recordWithRating = analyzeSongRating(innerLvMap, record);
      output.push(recordWithRating);
    }
    return output;
  }, []);
  
  dxScores.sort(compareSongRatings);
  finaleScores.sort(compareSongRatings);
  
  let dxRating = 0;
  const dxTopSongCount = Math.min(DX_NUM_TOP_SONGS, dxScores.length);
  for (let i = 0; i < dxTopSongCount ; i++) {
    dxRating += dxScores[i].rating;
  }

  let finaleRating = 0;
  const finaleTopSongCount = Math.min(FINALE_NUM_TOP_SONGS, finaleScores.length);
  for (let i = 0; i < finaleTopSongCount ; i++) {
    finaleRating += finaleScores[i].rating;
  }
  
  return {
    totalRating: dxRating + finaleRating,
    dxRating,
    finaleRating,
    dxTopScores: dxScores.slice(0, dxTopSongCount),
    finaleTopScores: finaleScores.slice(0, finaleTopSongCount),
  };
}
