import React from 'react';

import {
  compareSongsByAchv,
  compareSongsByDifficulty,
  compareSongsByLevel,
  compareSongsByName,
  compareSongsByRating,
} from '../record-comparator';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordsTable} from './ChartRecordsTable';

const COLUMNS: ReadonlyArray<ColumnType> = [
  ColumnType.NO,
  ColumnType.SONG_TITLE,
  ColumnType.DIFFICULTY,
  ColumnType.LEVEL,
  ColumnType.ACHIEVEMENT,
  ColumnType.RANK_FACTOR,
  ColumnType.RATING,
];

const COMPARATOR: Map<
  ColumnType,
  (x: ChartRecordWithRating, y: ChartRecordWithRating) => number
> = new Map([
  [ColumnType.SONG_TITLE, compareSongsByName],
  [ColumnType.DIFFICULTY, compareSongsByDifficulty],
  [ColumnType.LEVEL, compareSongsByLevel],
  [ColumnType.ACHIEVEMENT, compareSongsByAchv],
  [ColumnType.RANK_FACTOR, compareSongsByAchv],
  [ColumnType.RATING, compareSongsByRating],
]);

interface Props {
  records: ReadonlyArray<ChartRecordWithRating>;
  limit: number;
  hidden?: boolean;
}
interface State {
  sortBy?: ColumnType;
  reverse?: boolean;
}
export class TopChartRecords extends React.PureComponent<Props, State> {
  state: State = {sortBy: ColumnType.RATING};
  render() {
    const {hidden, records: allRecords, limit} = this.props;
    const {sortBy, reverse} = this.state;
    let records = allRecords.slice(0, limit);
    records.forEach((r, i) => (r.order = i + 1));
    if (sortBy) {
      records.sort(COMPARATOR.get(sortBy));
      if (reverse) {
        records.reverse();
      }
    }
    return (
      <ChartRecordsTable
        columns={COLUMNS}
        tableClassname="topRecordTable"
        records={records}
        hidden={hidden}
        sortBy={this.handleSortBy}
      />
    );
  }

  private handleSortBy = (col: ColumnType) => {
    this.setState((state) => {
      if (!COMPARATOR.has(col)) {
        this.setState({sortBy: undefined});
      } else if (col === state.sortBy) {
        this.setState({reverse: !state.reverse});
      } else {
        this.setState({sortBy: col, reverse: false});
      }
    });
  };
}
