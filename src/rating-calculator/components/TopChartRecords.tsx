import React, {useCallback, useState} from 'react';

import {useLanguage} from '../../common/lang-react';
import {SongDatabase} from '../../common/song-props';
import {CommonMessages} from '../common-messages';
import {
  compareSongsByAchv,
  compareSongsByChartType,
  compareSongsByLevel,
  compareSongsByName,
  compareSongsByRating,
} from '../record-comparator';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordsTable} from './ChartRecordsTable';
import {CollapsibleContainer} from './CollapsibleContainer';
import {DifficultyDistribution} from './DifficultyDistribution';
import {LevelRankDistribution} from './LevelRankDistribution';

const COLUMNS: ReadonlyArray<ColumnType> = [
  ColumnType.NO,
  ColumnType.SONG_TITLE,
  ColumnType.CHART_TYPE,
  ColumnType.LEVEL,
  ColumnType.ACHIEVEMENT,
  ColumnType.RANK,
  ColumnType.RATING,
];

const COMPARATOR: Map<ColumnType, (x: ChartRecordWithRating, y: ChartRecordWithRating) => number> =
  new Map([
    [ColumnType.SONG_TITLE, compareSongsByName],
    [ColumnType.CHART_TYPE, compareSongsByChartType],
    [ColumnType.LEVEL, compareSongsByLevel],
    [ColumnType.ACHIEVEMENT, compareSongsByAchv],
    [ColumnType.RANK, compareSongsByAchv],
    [ColumnType.RATING, compareSongsByRating],
  ]);

interface Props {
  songDatabase: SongDatabase;
  records: ReadonlyArray<ChartRecordWithRating>;
  limit: number;
  hidden?: boolean;
}

export const TopChartRecords = ({hidden, records: allRecords, limit, songDatabase}: Props) => {
  const [sortBy, setSortBy] = useState(ColumnType.RATING);
  const [reverse, setReverse] = useState(false);

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

  let records = allRecords.slice(0, limit);
  records.forEach((r, i) => (r.order = i + 1));
  if (sortBy) {
    records.sort(COMPARATOR.get(sortBy));
    if (reverse) {
      records.reverse();
    }
  }

  const lang = useLanguage();
  return (
    <CollapsibleContainer className="songRecordTableContainer" hidden={hidden}>
      <div className="responsiveFlexBox">
        <LevelRankDistribution
          topLeftCell={CommonMessages[lang].level}
          chartRecords={records}
          topChartsCount={limit}
        />
        <DifficultyDistribution chartRecords={records} topChartsCount={limit} />
      </div>
      <ChartRecordsTable
        songDatabase={songDatabase}
        columns={COLUMNS}
        tableClassname="topRecordTable"
        records={records}
        sortBy={handleSortBy}
      />
    </CollapsibleContainer>
  );
};
