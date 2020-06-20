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
    console.warn("Level text is missing!");
    return MIN_LEVEL;
  }
  const baseLevel = parseInt(officialLevel);
  const hasPlus = officialLevel.endsWith("+");
  // 9 : 9.0 - 9.6
  // 9+: 9.7 - 9.9
  return hasPlus ? baseLevel + 0.7 : baseLevel;
}

function _getLvIndex(difficulty) {
  return DIFFICULTIES.indexOf(difficulty);
}

function getChartInnerLevel(innerLvMap, songName, genre, chartType, difficulty, officialLevel) {
  const lvIndex = _getLvIndex(difficulty);
  const innerLvArray = innerLvMap.get(songName);
  if (innerLvArray) {
    if (innerLvArray.length === 1) {
      // One match. Most common case.
      return innerLvArray[0].lv[lvIndex];
    } else if (songName === "Link") {
      // Duplicate song names
      const nickname = genre.includes("niconico") ? "Link(nico)" : "Link(org)";
      const innerLvData = innerLvArray.find(d => d.nickname === nickname);
      if (innerLvData) {
        return innerLvData.lv[lvIndex];
      }
    } else {
      // Song has both DX and Standard charts
      const isDX = chartType === "DX" ? 1 : 0;
      const innerLvData = innerLvArray.find(d => d.dx === isDX);
      if (innerLvData) {
        return innerLvData.lv[lvIndex];
      }
    }
  }
  console.warn(`Missing inner lv data for ${songName}`);
  return _getDefaultLevel(officialLevel);
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
  return {
    ...scoreRecord,
    innerLv,
    rating: Math.floor(innerLv * scoreRecord.multiplier),
  };
}

function analyzePlayerRating(innerLvMap, playerScores) {
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
