import React, {useCallback, useMemo, useState} from 'react';

import {useLanguage} from '../../common/lang-react';
import {LevelDef} from '../../common/level-helper';
import {RANK_SSS_PLUS} from '../../common/rank-functions';
import {SongDatabase, SongProperties} from '../../common/song-props';
import {getCandidateCharts, getNotPlayedCharts} from '../candidate-songs';
import {CommonMessages} from '../common-messages';
import {
  compareSongsByAchv,
  compareSongsByChartType,
  compareSongsByLevel,
  compareSongsByName,
  compareSongsByNextRank,
  compareSongsByNextRating,
} from '../record-comparator';
import {ChartRecordWithRating, ColumnType, RatingData} from '../types';
import {CandidatesPlayedToggle} from './CandidatesPlayedToggle';
import {ChartRecordsTable} from './ChartRecordsTable';
import {CollapsibleContainer} from './CollapsibleContainer';

const CANDIDATE_SONGS_LIMIT = 20;

const NEW_CANDIDATE_SONGS_POOL_SIZE = 100;
const OLD_CANDIDATE_SONGS_POOL_SIZE = 250;

const COLUMNS: ReadonlyArray<ColumnType> = [
  ColumnType.NO,
  ColumnType.SONG_TITLE,
  ColumnType.CHART_TYPE,
  ColumnType.LEVEL,
  ColumnType.ACHIEVEMENT,
  ColumnType.NEXT_RANK,
  ColumnType.NEXT_RATING,
];

const COMPARATOR: Map<ColumnType, (x: ChartRecordWithRating, y: ChartRecordWithRating) => number> =
  new Map([
    [ColumnType.SONG_TITLE, compareSongsByName],
    [ColumnType.CHART_TYPE, compareSongsByChartType],
    [ColumnType.LEVEL, compareSongsByLevel],
    [ColumnType.ACHIEVEMENT, compareSongsByAchv],
    [ColumnType.NEXT_RANK, compareSongsByNextRank],
    [ColumnType.NEXT_RATING, compareSongsByNextRating],
  ]);

interface Props {
  songDatabase: SongDatabase;
  ratingData: RatingData;
  isCurrentVersion?: boolean;
  songList?: ReadonlyArray<SongProperties>;
  hidden?: boolean;
}

