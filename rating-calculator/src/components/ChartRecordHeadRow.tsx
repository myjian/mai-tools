import React from 'react';

import {UIString} from '../i18n';
import {ScoreRow} from './ChartRecordRow';

interface Props {
  isCandidate?: boolean;
}
export const ScoreHeadRow: React.FC<Props> = React.memo(({isCandidate}) => {
  const columns = [
    UIString.num,
    UIString.song,
    UIString.difficulty,
    UIString.level,
    UIString.achievementAbbr,
    isCandidate ? UIString.nextGoal : UIString.rankFactor,
    isCandidate ? UIString.nextRating : UIString.rating,
  ];
  return <ScoreRow columnValues={columns} isHeading />;
});
