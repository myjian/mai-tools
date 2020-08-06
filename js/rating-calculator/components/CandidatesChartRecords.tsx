import React from 'react';

import {UIString} from '../i18n';
import {
  compareSongsByAchv,
  compareSongsByDifficulty,
  compareSongsByLevel,
  compareSongsByName,
  compareSongsByNextRank,
  compareSongsByNextRating,
} from '../record-comparator';
import {ChartRecordWithRating, ColumnType} from '../types';
import {ChartRecordsTable} from './ChartRecordsTable';
import {CollapsibleContainer} from './CollapsibleContainer';

const CANDIDATE_SONGS_LIMIT = 20;

const COLUMNS: ReadonlyArray<ColumnType> = [
  ColumnType.NO,
  ColumnType.SONG_TITLE,
  ColumnType.DIFFICULTY,
  ColumnType.LEVEL,
  ColumnType.ACHIEVEMENT,
  ColumnType.NEXT_RANK,
  ColumnType.NEXT_RATING,
];

const COMPARATOR: Map<
  ColumnType,
  (x: ChartRecordWithRating, y: ChartRecordWithRating) => number
> = new Map([
  [ColumnType.SONG_TITLE, compareSongsByName],
  [ColumnType.DIFFICULTY, compareSongsByDifficulty],
  [ColumnType.LEVEL, compareSongsByLevel],
  [ColumnType.ACHIEVEMENT, compareSongsByAchv],
  [ColumnType.NEXT_RANK, compareSongsByNextRank],
  [ColumnType.NEXT_RATING, compareSongsByNextRating],
]);

interface Props {
  records: ReadonlyArray<ChartRecordWithRating>;
  hidden?: boolean;
}

interface State {
  showAll: boolean;
  sortBy?: ColumnType;
  reverse?: boolean;
}

export class CandidateChartRecords extends React.PureComponent<Props, State> {
  state: State = {showAll: false};

  render() {
    const {hidden, records: allRecords} = this.props;
    const {showAll, sortBy, reverse} = this.state;
    const hasMore = allRecords.length > CANDIDATE_SONGS_LIMIT;
    let records: ChartRecordWithRating[];
    if (hasMore && !showAll) {
      records = allRecords.slice(0, CANDIDATE_SONGS_LIMIT);
    } else {
      records = allRecords.slice();
    }
    records.forEach((r, i) => (r.order = i + 1));
    if (sortBy) {
      records.sort(COMPARATOR.get(sortBy));
      if (reverse) {
        records.reverse();
      }
    }
    return (
      <CollapsibleContainer className="songRecordTableContainer" hidden={hidden}>
        <ChartRecordsTable
          tableClassname="candidateTable"
          records={records}
          sortBy={this.handleSortBy}
          columns={COLUMNS}
        />
        {hasMore && (
          <a className="showMore" href="#" onClick={this.toggleShowMore}>
            {showAll ? UIString.showLess : UIString.showMore}
          </a>
        )}
      </CollapsibleContainer>
    );
  }

  private toggleShowMore = (evt: React.SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    this.setState((state) => ({showAll: !state.showAll}));
  };

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
