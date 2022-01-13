import React from 'react';

import {SongProperties} from '../../common/song-props';
import {UIString} from '../i18n';
import {
  compareSongsByAchv,
  compareSongsByDifficulty,
  compareSongsByLevel,
  compareSongsByName,
  compareSongsByRating,
} from '../record-comparator';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordsTable} from './ChartRecordsTable';
import {CollapsibleContainer} from './CollapsibleContainer';
import {DifficultyDistribution} from './DifficultyDistribution';
import {LevelRankDistribution} from './LevelRankDistribution';

const COLUMNS: ReadonlyArray<ColumnType> = [
  ColumnType.NO,
  ColumnType.SONG_TITLE,
  ColumnType.DIFFICULTY,
  ColumnType.LEVEL,
  ColumnType.ACHIEVEMENT,
  ColumnType.RANK,
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
  [ColumnType.RANK, compareSongsByAchv],
  [ColumnType.RATING, compareSongsByRating],
]);

interface Props {
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
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
    const {hidden, records: allRecords, limit, songPropsByName} = this.props;
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
      <CollapsibleContainer className="songRecordTableContainer" hidden={hidden}>
        <div className="responsiveFlexBox">
          <LevelRankDistribution
            topLeftCell={UIString.level}
            chartRecords={records}
            topChartsCount={limit}
          />
          <DifficultyDistribution chartRecords={records} topChartsCount={limit} />
        </div>
        <ChartRecordsTable
          songPropsByName={songPropsByName}
          columns={COLUMNS}
          tableClassname="topRecordTable"
          records={records}
          sortBy={this.handleSortBy}
        />
      </CollapsibleContainer>
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
