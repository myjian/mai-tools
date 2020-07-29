import React from 'react';

import {UIString} from '../i18n';
import {ColumnType} from '../types';
import {ScoreRow} from './ChartRecordRow';

const COLUMN_TITLE: {[c in ColumnType]: string} = {
  [ColumnType.NO]: UIString.num,
  [ColumnType.SONG_TITLE]: UIString.song,
  [ColumnType.DIFFICULTY]: UIString.difficulty,
  [ColumnType.LEVEL]: UIString.level,
  [ColumnType.ACHIEVEMENT]: UIString.achievementAbbr,
  [ColumnType.RANK_FACTOR]: UIString.rankFactor,
  [ColumnType.RATING]: UIString.rating,
  [ColumnType.NEXT_RANK]: UIString.nextGoal,
  [ColumnType.NEXT_RATING]: UIString.nextRating,
};

interface Props {
  columns?: ReadonlyArray<ColumnType>;
  sortBy?: (col: ColumnType) => void;
}
export const ScoreHeadRow: React.FC<Props> = React.memo(({columns, sortBy}) => {
  const columnTitles = columns.map(c => COLUMN_TITLE[c]);
  const handleClick = sortBy && ((index: number) => sortBy(columns[index]));
  return <ScoreRow columnValues={columnTitles} onClickCell={handleClick} isHeading />;
});