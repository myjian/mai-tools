import React, {useCallback, useState} from 'react';

import {useLanguage} from '../../common/lang-react';
import {SongDatabase} from '../../common/song-props';
import {CommonMessages} from '../common-messages';
import {
  compareSongsByAchv,
  compareSongsByChartType,
  compareSongsByLevel,
  compareSongsByName,
  compareSongsByNextRank,
  compareSongsByNextRating,
} from '../record-comparator';
import {ChartRecordWithRating, ColumnType} from '../types';
import {CandidatesPlayedToggle} from './CandidatesPlayedToggle';
import {ChartRecordsTable} from './ChartRecordsTable';
import {CollapsibleContainer} from './CollapsibleContainer';

const CANDIDATE_SONGS_LIMIT = 20;

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
  name: string;
  songDatabase: SongDatabase;
  played: ReadonlyArray<ChartRecordWithRating>;
  notPlayed?: ReadonlyArray<ChartRecordWithRating>;
  hidden?: boolean;
}

export const CandidateChartRecords = ({hidden, played, notPlayed, songDatabase, name}: Props) => {
  const [showPlayed, setShowPlayed] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<ColumnType | undefined>();
  const [reverse, setReverse] = useState<boolean | undefined>();

  const toggleShowMore = useCallback(
    (evt: React.SyntheticEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      setShowAll(!showAll);
    },
    [showAll]
  );

  const toggleShowPlayed = useCallback(
    (showPlayed: boolean) => {
      setShowPlayed(showPlayed);
    },
    [showPlayed]
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

  const records = !showPlayed && notPlayed ? notPlayed : played;
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
      {notPlayed && (
        <CandidatesPlayedToggle
          name={name}
          showPlayed={showPlayed}
          toggleShowPlayed={toggleShowPlayed}
        />
      )}
      {/* TODO: filter by level or game version */}
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
    </CollapsibleContainer>
  );
};
