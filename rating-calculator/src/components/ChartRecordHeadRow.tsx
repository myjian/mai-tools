import React from 'react';

import {ScoreRow} from './ChartRecordRow';

interface Props {
  isCandidate?: boolean;
}
export const ScoreHeadRow: React.FC<Props> = React.memo(({isCandidate}) => {
  const columns = ["編號", "歌曲", "難度", "譜面\n定數", "達成率", "Rank\n係數", "Rating"];
  if (isCandidate) {
    columns[columns.length - 2] = "下個\n目標";
    columns[columns.length - 1] = "下個\nRating";
  }
  return <ScoreRow columnValues={columns} isHeading />;
});
