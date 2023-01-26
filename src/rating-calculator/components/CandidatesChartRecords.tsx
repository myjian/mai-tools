import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {SongProperties} from '../../common/song-props';
import {
  compareSongsByAchv,
  compareSongsByDifficulty,
  compareSongsByLevel,
  compareSongsByName,
  compareSongsByNextRank,
  compareSongsByNextRating,
} from '../record-comparator';
import {ChartRecordWithRating, ColumnType} from '../types';
import {CandidatesPlayedToggle} from './CandidatesPlayedToggle';
import {ChartRecordsTable} from './ChartRecordsTable';
import {CollapsibleContainer} from './CollapsibleContainer';

const MessagesByLang = {
  [Language.en_US]: {
    showMore: "Show more",
    showLess: "Show less",
  },
  [Language.zh_TW]: {
    showMore: "顯示更多",
    showLess: "顯示較少",
  },
  [Language.ko_KR]: {
    showMore: "자세히 보기",
    showLess: "간략히",
  },
};

const CANDIDATE_SONGS_LIMIT = 20;

const COLUMNS: ReadonlyArray<ColumnType> = [
  ColumnType.NO,
  ColumnType.SONG_TITLE,
  ColumnType.DIFFICULTY,
  ColumnType.LEVEL,
  ColumnType.ACHIEVEMENT,
  ColumnType.NEXT_RANK,
  ColumnType.NEXT_RATING,
];

const COMPARATOR: Map<ColumnType, (x: ChartRecordWithRating, y: ChartRecordWithRating) => number> =
  new Map([
    [ColumnType.SONG_TITLE, compareSongsByName],
    [ColumnType.DIFFICULTY, compareSongsByDifficulty],
    [ColumnType.LEVEL, compareSongsByLevel],
    [ColumnType.ACHIEVEMENT, compareSongsByAchv],
    [ColumnType.NEXT_RANK, compareSongsByNextRank],
    [ColumnType.NEXT_RATING, compareSongsByNextRating],
  ]);

interface Props {
  name: string;
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
  played: ReadonlyArray<ChartRecordWithRating>;
  notPlayed?: ReadonlyArray<ChartRecordWithRating>;
  hidden?: boolean;
}

export const CandidateChartRecords = ({
  hidden,
  played,
  notPlayed,
  songPropsByName,
  name,
}: Props) => {
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

  const messages = MessagesByLang[useLanguage()];
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
        songPropsByName={songPropsByName}
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
