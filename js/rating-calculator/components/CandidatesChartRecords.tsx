import React from 'react';

import {SongProperties} from '../../common/song-props';
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
import {CandidatesPlayedToggle} from './CandidatesPlayedToggle';
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
  name: string;
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
  records: ReadonlyArray<ChartRecordWithRating>;
  notPlayed?: ReadonlyArray<ChartRecordWithRating>;
  hidden?: boolean;
}

interface State {
  showPlayed: boolean;
  showAll: boolean;
  sortBy?: ColumnType;
  reverse?: boolean;
}

export class CandidateChartRecords extends React.PureComponent<Props, State> {
  state: State = {showAll: false, showPlayed: true};

  render() {
    const {hidden, records, notPlayed, songPropsByName, name} = this.props;
    const {showAll, showPlayed, sortBy, reverse} = this.state;
    let recordsToShow: ChartRecordWithRating[] = showPlayed ? records.slice() : notPlayed.slice();
    const hasMore = recordsToShow.length > CANDIDATE_SONGS_LIMIT;
    if (hasMore && !showAll) {
      recordsToShow = recordsToShow.slice(0, CANDIDATE_SONGS_LIMIT);
    }
    recordsToShow.forEach((r, i) => (r.order = i + 1));
    if (sortBy) {
      recordsToShow.sort(COMPARATOR.get(sortBy));
      if (reverse) {
        recordsToShow.reverse();
      }
    }
    return (
      <CollapsibleContainer className="songRecordTableContainer" hidden={hidden}>
        {notPlayed && (
          <CandidatesPlayedToggle
            name={name}
            showPlayed={showPlayed}
            toggleShowPlayed={this.toggleShowNotPlayed}
          />
        )}
        {/* TODO: filter by level or game version */}
        <ChartRecordsTable
          songPropsByName={songPropsByName}
          tableClassname="candidateTable"
          records={recordsToShow}
          sortBy={this.handleSortBy}
          columns={COLUMNS}
          isCandidate
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

  private toggleShowNotPlayed = (showPlayed: boolean) => {
    this.setState({showPlayed});
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
