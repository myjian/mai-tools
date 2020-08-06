import React from 'react';

import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordDataRow} from './ChartRecordDataRow';
import {ChartRecordHeadRow} from './ChartRecordHeadRow';

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
          <ChartRecordHeadRow sortBy={sortBy} columns={columns} />
        </thead>
        <tbody>
          {records.map((r, index) => {
            index = r.order || index + 1;
            return <ChartRecordDataRow record={r} columns={columns} index={index} />;
          })}
        </tbody>
      </table>
    );
  }
}
