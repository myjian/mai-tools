import React from 'react';

import {ChartRecordWithRating, ColumnType} from '../types';
import {ScoreDataRow} from './ChartRecordDataRow';
import {ScoreHeadRow} from './ChartRecordHeadRow';

interface Props {
  columns: ReadonlyArray<ColumnType>;
  records: ReadonlyArray<ChartRecordWithRating>;
  hidden?: boolean;
  tableClassname: string;
  sortBy?: (col: ColumnType) => void;
  children?: React.ReactNode;
}
export class ChartRecordsTable extends React.PureComponent<Props> {
  render() {
    const {children, hidden, columns, sortBy, records} = this.props;
    let {tableClassname} = this.props;
    tableClassname += " songRecordTable";
    let className = "songRecordTableContainer";
    if (hidden) {
      className += " hidden";
    }
    return (
      <div className={className}>
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
        {children}
      </div>
    );
  }
}
