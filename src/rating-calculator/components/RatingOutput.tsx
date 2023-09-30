import '../css/rating-output.css';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {GameRegion} from '../../common/game-region';
import {GameVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {SongDatabase, SongProperties} from '../../common/song-props';
import {getCandidateCharts, getNotPlayedCharts} from '../candidate-songs';
import {NUM_TOP_NEW_CHARTS, NUM_TOP_OLD_CHARTS} from '../rating-analyzer';
import {calculateFullRating} from '../rating-functions';
import {ChartRecordWithRating, RatingData} from '../types';
import {RatingCandidates} from './RatingCandidates';
import {RatingOverview} from './RatingOverview';
import {RatingSubjects} from './RatingSubjects';
import {RecommendedLevels} from './RecommendedLevels';

const MessagesByLang = {
  [Language.en_US]: {
    compactMode: 'Compact mode',
  },
  [Language.zh_TW]: {
    compactMode: '精簡版',
  },
  [Language.ko_KR]: {
    compactMode: '간결한 모드',
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
  oldSongs?: ReadonlyArray<SongProperties>;
  newSongs?: ReadonlyArray<SongProperties>;
}

interface State {
  newCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  oldCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  notPlayedNewCharts?: ReadonlyArray<ChartRecordWithRating>;
  notPlayedOldCharts?: ReadonlyArray<ChartRecordWithRating>;
  fullNewChartsRating?: number;
  fullOldChartsRating?: number;
}

export const RatingOutput = ({
  gameVer,
  newSongs,
  oldSongs,
  ratingData,
  gameRegion,
  playerGradeIndex,
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

    const fullNewChartsRating = newSongs ? calculateFullRating(newSongs, NUM_TOP_NEW_CHARTS) : 0;
    const fullOldChartsRating = oldSongs ? calculateFullRating(oldSongs, NUM_TOP_OLD_CHARTS) : 0;
    return {
      newCandidateCharts,
      oldCandidateCharts,
      notPlayedNewCharts,
      notPlayedOldCharts,
      fullNewChartsRating,
      fullOldChartsRating,
    };
  }, [newSongs, oldSongs, ratingData]);

  const outputRef = useRef<HTMLDivElement>();
  const [compactMode, setCompactMode] = useState(false);

  const toggleCompactMode = useCallback((evt: React.SyntheticEvent<HTMLInputElement>) => {
    setCompactMode(evt.currentTarget.checked);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, []);

  const {newTopChartsCount, oldTopChartsCount} = ratingData;
  const {
    newCandidateCharts,
    oldCandidateCharts,
    notPlayedNewCharts,
    notPlayedOldCharts,
    fullNewChartsRating,
    fullOldChartsRating,
  } = state;
  const totalRating = ratingData.newChartsRating + ratingData.oldChartsRating;
  const messages = MessagesByLang[useLanguage()];

  const ratingOverview = (
    <RatingOverview
      fullNewChartsRating={fullNewChartsRating}
      fullOldChartsRating={fullOldChartsRating}
      ratingData={ratingData}
      totalRating={totalRating}
      playerGradeIndex={playerGradeIndex}
    />
  );

  const ratingSubjectsNew = (
    <RatingSubjects
      songDatabase={songDatabase}
      ratingData={ratingData}
      compactMode={compactMode}
      isCurrentVersion
    />
  );

  const ratingSubjectsOld = (
    <RatingSubjects songDatabase={songDatabase} ratingData={ratingData} compactMode={compactMode} />
  );

  return (
    <div ref={outputRef}>
      <div>
        <label>
          <input type="checkbox" checked={compactMode} onChange={toggleCompactMode} />{' '}
          {messages.compactMode}
        </label>
      </div>
      {compactMode ? (
        <div className="maybeFlexRow">
          <div className="compactRatingColumn">
            {ratingOverview}
            {ratingSubjectsNew}
          </div>
          {ratingSubjectsOld}
        </div>
      ) : (
        <>
          {ratingOverview}
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
          <div>
            {ratingSubjectsNew}
            {ratingSubjectsOld}
          </div>
        </>
      )}
      {!compactMode && (
        <div>
          <RatingCandidates
            songDatabase={songDatabase}
            isCurrentVersion
            candidateCharts={newCandidateCharts}
            notPlayedCharts={notPlayedNewCharts}
          />
          <RatingCandidates
            songDatabase={songDatabase}
            candidateCharts={oldCandidateCharts}
            notPlayedCharts={notPlayedOldCharts}
          />
        </div>
      )}
      <hr className="sectionSep" />
    </div>
  );
};
