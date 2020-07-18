import React from 'react';

import {getCandidateSongs} from '../candidate-songs';
import {UIString} from '../i18n';
import {RatingData} from '../types';
import {ChartRecordsTable} from './ChartRecordsTable';
import {DifficultyRankDistribution} from './DifficultyRankDistribution';
import {LevelRankDistribution} from './LevelRankDistribution';
import {RatingOverview} from './RatingOverview';

interface Props {
  isDxPlus: boolean;
  ratingData: RatingData;
  playerGradeIndex: number;
}
export class RatingOutput extends React.PureComponent<Props> {
  private outputArea = React.createRef<HTMLDivElement>();

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
    const newCandidateScores = getCandidateSongs(newChartRecords, newTopChartsCount, isDxPlus);
    const oldCandidateScores = getCandidateSongs(oldChartRecords, oldTopChartsCount, isDxPlus);
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
    <h3>▶ {UIString.newChartsRatingTargets}</h3>
          <ChartRecordsTable records={newChartRecords.slice(0, newTopChartsCount)} />
        </div>
        <div className="songRecordsContainer">
    <h3>▶ {UIString.oldChartsRatingTargets}</h3>
          <ChartRecordsTable records={oldChartRecords.slice(0, oldTopChartsCount)} />
        </div>
        {/* TODO: filter by song name from user input */}
        <div className="songRecordsContainer">
          <h3>▷ {UIString.newChartsRatingCandidates}</h3>
          <ChartRecordsTable records={newCandidateScores} isCandidate />
        </div>
        <div className="songRecordsContainer">
          <h3>▷ {UIString.oldChartsRatingCandidates}</h3>
          <ChartRecordsTable records={oldCandidateScores} isCandidate />
        </div>
        <hr className="sectionSep" />
      </div>
    );
  }
}
