import React from 'react';

import {SongProperties} from '../../common/song-props';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordDataRow} from './ChartRecordDataRow';
import {ChartRecordHeadRow} from './ChartRecordHeadRow';

interface Props {
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
  columns: ReadonlyArray<ColumnType>;
  records: ReadonlyArray<ChartRecordWithRating>;
  tableClassname: string;
  sortBy?: (col: ColumnType) => void;
  isCandidate?: boolean;
}
export class ChartRecordsTable extends React.PureComponent<Props> {
  render() {
    const {columns, sortBy, records, songPropsByName, isCandidate} = this.props;
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
            return (
              <ChartRecordDataRow
                songPropsByName={songPropsByName}
                record={r}
                columns={columns}
                index={index}
                isCandidate={isCandidate}
              />
            );
          })}
        </tbody>
      </table>
    );
  }
}
