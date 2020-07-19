import React from 'react';

import {getRankTitle} from '../rank-functions';
import {DIFFICULTY_CLASSNAME_MAP} from '../shared-constants';
import {ChartRecordWithRating} from '../types';
import {ScoreRow} from './ChartRecordRow';

interface Props {
  record: ChartRecordWithRating;
  isCandidate?: boolean;
  index: number;
}
export const ScoreDataRow: React.FC<Props> = React.memo((props) => {
  const {record, isCandidate, index} = props;
  let lvText = record.level.toFixed(1);
  if (record.levelIsEstimate) {
    lvText = "*" + lvText;
  }
  const rankText = isCandidate
    ? record.nextRanks.keys().next().value
    : `${getRankTitle(record.achievement)} (${record.rankFactor})`;
  const ratingText = isCandidate
    ? record.nextRanks.values().next().value.minRt.toFixed(0)
    : Math.floor(record.rating).toString();
  const columns = [
    index.toString(),
    record.songName,
    record.difficulty,
    lvText,
    record.achievement.toFixed(4) + "%",
    rankText,
    ratingText,
  ];
  return (
    <ScoreRow className={DIFFICULTY_CLASSNAME_MAP.get(record.difficulty)} columnValues={columns} />
  );
});
