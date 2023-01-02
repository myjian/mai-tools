import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {SongProperties} from '../../common/song-props';
import {getNumOfTopNewCharts, getNumOfTopOldCharts} from '../rating-analyzer';
import {ChartRecordWithRating, RatingData} from '../types';
import {CandidateChartRecords} from './CandidatesChartRecords';
import {ChartRecordSectionTitle} from './ChartRecordSectionTitle';
import {TopChartRecords} from './TopChartRecords';

const MessagesByLang = {
  [Language.en_US]: {
    newChartsRatingTargets: "New Charts Rating Subjects (best {count}):",
    oldChartsRatingTargets: "Old Charts Rating Subjects (best {count}):",
    newChartsRatingCandidates: "New Charts Rating Candidates:",
    oldChartsRatingCandidates: "Old Charts Rating Candidates:",
  },
  [Language.zh_TW]: {
    newChartsRatingTargets: "新譜面 Rating 對象曲 (取最佳 {count} 首)：",
    oldChartsRatingTargets: "舊譜面 Rating 對象曲 (取最佳 {count} 首)：",
    newChartsRatingCandidates: "新譜面 Rating 候選曲：",
    oldChartsRatingCandidates: "舊譜面 Rating 候選曲：",
  },
  [Language.ko_KR]: {
    newChartsRatingTargets: "신곡 레이팅 (최고 기록 {count} 개)：",
    oldChartsRatingTargets: "구곡 레이팅 (최고 기록 {count} 개)：",
    newChartsRatingCandidates: "신곡 레이팅 후보：",
    oldChartsRatingCandidates: "구곡 레이팅 후보：",
  },
};

interface Props {
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>;
  ratingData: RatingData;
  newCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  oldCandidateCharts: ReadonlyArray<ChartRecordWithRating>;
  notPlayedNewCharts?: ReadonlyArray<ChartRecordWithRating>;
  notPlayedOldCharts?: ReadonlyArray<ChartRecordWithRating>;
}

export const RatingDetails = ({
  newCandidateCharts,
  notPlayedNewCharts,
  oldCandidateCharts,
  notPlayedOldCharts,
  songPropsByName,
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
        <ChartRecordSectionTitle
          title={messages.newChartsRatingTargets.replace(
            "{count}",
            getNumOfTopNewCharts().toFixed(0)
          )}
          contentHidden={hideNewTopSongs}
          onClick={toggleNewTopChartsDisplay}
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
          title={messages.oldChartsRatingTargets.replace(
            "{count}",
            getNumOfTopOldCharts().toFixed(0)
          )}
          contentHidden={hideOldTopSongs}
          onClick={toggleOldTopChartsDisplay}
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
          title={messages.newChartsRatingCandidates}
          contentHidden={hideNewCandidates}
          onClick={toggleNewCandidateChartsDisplay}
          isCandidateList
        />
        <CandidateChartRecords
          name="new"
          songPropsByName={songPropsByName}
          hidden={hideNewCandidates}
          played={newCandidateCharts}
          notPlayed={notPlayedNewCharts}
        />
      </div>
      <div className="songRecordsContainer">
        <ChartRecordSectionTitle
          title={messages.oldChartsRatingCandidates}
          contentHidden={hideOldCandidates}
          onClick={toggleOldCandidateChartsDisplay}
          isCandidateList
        />
        <CandidateChartRecords
          name="old"
          songPropsByName={songPropsByName}
          hidden={hideOldCandidates}
          played={oldCandidateCharts}
          notPlayed={notPlayedOldCharts}
        />
      </div>
    </>
  );
};
