import '../css/rating-output.css';

import React, {useCallback, useMemo, useState} from 'react';

import {GameRegion} from '../../common/game-region';
import {GameVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {BasicSongProps, SongDatabase, SongProperties} from '../../common/song-props';
import {NUM_TOP_NEW_CHARTS, NUM_TOP_OLD_CHARTS} from '../rating-analyzer';
import {calculateFullRating} from '../rating-functions';
import {RatingData} from '../types';
import {RatingCandidates} from './RatingCandidates';
import {RatingOverview} from './RatingOverview';
import {RatingSubjects} from './RatingSubjects';
import {RecommendedLevels} from './RecommendedLevels';
import {ShareRating} from './ShareRating';

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

interface Props {
  gameRegion: GameRegion;
  gameVer: GameVersion;
  songDatabase: SongDatabase;
  ratingData: RatingData;
  playerGradeIndex: number;
  allSongs?: ReadonlyArray<BasicSongProps>;
}

interface State {
  fullNewChartsRating?: number;
  fullOldChartsRating?: number;
  newSongs?: ReadonlyArray<SongProperties>;
  oldSongs?: ReadonlyArray<SongProperties>;
}

export const RatingOutput = ({
  gameVer,
  allSongs,
  ratingData,
  gameRegion,
  playerGradeIndex,
  songDatabase,
}: Props) => {
  const state = useMemo<State>(() => {
    const allSongProps = allSongs
      ? songDatabase.getPropsForSongs(allSongs)
      : gameRegion === GameRegion.Jp
      ? songDatabase.getAllProps()
      : null;
    const newSongs = allSongProps?.filter((song) => song.debut === gameVer);
    const oldSongs = allSongProps?.filter((song) => song.debut < gameVer);
    const fullNewChartsRating = newSongs ? calculateFullRating(newSongs, NUM_TOP_NEW_CHARTS) : 0;
    const fullOldChartsRating = oldSongs ? calculateFullRating(oldSongs, NUM_TOP_OLD_CHARTS) : 0;
    return {newSongs, oldSongs, fullNewChartsRating, fullOldChartsRating};
  }, [songDatabase, allSongs, gameVer, gameRegion]);

  const [compactMode, setCompactMode] = useState(false);

  const toggleCompactMode = useCallback((evt: React.SyntheticEvent<HTMLInputElement>) => {
    setCompactMode(evt.currentTarget.checked);
  }, []);

  const {newTopChartsCount, oldTopChartsCount} = ratingData;
  const {fullNewChartsRating, fullOldChartsRating} = state;
  const totalRating = ratingData.newChartsRating + ratingData.oldChartsRating;
  const messages = MessagesByLang[useLanguage()];

  const ratingOverview = (
    <RatingOverview
      compactMode={compactMode}
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
    <div id="ratingOutput">
      <div>
        <label>
          <input type="checkbox" checked={compactMode} onChange={toggleCompactMode} />{' '}
          {messages.compactMode}
        </label>
      </div>
      <ShareRating
        gameRegion={gameRegion}
        gameVer={gameVer}
        ratingData={ratingData}
        songDb={songDatabase}
      />
      {compactMode ? (
        <>
          <div className="compactRatingRow">
            {ratingOverview}
            {ratingSubjectsNew}
          </div>
          {ratingSubjectsOld}
        </>
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
            songList={state.newSongs}
            ratingData={ratingData}
          />
          <RatingCandidates
            songDatabase={songDatabase}
            songList={state.oldSongs}
            ratingData={ratingData}
          />
        </div>
      )}
      <hr className="sectionSep" />
    </div>
  );
};
