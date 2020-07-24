import React from 'react';

import {UIString} from '../i18n';
import {RatingData} from '../types';
import {ChartRecordSectionTitle} from './ChartRecordSectionTitle';
import {ChartRecordsTable} from './ChartRecordsTable';
import {DifficultyRankDistribution} from './DifficultyRankDistribution';
import {LevelRankDistribution} from './LevelRankDistribution';
import {RatingOverview} from './RatingOverview';

interface Props {
  isDxPlus: boolean;
  ratingData: RatingData;
  playerGradeIndex: number;
}
interface State {
  hideNewTopSongs: boolean;
  hideOldTopSongs: boolean;
  hideNewCandidateSongs: boolean;
  hideOldCandidateSongs: boolean;
}
export class RatingOutput extends React.PureComponent<Props, State> {
  private outputArea = React.createRef<HTMLDivElement>();

  state: State = {
    hideNewTopSongs: false,
    hideOldTopSongs: false,
    hideNewCandidateSongs: false,
    hideOldCandidateSongs: false,
  };

  componentDidMount() {
    if (this.outputArea.current) {
      this.outputArea.current.scrollIntoView({behavior: "smooth"});
    }
  }

  render() {
    const {isDxPlus, playerGradeIndex} = this.props;
    const {
      newChartRecords,
      newChartsRating,
      newTopChartsCount,
      oldChartRecords,
      oldChartsRating,
      oldTopChartsCount,
    } = this.props.ratingData;
    const {
      hideNewCandidateSongs,
      hideNewTopSongs,
      hideOldCandidateSongs,
      hideOldTopSongs,
    } = this.state;
    return (
      <div className="outputArea" ref={this.outputArea}>
        <h2 id="outputHeading">{UIString.analysisResult}</h2>
        <RatingOverview
          newChartsRating={newChartsRating}
          oldChartsRating={oldChartsRating}
          isDxPlus={isDxPlus}
          playerGradeIndex={playerGradeIndex}
        />
        <div className="ratingTargetDistribution">
          <h3>{UIString.ratingTargetDistribution}</h3>
          <div className="flexRow">
            <LevelRankDistribution
              newChartRecords={newChartRecords}
              newTopChartsCount={newTopChartsCount}
              oldChartRecords={oldChartRecords}
              oldTopChartsCount={oldTopChartsCount}
            />
            <DifficultyRankDistribution
              newChartRecords={newChartRecords}
              newTopChartsCount={newTopChartsCount}
              oldChartRecords={oldChartRecords}
              oldTopChartsCount={oldTopChartsCount}
            />
          </div>
        </div>
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.newChartsRatingTargets}
            contentHidden={hideNewTopSongs}
            onClick={this.toggleNewTopChartsDisplay}
          />
          <ChartRecordsTable
          isDxPlus={isDxPlus}
            records={newChartRecords}
            count={newTopChartsCount}
            hidden={hideNewTopSongs}
          />
        </div>
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.oldChartsRatingTargets}
            contentHidden={hideOldTopSongs}
            onClick={this.toggleOldTopChartsDisplay}
          />
          <ChartRecordsTable
            isDxPlus={isDxPlus}
            records={oldChartRecords}
            count={oldTopChartsCount}
            hidden={hideOldTopSongs}
          />
        </div>
        {/* TODO: filter by song name from user input */}
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.newChartsRatingCandidates}
            contentHidden={hideNewCandidateSongs}
            onClick={this.toggleNewCandidateChartsDisplay}
            isCandidateList
          />
          <ChartRecordsTable
            isDxPlus={isDxPlus}
            records={newChartRecords}
            offset={newTopChartsCount}
            isCandidate
            hidden={hideNewCandidateSongs}
          />
        </div>
        <div className="songRecordsContainer">
          <ChartRecordSectionTitle
            title={UIString.oldChartsRatingCandidates}
            contentHidden={hideOldCandidateSongs}
            onClick={this.toggleOldCandidateChartsDisplay}
            isCandidateList
          />
          <ChartRecordsTable
            isDxPlus={isDxPlus}
            records={oldChartRecords}
            offset={oldTopChartsCount}
            isCandidate
            hidden={hideOldCandidateSongs}
          />
        </div>
        <hr className="sectionSep" />
      </div>
    );
  }

  private toggleNewTopChartsDisplay = () => {
    this.setState((state) => ({hideNewTopSongs: !state.hideNewTopSongs}));
  };

  private toggleNewCandidateChartsDisplay = () => {
    this.setState((state) => ({hideNewCandidateSongs: !state.hideNewCandidateSongs}));
  };

  private toggleOldTopChartsDisplay = () => {
    this.setState((state) => ({hideOldTopSongs: !state.hideOldTopSongs}));
  };

  private toggleOldCandidateChartsDisplay = () => {
    this.setState((state) => ({hideOldCandidateSongs: !state.hideOldCandidateSongs}));
  };
}
