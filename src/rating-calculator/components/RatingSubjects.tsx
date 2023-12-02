import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {SongDatabase} from '../../common/song-props';
import {CommonMessages} from '../common-messages';
import {NUM_TOP_NEW_CHARTS, NUM_TOP_OLD_CHARTS} from '../rating-analyzer';
import {getAvg} from '../rating-functions';
import {RatingData} from '../types';
import {CollapsibleSectionTitle} from './CollapsibleSectionTitle';
import {TopChartRecords} from './TopChartRecords';

const MessagesByLang = {
  [Language.en_US]: {
    newChartsRatingSubjects: 'New Charts Rating Subjects (best {count}):',
    oldChartsRatingSubjects: 'Old Charts Rating Subjects (best {count}):',
  },
  [Language.zh_TW]: {
    newChartsRatingSubjects: '新譜面 Rating 對象曲 (取最佳 {count} 首)：',
    oldChartsRatingSubjects: '舊譜面 Rating 對象曲 (取最佳 {count} 首)：',
  },
  [Language.ko_KR]: {
    newChartsRatingSubjects: '신곡 레이팅 (최고 기록 {count} 개)：',
    oldChartsRatingSubjects: '구곡 레이팅 (최고 기록 {count} 개)：',
  },
};

interface Props {
  songDatabase: SongDatabase;
  ratingData: RatingData;
  compactMode: boolean;
  isCurrentVersion?: boolean;
}

export const RatingSubjects = ({
  compactMode,
  songDatabase,
  ratingData,
  isCurrentVersion,
}: Props) => {
  const [hideContent, setHideContent] = useState(false);

  const toggleContentDisplay = useCallback(() => {
    setHideContent(!hideContent);
  }, [hideContent]);

  const lang = useLanguage();
  const commonMsgs = CommonMessages[lang];
  const messages = MessagesByLang[lang];
  const avgRating = isCurrentVersion
    ? getAvg(ratingData.newChartsRating, ratingData.newTopChartsCount)
    : getAvg(ratingData.oldChartsRating, ratingData.oldTopChartsCount);
  const records = isCurrentVersion ? ratingData.newChartRecords : ratingData.oldChartRecords;
  const topCount = isCurrentVersion ? ratingData.newTopChartsCount : ratingData.oldTopChartsCount;
  const maxTopCount = isCurrentVersion ? NUM_TOP_NEW_CHARTS : NUM_TOP_OLD_CHARTS;
  const titleWithPlaceholder = isCurrentVersion
    ? messages.newChartsRatingSubjects
    : messages.oldChartsRatingSubjects;
  const title = titleWithPlaceholder.replace('{count}', maxTopCount.toFixed(0));

  return (
    <div className={'ratingSubjects ' + (hideContent ? 'contentHidden' : '')}>
      {compactMode ? (
        <div className="ratingSubjectsMiniHeading">
          {`${title} ${commonMsgs.average} ${avgRating}`}
        </div>
      ) : (
        <CollapsibleSectionTitle
          title={title}
          contentHidden={hideContent}
          onClick={toggleContentDisplay}
        />
      )}
      <TopChartRecords
        songDatabase={songDatabase}
        records={records}
        limit={topCount}
        hidden={hideContent}
        compactMode={compactMode}
      />
    </div>
  );
};
