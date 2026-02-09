import {memo} from 'react';

import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordDataRow} from './ChartRecordDataRow';
import {ChartRecordHeadRow} from './ChartRecordHeadRow';

interface Props {
  columns: ReadonlyArray<ColumnType>;
  records: ReadonlyArray<ChartRecordWithRating>;
  tableClassname: string;
  sortBy?: (col: ColumnType) => void;
  isCandidate?: boolean;
}
export const ChartRecordsTable = memo(
  ({columns, sortBy, records, isCandidate, tableClassname}: Props) => {
    const composedTableClassname = tableClassname + ' songRecordTable';
    return (
      <table className={composedTableClassname}>
        <thead>
          <ChartRecordHeadRow sortBy={sortBy} columns={columns} />
        </thead>
        <tbody>
          {records.map((r, index) => {
            index = r.order || index + 1;
            return (
              <ChartRecordDataRow
                record={r}
                columns={columns}
                key={index}
                index={index}
                isCandidate={isCandidate}
              />
            );
          })}
        </tbody>
      </table>
    );
  },
);
