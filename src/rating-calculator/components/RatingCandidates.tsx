import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {SongDatabase} from '../../common/song-props';
import {ChartRecordWithRating} from '../types';
import {CandidateChartRecords} from './CandidatesChartRecords';
import {CollapsibleSectionTitle} from './CollapsibleSectionTitle';

const MessagesByLang = {
  [Language.en_US]: {
    newChartsRatingCandidates: 'New Charts Rating Candidates:',
    oldChartsRatingCandidates: 'Old Charts Rating Candidates:',
  },
  [Language.zh_TW]: {
    newChartsRatingCandidates: '新譜面 Rating 候選曲：',
    oldChartsRatingCandidates: '舊譜面 Rating 候選曲：',
  },
  [Language.ko_KR]: {
    newChartsRatingCandidates: '신곡 레이팅 후보：',
    oldChartsRatingCandidates: '구곡 레이팅 후보：',
  },
};

interface Props {
  songDatabase: SongDatabase;
  isCurrentVersion?: boolean;
  candidateCharts: ReadonlyArray<ChartRecordWithRating>;
  notPlayedCharts?: ReadonlyArray<ChartRecordWithRating>;
}

export const RatingCandidates = ({
  songDatabase,
  isCurrentVersion,
  candidateCharts,
  notPlayedCharts,
}: Props) => {
  const [hideCandidates, setHideCandidates] = useState(false);

  const toggleCandidateChartsDisplay = useCallback(() => {
    setHideCandidates(!hideCandidates);
  }, [hideCandidates]);
  const messages = MessagesByLang[useLanguage()];
  const title = isCurrentVersion
    ? messages.newChartsRatingCandidates
    : messages.oldChartsRatingCandidates;

  return (
    <div className={'ratingCandidates ' + (hideCandidates ? 'contentHidden' : '')}>
      <CollapsibleSectionTitle
        title={title}
        contentHidden={hideCandidates}
        onClick={toggleCandidateChartsDisplay}
        isCandidateList
      />
      <CandidateChartRecords
        name={isCurrentVersion ? 'new' : 'old'}
        songDatabase={songDatabase}
        hidden={hideCandidates}
        played={candidateCharts}
        notPlayed={notPlayedCharts}
      />
    </div>
  );
};
