import {DIFFICULTIES, SSSPLUS_MIN_ACHIEVEMENT} from '../common/constants';
import {
  getRankByAchievement,
  getRankIndexByAchievement,
  RANK_DEFINITIONS,
} from '../common/rank-functions';
import {SongProperties} from '../common/song-props';
import {getSongNickname} from '../common/song-util';
import {calculateRatingRange} from './rating-functions';
import {compareCandidate, compareSongsByLevel} from './record-comparator';
import {ChartRecordWithRating, ChartType} from './types';

// const MIN_RATING_ADJUSTMENT = 10; // for sorting order tweak

type NextRatingCandidate = Pick<ChartRecordWithRating, "achievement" | "level">;

function getNextRating(record: NextRatingCandidate, ratingRangeMin: number, numOfRanks: number) {
  let rankDefIdx = getRankIndexByAchievement(record.achievement);
  if (rankDefIdx === -1) {
    rankDefIdx = getRankIndexByAchievement(94);
  }
  const ratingByRank = new Map();
  for (let i = rankDefIdx - 1; i >= 0; i--) {
    const rank = RANK_DEFINITIONS[i];
    if (rank.title === RANK_DEFINITIONS[i + 1].title) {
      continue;
    }
    const [minRt] = calculateRatingRange(record.level, rank);
    if (minRt > ratingRangeMin) {
      ratingByRank.set(rank.title, {minRt: minRt - ratingRangeMin, rank});
      if (ratingByRank.size >= numOfRanks) {
        break;
      }
    }
  }
  return ratingByRank;
}

export function getCandidateSongs(
  records: ReadonlyArray<ChartRecordWithRating>,
  topCount: number,
  count: number
) {
  const candidates: ChartRecordWithRating[] = [];
  if (topCount <= 0) {
    return candidates;
  }
  for (let i = 0; i < topCount; i++) {
    const record = records[i];
    if (record.achievement < SSSPLUS_MIN_ACHIEVEMENT) {
      const ratingByRank = getNextRating(record, Math.floor(record.rating), 2);
      if (!ratingByRank.size) {
        continue;
      }
      record.nextRanks = ratingByRank;
      candidates.push(record);
    }
  }
  const minRating = Math.floor(records[topCount - 1].rating);
  for (let i = topCount; i < records.length; i++) {
    const record = records[i];
    if (record.achievement < SSSPLUS_MIN_ACHIEVEMENT) {
      const ratingByRank = getNextRating(record, minRating, 2);
      if (!ratingByRank.size) {
        continue;
      }
      record.nextRanks = ratingByRank;
      candidates.push(record);
      if (candidates.length >= count) {
        break;
      }
    }
  }
  candidates.sort(compareCandidate);
  return candidates;
}

export function getNotPlayedCharts(
  songList: ReadonlyArray<SongProperties>,
  records: ReadonlyArray<ChartRecordWithRating>,
  topCount: number,
  count: number
) {
  const playedCharts = new Set<string>();
  for (const r of records) {
    const key = getSongNickname(r.songName, r.genre, r.chartType === ChartType.DX);
    playedCharts.add(key + r.difficulty);
  }
  const maxRating = records.length ? Math.ceil(records[0].rating) + 10 : 0;
  const minRating = records.length ? Math.floor(records[topCount - 1].rating) : 0;
  const maxRank = getRankByAchievement(100.5);
  const minRank = getRankByAchievement(98);
  const hardestLv = maxRating ? (maxRating * 100) / (minRank.factor * minRank.th) : 15;
  const easiestLv = (minRating * 100) / (maxRank.factor * maxRank.th);
  const candidates: ChartRecordWithRating[] = [];
  for (const s of songList) {
    s.lv.forEach((lv, index) => {
      if (index === 0) {
        return; // skip BASIC
      }
      const key =
        s.name === "Link" ? s.nickname : getSongNickname(s.name, "", s.dx === ChartType.DX);
      const diff = DIFFICULTIES[index];
      const levelIsEstimate = lv < 0;
      lv = Math.abs(lv);
      if (playedCharts.has(key + diff) || lv < easiestLv || lv > hardestLv) {
        return; // skip played, too easy, or too hard charts
      }
      const record: ChartRecordWithRating = {
        songName: s.name,
        difficulty: diff,
        level: lv,
        levelIsEstimate,
        genre: "",
        chartType: s.dx,
        rankFactor: 0,
        rating: 0,
        achievement: 0,
        multiplier: 0,
      };
      const ratingByRank = getNextRating(record, minRating, 1);
      if (!ratingByRank.size) {
        return;
      }
      record.nextRanks = ratingByRank;
      candidates.push(record);
    });
    if (candidates.length >= count) {
      break;
    }
  }
  candidates.sort(compareSongsByLevel);
  return candidates;
}
