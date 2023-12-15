import React, {useCallback, useMemo, useState} from 'react';

import {useLanguage} from '../../common/lang-react';
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

  const name = isCurrentVersion ? 'new' : 'old';
  const records = useMemo(() => {
    const records = isCurrentVersion ? ratingData.newChartRecords : ratingData.oldChartRecords;
    const topCount = isCurrentVersion ? ratingData.newTopChartsCount : ratingData.oldTopChartsCount;
    const poolSize = isCurrentVersion
      ? NEW_CANDIDATE_SONGS_POOL_SIZE
      : OLD_CANDIDATE_SONGS_POOL_SIZE;
    if (showPlayed) {
      return getCandidateCharts(records, topCount, poolSize);
    }
    return songList ? getNotPlayedCharts(songList, records, topCount, poolSize) : [];
  }, [songList, ratingData, showPlayed]);

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

  const endIndex = showAll ? records.length : Math.min(records.length, CANDIDATE_SONGS_LIMIT);
  // make a copy
  const recordsToShow = records.slice(0, endIndex).map((r, i) => {
    r.order = i + 1;
    return r;
  });
  if (sortBy) {
    recordsToShow.sort(COMPARATOR.get(sortBy));
    if (reverse) {
      recordsToShow.reverse();
    }
  }
  const hasMore = records.length > CANDIDATE_SONGS_LIMIT;

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
      {/* TODO: filter by level */}
      <ChartRecordsTable
        songDatabase={songDatabase}
        tableClassname="candidateTable"
        records={recordsToShow}
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
