import React from 'react';

import {DIFFICULTY_CLASSNAME_MAP} from '../../common/constants';
import {getRankTitle} from '../../common/rank-functions';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ScoreRow} from './ChartRecordRow';

interface Props {
  record: ChartRecordWithRating;
  columns: ReadonlyArray<ColumnType>;
  index: number;
}
export const ScoreDataRow: React.FC<Props> = React.memo((props) => {
  const {record, index, columns} = props;
  const columnValues = columns.map<string | number>(c => {
    switch (c) {
      case ColumnType.NO:
        return index;
      case ColumnType.SONG_TITLE:
        return record.songName;
      case ColumnType.DIFFICULTY:
        return record.difficulty;
      case ColumnType.LEVEL:
        const lvText = record.level.toFixed(1);
        return record.levelIsEstimate ? "*" + lvText : lvText;
      case ColumnType.ACHIEVEMENT:
        return record.achievement.toFixed(4) + "%";
      case ColumnType.RANK_FACTOR:
        return getRankTitle(record.achievement);
      case ColumnType.NEXT_RANK:
        return record.nextRanks.keys().next().value;
      case ColumnType.NEXT_RATING:
        return "+" + record.nextRanks.values().next().value.minRt.toFixed(0);
      case ColumnType.RATING:
        return Math.floor(record.rating).toString();
    }
  })
  return (
    <ScoreRow className={DIFFICULTY_CLASSNAME_MAP.get(record.difficulty)} columnValues={columnValues} />
  );
});
