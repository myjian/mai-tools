import React from 'react';

import {DxVersion} from '../../common/constants';
import {SongProperties} from '../../common/song-props';
import {getCandidateCharts, getNotPlayedCharts} from '../candidate-songs';
import {UIString} from '../i18n';
import {getNumOfTopNewCharts, getNumOfTopOldCharts} from '../rating-analyzer';
import {calculateMaxRating} from '../rating-functions';
import {ChartRecordWithRating, GameRegion, RatingData} from '../types';
import {RatingDetails} from './RatingDetails';
import {RatingOverview} from './RatingOverview';
import {RecommendedLevels} from './RecommendedLevels';

const NEW_CANDIDATE_SONGS_POOL_SIZE = 100;
const OLD_CANDIDATE_SONGS_POOL_SIZE = 250;

interface Props {
  gameRegion: GameRegion;
  gameVer: DxVersion;
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
  ratingData: RatingData;
  playerGradeIndex: number;
  playerName: string | null;
  oldSongs?: ReadonlyArray<SongProperties>;
  newSongs?: ReadonlyArray<SongProperties>;
}

interface State {
  newCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  oldCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  notPlayedNewCharts?: ReadonlyArray<ChartRecordWithRating>;
  notPlayedOldCharts?: ReadonlyArray<ChartRecordWithRating>;
  maxNewChartsRating?: number;
  maxOldChartsRating?: number;
}

export class RatingOutput extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps: React.GetDerivedStateFromProps<Props, State> = (props) => {
    const {gameVer, newSongs, oldSongs, ratingData} = props;
    const {newChartRecords, newTopChartsCount, oldChartRecords, oldTopChartsCount} = ratingData;

    const newCandidateCharts = getCandidateCharts(
      gameVer,
      newChartRecords,
      newTopChartsCount,
      NEW_CANDIDATE_SONGS_POOL_SIZE
    );
    const notPlayedNewCharts = newSongs
      ? getNotPlayedCharts(
          gameVer,
          newSongs,
          newChartRecords,
          newTopChartsCount,
          NEW_CANDIDATE_SONGS_POOL_SIZE
        )
      : [];
    const oldCandidateCharts = getCandidateCharts(
      gameVer,
      oldChartRecords,
      oldTopChartsCount,
      OLD_CANDIDATE_SONGS_POOL_SIZE
    );
    const notPlayedOldCharts = oldSongs
      ? getNotPlayedCharts(
          gameVer,
          oldSongs,
          oldChartRecords,
          oldTopChartsCount,
          OLD_CANDIDATE_SONGS_POOL_SIZE
        )
      : [];

    const maxNewChartsRating = newSongs
      ? calculateMaxRating(gameVer, newSongs, getNumOfTopNewCharts())
      : 0;
    const maxOldChartsRating = oldSongs
      ? calculateMaxRating(gameVer, oldSongs, getNumOfTopOldCharts(gameVer))
      : 0;
    return {
      newCandidateCharts,
      oldCandidateCharts,
      notPlayedNewCharts,
      notPlayedOldCharts,
      maxNewChartsRating,
      maxOldChartsRating,
    };
  };

  private outputArea = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (this.outputArea.current) {
      this.outputArea.current.scrollIntoView({behavior: "smooth"});
    }
  }

  render() {
    const {gameRegion, gameVer, playerName, playerGradeIndex, songPropsByName} = this.props;
    const {
      newChartsRating,
      newTopChartsCount,
      oldChartsRating,
      oldTopChartsCount,
    } = this.props.ratingData;
    const {
      newCandidateCharts,
      oldCandidateCharts,
      notPlayedNewCharts,
      notPlayedOldCharts,
      maxNewChartsRating,
      maxOldChartsRating,
    } = this.state;
    return (
      <div className="outputArea" ref={this.outputArea}>
        <h2 id="outputHeading">
          {UIString.analysisResult}
          {playerName ? ` - ${playerName}` : null}
        </h2>
        <RatingOverview
          gameVer={gameVer}
          newChartsRating={newChartsRating}
          newChartsMaxRating={maxNewChartsRating}
          newTopChartsCount={newTopChartsCount}
          oldChartsRating={oldChartsRating}
          oldChartsMaxRating={maxOldChartsRating}
          oldTopChartsCount={oldTopChartsCount}
          playerGradeIndex={gameVer <= DxVersion.SPLASH ? playerGradeIndex : 0}
        />
        <RecommendedLevels
          gameRegion={gameRegion}
          gameVer={gameVer}
          newChartsRating={newChartsRating}
          newTopChartsCount={newTopChartsCount}
          oldChartsRating={oldChartsRating}
          oldTopChartsCount={oldTopChartsCount}
        />
        <RatingDetails
          gameVer={gameVer}
          songPropsByName={songPropsByName}
          newCandidateCharts={newCandidateCharts}
          oldCandidateCharts={oldCandidateCharts}
          notPlayedNewCharts={notPlayedNewCharts}
          notPlayedOldCharts={notPlayedOldCharts}
          ratingData={this.props.ratingData}
        />
        <hr className="sectionSep" />
      </div>
    );
  }
}
