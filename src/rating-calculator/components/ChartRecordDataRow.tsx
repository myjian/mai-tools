import React from 'react';

import {getChartTypeName} from '../../common/chart-type';
import {DIFFICULTY_CLASSNAME_MAP} from '../../common/difficulties';
import {getDisplayLv} from '../../common/level-helper';
import {getRankTitle} from '../../common/rank-functions';
import {getSongNickname, RATING_TARGET_SONG_NAME_PREFIX} from '../../common/song-name-helper';
import {SongDatabase} from '../../common/song-props';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordRow} from './ChartRecordRow';

function getSongNameDisplay(
  record: ChartRecordWithRating,
  songDatabase: SongDatabase,
  isCandidate?: boolean
): string {
  const prefix = isCandidate && record.isTarget ? RATING_TARGET_SONG_NAME_PREFIX : '';
  const hasDualCharts = songDatabase.hasDualCharts(record.songName, record.genre);
  if (hasDualCharts) {
    return prefix + getSongNickname(record.songName, record.genre);
  }
  return prefix + record.songName;
}

interface Props {
  songDatabase: SongDatabase;
  record: ChartRecordWithRating;
  columns: ReadonlyArray<ColumnType>;
  index: number;
  isCandidate?: boolean;
}

export const ChartRecordDataRow = React.memo((props: Props) => {
  const {record, index, columns, songDatabase, isCandidate} = props;
  const columnValues = columns.map<string | number>((c) => {
    switch (c) {
      case ColumnType.NO:
        return index;
      case ColumnType.SONG_TITLE:
        return getSongNameDisplay(record, songDatabase, isCandidate);
      case ColumnType.CHART_TYPE:
        return getChartTypeName(record.chartType);
      case ColumnType.LEVEL:
        return getDisplayLv(record.level, !record.levelIsPrecise);
      case ColumnType.ACHIEVEMENT:
        return record.achievement.toFixed(4) + '%';
      case ColumnType.RANK:
        return getRankTitle(record.achievement);
      case ColumnType.NEXT_RANK:
        return record.nextRanks
          ? Array.from(record.nextRanks.values())
              .map((r) => r.rank.minAchv + '%')
              .join('\n')
          : '';
      case ColumnType.NEXT_RATING:
        return record.nextRanks
          ? Array.from(record.nextRanks.values())
              .map((r) => '+' + r.minRt.toFixed(0))
              .join('\n')
          : '';
      case ColumnType.RATING:
        return Math.floor(record.rating).toString();
    }
  });
  return (
    <ChartRecordRow
      className={DIFFICULTY_CLASSNAME_MAP.get(record.difficulty)}
      columnValues={columnValues}
    />
  );
});
