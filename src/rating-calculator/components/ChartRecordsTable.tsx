import React from 'react';

import {SongDatabase} from '../../common/song-props';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordDataRow} from './ChartRecordDataRow';
import {ChartRecordHeadRow} from './ChartRecordHeadRow';

interface Props {
  songDatabase: SongDatabase;
  columns: ReadonlyArray<ColumnType>;
  records: ReadonlyArray<ChartRecordWithRating>;
  tableClassname: string;
  sortBy?: (col: ColumnType) => void;
  isCandidate?: boolean;
  compactMode?: boolean;
}
export class ChartRecordsTable extends React.PureComponent<Props> {
  render() {
    const {columns, sortBy, records, songDatabase, isCandidate, compactMode} = this.props;
    let {tableClassname} = this.props;
    tableClassname += ' songRecordTable';
    return (
      <table className={tableClassname}>
        <thead>
          <ChartRecordHeadRow sortBy={sortBy} columns={columns} compactMode={compactMode} />
        </thead>
        <tbody>
          {records.map((r, index) => {
            index = r.order || index + 1;
            return (
              <ChartRecordDataRow
                songDatabase={songDatabase}
                record={r}
                columns={columns}
                key={index}
                index={index}
                isCandidate={isCandidate}
                compactMode={compactMode}
              />
            );
          })}
        </tbody>
      </table>
    );
  }
}
