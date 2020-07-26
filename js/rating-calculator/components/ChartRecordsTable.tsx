import React from 'react';

import {ChartRecordWithRating, ColumnType} from '../types';
import {ScoreDataRow} from './ChartRecordDataRow';
import {ScoreHeadRow} from './ChartRecordHeadRow';

interface Props {
  columns: ReadonlyArray<ColumnType>;
  records: ReadonlyArray<ChartRecordWithRating>;
  tableClassname: string;
  sortBy?: (col: ColumnType) => void;
}
export class ChartRecordsTable extends React.PureComponent<Props> {
  render() {
    const {columns, sortBy, records} = this.props;
    let {tableClassname} = this.props;
    tableClassname += " songRecordTable";
    return (
      <table className={tableClassname}>
        <thead>
          <ScoreHeadRow sortBy={sortBy} columns={columns} />
        </thead>
        <tbody>
          {records.map((r, index) => {
            index = r.order || index + 1;
            return <ScoreDataRow record={r} columns={columns} index={index} />;
          })}
        </tbody>
      </table>
    );
  }
}
