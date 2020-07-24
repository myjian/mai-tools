import React from 'react';

import {getCandidateSongs} from '../candidate-songs';
import {ChartRecordWithRating} from '../types';
import {ScoreDataRow} from './ChartRecordDataRow';
import {ScoreHeadRow} from './ChartRecordHeadRow';

interface Props {
  records: ReadonlyArray<ChartRecordWithRating>;
  offset?: number;
  count?: number;
  sortable?: boolean;
  isCandidate?: boolean;
  isDxPlus: boolean;
  hidden?: boolean;
}
export const ChartRecordsTable: React.FC<Props> = React.memo((props) => {
  const {isCandidate, isDxPlus, count, hidden} = props;
  let {offset, records} = props;
  if (offset) {
    if (isCandidate) {
      records = getCandidateSongs(records, offset, isDxPlus);
    } else {
      records = records.slice(offset);
    }
  }
  if (count) {
    records = records.slice(0, count);
  }
  const tableClassName = isCandidate
    ? "songRecordTable candidateTable"
    : "songRecordTable topRecordTable";
  let className = "songRecordTableContainer";
  if (hidden) {
    className += " hidden";
  }
  return (
    <div className={className}>
      <table className={tableClassName}>
        <thead>
          <ScoreHeadRow isCandidate={isCandidate} />
        </thead>
        <tbody>
          {records.map((r, index) => (
            <ScoreDataRow record={r} isCandidate={isCandidate} index={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
});
