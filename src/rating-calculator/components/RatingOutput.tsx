import React, {useEffect, useMemo, useRef} from 'react';

import {GameRegion} from '../../common/game-region';
import {GameVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {SongDatabase, SongProperties} from '../../common/song-props';
import {getCandidateCharts, getNotPlayedCharts} from '../candidate-songs';
import {NUM_TOP_NEW_CHARTS, NUM_TOP_OLD_CHARTS} from '../rating-analyzer';
import {calculateMaxRating} from '../rating-functions';
import {ChartRecordWithRating, RatingData} from '../types';
import {RatingDetails} from './RatingDetails';
import {RatingOverview} from './RatingOverview';
import {RecommendedLevels} from './RecommendedLevels';

const MessagesByLang = {
  [Language.en_US]: {
    analysisResult: 'Analysis Result',
  },
  [Language.zh_TW]: {
    analysisResult: '分析結果',
  },
  [Language.ko_KR]: {
    analysisResult: '분석결과',
  },
};

const NEW_CANDIDATE_SONGS_POOL_SIZE = 100;
const OLD_CANDIDATE_SONGS_POOL_SIZE = 250;

interface Props {
  gameRegion: GameRegion;
  gameVer: GameVersion;
  songDatabase: SongDatabase;
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

export const RatingOutput = ({
  gameVer,
  newSongs,
  oldSongs,
  ratingData,
  gameRegion,
  playerName,
  songDatabase,
}: Props) => {
  const state = useMemo<State>(() => {
    const {newChartRecords, newTopChartsCount, oldChartRecords, oldTopChartsCount} = ratingData;

    const newCandidateCharts = getCandidateCharts(
      newChartRecords,
      newTopChartsCount,
      NEW_CANDIDATE_SONGS_POOL_SIZE
    );
    const notPlayedNewCharts = newSongs
      ? getNotPlayedCharts(
          newSongs,
          newChartRecords,
          newTopChartsCount,
          NEW_CANDIDATE_SONGS_POOL_SIZE
        )
      : [];
    const oldCandidateCharts = getCandidateCharts(
      oldChartRecords,
      oldTopChartsCount,
      OLD_CANDIDATE_SONGS_POOL_SIZE
    );
    const notPlayedOldCharts = oldSongs
      ? getNotPlayedCharts(
          oldSongs,
          oldChartRecords,
          oldTopChartsCount,
          OLD_CANDIDATE_SONGS_POOL_SIZE
        )
      : [];

    const maxNewChartsRating = newSongs ? calculateMaxRating(newSongs, NUM_TOP_NEW_CHARTS) : 0;
    const maxOldChartsRating = oldSongs ? calculateMaxRating(oldSongs, NUM_TOP_OLD_CHARTS) : 0;
    return {
      newCandidateCharts,
      oldCandidateCharts,
      notPlayedNewCharts,
      notPlayedOldCharts,
      maxNewChartsRating,
      maxOldChartsRating,
    };
  }, [newSongs, oldSongs, ratingData]);

  const outputArea = useRef<HTMLDivElement>();

  useEffect(() => {
    if (outputArea.current) {
      outputArea.current.scrollIntoView({behavior: 'smooth'});
    }
  }, []);

  const {newChartsRating, newTopChartsCount, oldChartsRating, oldTopChartsCount} = ratingData;
  const {
    newCandidateCharts,
    oldCandidateCharts,
    notPlayedNewCharts,
    notPlayedOldCharts,
    maxNewChartsRating,
    maxOldChartsRating,
  } = state;
  const messages = MessagesByLang[useLanguage()];
  return (
    <div className="outputArea" ref={outputArea}>
      <h2 id="outputHeading">
        {messages.analysisResult}
        {playerName ? ` - ${playerName}` : null}
      </h2>
      <RatingOverview
        newChartsRating={newChartsRating}
        newChartsMaxRating={maxNewChartsRating}
        newTopChartsCount={newTopChartsCount}
        oldChartsRating={oldChartsRating}
        oldChartsMaxRating={maxOldChartsRating}
        oldTopChartsCount={oldTopChartsCount}
        playerGradeIndex={0}
      />
      <RecommendedLevels
        gameRegion={gameRegion}
        gameVer={gameVer}
        lowestNewChartRating={
          newTopChartsCount > 0 ? ratingData.newChartRecords[newTopChartsCount - 1].rating : 0
        }
        lowestOldChartRating={
          oldTopChartsCount > 0 ? ratingData.oldChartRecords[oldTopChartsCount - 1].rating : 0
        }
      />
      <RatingDetails
        songDatabase={songDatabase}
        newCandidateCharts={newCandidateCharts}
        oldCandidateCharts={oldCandidateCharts}
        notPlayedNewCharts={notPlayedNewCharts}
        notPlayedOldCharts={notPlayedOldCharts}
        ratingData={ratingData}
      />
      <hr className="sectionSep" />
    </div>
  );
};
