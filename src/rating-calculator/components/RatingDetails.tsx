import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {SongDatabase} from '../../common/song-props';
import {NUM_TOP_NEW_CHARTS, NUM_TOP_OLD_CHARTS} from '../rating-analyzer';
import {ChartRecordWithRating, RatingData} from '../types';
import {CandidateChartRecords} from './CandidatesChartRecords';
import {CollapsibleSectionTitle} from './CollapsibleSectionTitle';
import {TopChartRecords} from './TopChartRecords';

const MessagesByLang = {
  [Language.en_US]: {
    newChartsRatingTargets: 'New Charts Rating Subjects (best {count}):',
    oldChartsRatingTargets: 'Old Charts Rating Subjects (best {count}):',
    newChartsRatingCandidates: 'New Charts Rating Candidates:',
    oldChartsRatingCandidates: 'Old Charts Rating Candidates:',
  },
  [Language.zh_TW]: {
    newChartsRatingTargets: '新譜面 Rating 對象曲 (取最佳 {count} 首)：',
    oldChartsRatingTargets: '舊譜面 Rating 對象曲 (取最佳 {count} 首)：',
    newChartsRatingCandidates: '新譜面 Rating 候選曲：',
    oldChartsRatingCandidates: '舊譜面 Rating 候選曲：',
  },
  [Language.ko_KR]: {
    newChartsRatingTargets: '신곡 레이팅 (최고 기록 {count} 개)：',
    oldChartsRatingTargets: '구곡 레이팅 (최고 기록 {count} 개)：',
    newChartsRatingCandidates: '신곡 레이팅 후보：',
    oldChartsRatingCandidates: '구곡 레이팅 후보：',
  },
};

interface Props {
  songDatabase: SongDatabase;
  ratingData: RatingData;
  newCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  oldCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  notPlayedNewCharts?: ReadonlyArray<ChartRecordWithRating>;
  notPlayedOldCharts?: ReadonlyArray<ChartRecordWithRating>;
  compactMode: boolean;
}

export const RatingDetails = ({
  compactMode,
  newCandidateCharts,
  notPlayedNewCharts,
  oldCandidateCharts,
  notPlayedOldCharts,
  songDatabase,
  ratingData,
}: Props) => {
  const [hideNewTopSongs, setHideNewTopSongs] = useState(false);
  const [hideOldTopSongs, setHideOldTopSongs] = useState(false);
  const [hideNewCandidates, setHideNewCandidates] = useState(false);
  const [hideOldCandidates, setHideOldCandidates] = useState(false);

  const toggleNewTopChartsDisplay = useCallback(() => {
    setHideNewTopSongs(!hideNewTopSongs);
  }, [hideNewTopSongs]);

  const toggleOldTopChartsDisplay = useCallback(() => {
    setHideOldTopSongs(!hideOldTopSongs);
  }, [hideOldTopSongs]);

  const toggleNewCandidateChartsDisplay = useCallback(() => {
    setHideNewCandidates(!hideNewCandidates);
  }, [hideNewCandidates]);

  const toggleOldCandidateChartsDisplay = useCallback(() => {
    setHideOldCandidates(!hideOldCandidates);
  }, [hideOldCandidates]);

  const {newChartRecords, newTopChartsCount, oldChartRecords, oldTopChartsCount} = ratingData;
  const messages = MessagesByLang[useLanguage()];
  return (
    <>
      <div className="songRecordsContainer">
        <CollapsibleSectionTitle
          title={messages.newChartsRatingTargets.replace('{count}', NUM_TOP_NEW_CHARTS.toFixed(0))}
          contentHidden={hideNewTopSongs}
          onClick={toggleNewTopChartsDisplay}
        />
        <TopChartRecords
          songDatabase={songDatabase}
          records={newChartRecords}
          limit={newTopChartsCount}
          hidden={hideNewTopSongs}
          compactMode={compactMode}
        />
      </div>
      <div className="songRecordsContainer">
        <CollapsibleSectionTitle
          title={messages.oldChartsRatingTargets.replace('{count}', NUM_TOP_OLD_CHARTS.toFixed(0))}
          contentHidden={hideOldTopSongs}
          onClick={toggleOldTopChartsDisplay}
        />
        <TopChartRecords
          songDatabase={songDatabase}
          records={oldChartRecords}
          limit={oldTopChartsCount}
          hidden={hideOldTopSongs}
          compactMode={compactMode}
        />
      </div>
      {!compactMode && (
        <div className="songRecordsContainer">
          <CollapsibleSectionTitle
            title={messages.newChartsRatingCandidates}
            contentHidden={hideNewCandidates}
            onClick={toggleNewCandidateChartsDisplay}
            isCandidateList
          />
          <CandidateChartRecords
            name="new"
            songDatabase={songDatabase}
            hidden={hideNewCandidates}
            played={newCandidateCharts}
            notPlayed={notPlayedNewCharts}
          />
        </div>
      )}
      {!compactMode && (
        <div className="songRecordsContainer">
          <CollapsibleSectionTitle
            title={messages.oldChartsRatingCandidates}
            contentHidden={hideOldCandidates}
            onClick={toggleOldCandidateChartsDisplay}
            isCandidateList
          />
          <CandidateChartRecords
            name="old"
            songDatabase={songDatabase}
            hidden={hideOldCandidates}
            played={oldCandidateCharts}
            notPlayed={notPlayedOldCharts}
          />
        </div>
      )}
    </>
  );
};
