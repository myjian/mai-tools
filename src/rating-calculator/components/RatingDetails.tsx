import React from 'react';

import {DxVersion} from '../../common/constants';
import {SongProperties} from '../../common/song-props';
import {UIString} from '../i18n';
import {getNumOfTopOldCharts} from '../rating-analyzer';
import {ChartRecordWithRating, RatingData} from '../types';
import {CandidateChartRecords} from './CandidatesChartRecords';
import {ChartRecordSectionTitle} from './ChartRecordSectionTitle';
import {TopChartRecords} from './TopChartRecords';

interface Props {
  gameVer: DxVersion;
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
  ratingData: RatingData;
  newCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  oldCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  notPlayedNewCharts?: ReadonlyArray<ChartRecordWithRating>;
  notPlayedOldCharts?: ReadonlyArray<ChartRecordWithRating>;
}

interface State {
  hideNewTopSongs: boolean;
  hideOldTopSongs: boolean;
  hideNewCandidates: boolean;
  hideOldCandidates: boolean;
}

export class RatingDetails extends React.PureComponent<Props, State> {
  private outputArea = React.createRef<HTMLDivElement>();

  state: State = {
    hideNewTopSongs: false,
    hideOldTopSongs: false,
    hideNewCandidates: false,
    hideOldCandidates: false,
  };

  componentDidMount() {
    if (this.outputArea.current) {
      this.outputArea.current.scrollIntoView({behavior: "smooth"});
    }
  }

  render() {
    const {
      gameVer,
      newCandidateCharts,
      notPlayedNewCharts,
      oldCandidateCharts,
      notPlayedOldCharts,
      songPropsByName,
    } = this.props;
    const {
      newChartRecords,
      newTopChartsCount,
      oldChartRecords,
      oldTopChartsCount,
    } = this.props.ratingData;
    const {hideNewCandidates, hideNewTopSongs, hideOldCandidates, hideOldTopSongs} = this.state;
    return (
      <>
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.newChartsRatingTargets}
            contentHidden={hideNewTopSongs}
            onClick={this.toggleNewTopChartsDisplay}
          />
          <TopChartRecords
            songPropsByName={songPropsByName}
            records={newChartRecords}
            limit={newTopChartsCount}
            hidden={hideNewTopSongs}
          />
        </div>
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.oldChartsRatingTargets.replace(
              "{count}",
              getNumOfTopOldCharts(gameVer).toFixed(0)
            )}
            contentHidden={hideOldTopSongs}
            onClick={this.toggleOldTopChartsDisplay}
          />
          <TopChartRecords
            songPropsByName={songPropsByName}
            records={oldChartRecords}
            limit={oldTopChartsCount}
            hidden={hideOldTopSongs}
          />
        </div>
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.newChartsRatingCandidates}
            contentHidden={hideNewCandidates}
            onClick={this.toggleNewCandidateChartsDisplay}
            isCandidateList
          />
          <CandidateChartRecords
            name="new"
            songPropsByName={songPropsByName}
            records={newCandidateCharts}
            hidden={hideNewCandidates}
            notPlayed={notPlayedNewCharts}
          />
        </div>
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.oldChartsRatingCandidates}
            contentHidden={hideOldCandidates}
            onClick={this.toggleOldCandidateChartsDisplay}
            isCandidateList
          />
          <CandidateChartRecords
            name="old"
            songPropsByName={songPropsByName}
            records={oldCandidateCharts}
            hidden={hideOldCandidates}
            notPlayed={notPlayedOldCharts}
          />
        </div>
      </>
    );
  }

  private toggleNewTopChartsDisplay = () => {
    this.setState((state) => ({hideNewTopSongs: !state.hideNewTopSongs}));
  };

  private toggleNewCandidateChartsDisplay = () => {
    this.setState((state) => ({hideNewCandidates: !state.hideNewCandidates}));
  };

  private toggleOldTopChartsDisplay = () => {
    this.setState((state) => ({hideOldTopSongs: !state.hideOldTopSongs}));
  };

  private toggleOldCandidateChartsDisplay = () => {
    this.setState((state) => ({hideOldCandidates: !state.hideOldCandidates}));
  };
}