export const CandidateChartRecords = ({
  hidden,
  songDatabase,
  ratingData,
  isCurrentVersion,
  songList,
}: Props) => {
  const [showPlayed, setShowPlayed] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<ColumnType | undefined>();
  const [reverse, setReverse] = useState<boolean | undefined>();
  const [levelToShow, setLevelToShow] = useState<LevelDef>();
  const [minorLvToShow, setMinorLvToShow] = useState<number>();

  const name = isCurrentVersion ? 'new' : 'old';
  const records = isCurrentVersion ? ratingData.newChartRecords : ratingData.oldChartRecords;
  const topCount = isCurrentVersion ? ratingData.newTopChartsCount : ratingData.oldTopChartsCount;
  const minRating = topCount > 0 ? Math.floor(records[topCount - 1].rating) : 0;
  // If we have no topCount (likely meaning the latest version has not been played), estimate
  // minRating by using 0.9 * lowest rating in old records.
  const levels = generateLevels(
    minRating ||
      (ratingData.oldTopChartsCount
        ? Math.floor(0.9 * ratingData.oldChartRecords[ratingData.oldTopChartsCount - 1].rating)
        : 0)
  );

  const candidates = useMemo(() => {
    const poolSize = isCurrentVersion
      ? NEW_CANDIDATE_SONGS_POOL_SIZE
      : OLD_CANDIDATE_SONGS_POOL_SIZE;
    const lvFilter = minorLvToShow
      ? {title: levelToShow.title, minLv: minorLvToShow, maxLv: minorLvToShow}
      : levelToShow;
    return showPlayed
      ? getCandidateCharts(records, topCount, poolSize, lvFilter)
      : songList
      ? getNotPlayedCharts(songList, records, minRating, poolSize, lvFilter)
      : [];
  }, [songList, records, showPlayed, levelToShow, minorLvToShow]);

  const toggleShowMore = useCallback(
    (evt: React.SyntheticEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      setShowAll(!showAll);
    },
    [showAll]
  );

  const toggleShowPlayed = useCallback((showPlayed: boolean) => {
    setShowPlayed(showPlayed);
  }, []);

  const selectLv = useCallback(
    (evt: React.SyntheticEvent<HTMLSelectElement>) => {
      const majorLv = levels.find((lv) => evt.currentTarget.value === lv.title);
      if (levelToShow !== majorLv) {
        setMinorLvToShow(null);
      }
      setLevelToShow(majorLv);
    },
    [setLevelToShow]
  );
  const selectMinorLv = useCallback(
    (evt: React.SyntheticEvent<HTMLSelectElement>) => {
      const minorLv = parseFloat(evt.currentTarget.value);
      setMinorLvToShow(isNaN(minorLv) ? null : minorLv);
    },
    [setMinorLvToShow]
  );

  const handleSortBy = useCallback(
    (col: ColumnType) => {
      if (!COMPARATOR.has(col)) {
        setSortBy(undefined);
      } else if (col === sortBy) {
        setReverse(!reverse);
      } else {
        setSortBy(col);
        setReverse(false);
      }
    },
    [sortBy, reverse]
  );

  const endIndex = showAll ? candidates.length : Math.min(candidates.length, CANDIDATE_SONGS_LIMIT);
  // make a copy
  const candidatesToShow = candidates.slice(0, endIndex).map((r, i) => {
    r.order = i + 1;
    return r;
  });
  if (sortBy) {
    candidatesToShow.sort(COMPARATOR.get(sortBy));
    if (reverse) {
      candidatesToShow.reverse();
    }
  }
  const hasMore = candidates.length > CANDIDATE_SONGS_LIMIT;
  const minorLvs = [];
  if (levelToShow) {
    for (let i = levelToShow.minLv; i <= levelToShow.maxLv; i += 0.1) {
      minorLvs.push(i);
    }
  }

  const messages = CommonMessages[useLanguage()];
  return (
    <CollapsibleContainer className="songRecordTableContainer" hidden={hidden}>
      {songList && (
        <CandidatesPlayedToggle
          name={name}
          showPlayed={showPlayed}
          toggleShowPlayed={toggleShowPlayed}
        />
      )}
      <div>
        <select
          className="candidateLvSelect"
          value={levelToShow?.title || '--'}
          onChange={selectLv}
        >
          <option value="--">
            {messages.level} - {messages.all}
          </option>
          {levels.map((lv) => (
            <option key={lv.title} value={lv.title}>
              {lv.title}
            </option>
          ))}
        </select>
        {minorLvs.length ? (
          <select
            className="candidateMinorLvSelect"
            value={minorLvToShow == null ? '--' : minorLvToShow.toFixed(1)}
            onChange={selectMinorLv}
          >
            <option value="--">
              {messages.all} {levelToShow.title}
            </option>
            {minorLvs.map((lv) => (
              <option key={lv.toFixed(1)} value={lv.toFixed(1)}>
                {lv.toFixed(1)}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <ChartRecordsTable
        songDatabase={songDatabase}
        tableClassname="candidateTable"
        records={candidatesToShow}
        sortBy={handleSortBy}
        columns={COLUMNS}
        isCandidate
      />
      {hasMore && (
        <a className="showMore" href="#" onClick={toggleShowMore}>
          {showAll ? messages.showLess : messages.showMore}
        </a>
      )}
      <div className="marginBottom30"></div>
    </CollapsibleContainer>
  );
};

function generateLevels(minRating: number): LevelDef[] {
  const easiestLv = (minRating * 100) / (RANK_SSS_PLUS.factor * RANK_SSS_PLUS.minAchv);
  let baseLv = Math.floor(easiestLv);
  const isPlus = easiestLv - baseLv > 0.6;
  const levels: LevelDef[] = [];
  if (easiestLv <= 14.9) {
    if (!isPlus) {
      levels.push({title: String(baseLv), minLv: baseLv, maxLv: baseLv + 0.6});
    }
    levels.push({title: baseLv + '+', minLv: baseLv + 0.7, maxLv: baseLv + 0.9});
    baseLv += 1;
    while (baseLv < 15) {
      levels.push({title: String(baseLv), minLv: baseLv, maxLv: baseLv + 0.6});
      levels.push({title: baseLv + '+', minLv: baseLv + 0.7, maxLv: baseLv + 0.9});
      baseLv += 1;
    }
  }
  levels.push({title: '15', minLv: 15.0, maxLv: 15.0});
  return levels;
}
