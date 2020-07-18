import React from 'react';

import {ChartRecordWithRating} from '../types';
import {ScoreDataRow} from './ChartRecordDataRow';
import {ScoreHeadRow} from './ChartRecordHeadRow';

interface Props {
  records: ReadonlyArray<ChartRecordWithRating>;
  isCandidate?: boolean;
}
export const ChartRecordsTable: React.FC<Props> = React.memo((props) => {
  const {isCandidate} = props;
  const className = isCandidate
    ? "songRecordTable candidateTable"
    : "songRecordTable topRecordTable";
  return (
    <table className={className}>
      <thead>
        <ScoreHeadRow isCandidate={isCandidate} />
      </thead>
      <tbody>
        {props.records.map((r, index) => (
          <ScoreDataRow record={r} isCandidate={isCandidate} index={index + 1} />
        ))}
      </tbody>
    </table>
  );
});
