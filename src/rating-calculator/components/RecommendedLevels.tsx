import React, {useCallback, useState} from 'react';

import {RecommendedLevelRow} from '../../common/components/RecommendedLevelRow';
import {GameRegion} from '../../common/game-region';
import {GameVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {
  calcRecommendedLevels,
  getRankDefinitions,
  getRankIndexByAchievement,
} from '../../common/rank-functions';
import {CommonMessages} from '../common-messages';
import {CollapsibleContainer} from './CollapsibleContainer';
import {CollapsibleSectionTitle} from './CollapsibleSectionTitle';

const MIN_ACHIEVEMENT = 99;

const MessagesByLang = {
  [Language.en_US]: {
    recommendedLevels: 'Recommended levels',
    projectedRating: 'Potential Rating',
    newChartsRecLv: 'New Charts',
    oldChartsRecLv: 'Old Charts',
    levelComment:
      'Note: X.7 and above is classified under X+. For example, 10.7, 10.8, and 10.9 are 10+.',
  },
  [Language.zh_TW]: {
    recommendedLevels: '刷分目標 (推薦等級)',
    newChartsRecLv: '新譜面',
    oldChartsRecLv: '舊譜面',
    levelComment: '註：X.7 以上是歸類在官方的 X+。舉例來說：10.7, 10.8, 10.9 都算是 10+。',
  },
  [Language.ko_KR]: {
    recommendedLevels: '추천 레벨',
    newChartsRecLv: '신곡 채보',
    oldChartsRecLv: '구곡 채보',
    levelComment: '참고：X.7 이상은 X+로 표시됩니다. 예를 들면 10.7, 10.8, 10.9는 10+입니다.',
  },
};

interface Props {
  gameRegion: GameRegion;
  gameVer: GameVersion;
  lowestOldChartRating: number;
  lowestNewChartRating: number;
}

export const RecommendedLevels = ({
  gameRegion,
  gameVer,
  lowestNewChartRating,
  lowestOldChartRating,
}: Props) => {
  const lang = useLanguage();
  const messages = MessagesByLang[lang];
  const ranks = getRankDefinitions().slice(0, getRankIndexByAchievement(MIN_ACHIEVEMENT) + 1);
  const newLvsByRank = calcRecommendedLevels(lowestNewChartRating + 1, ranks);
  const oldLvsByRank = calcRecommendedLevels(lowestOldChartRating + 1, ranks);
  const [contentHidden, setContentHidden] = useState<boolean>(false);
  const handleTitleClick = useCallback(() => {
    setContentHidden(!contentHidden);
  }, [contentHidden]);
  return (
    <div className="recLvSection">
      <CollapsibleSectionTitle
        title={messages.recommendedLevels}
        contentHidden={contentHidden}
        onClick={handleTitleClick}
      />
      <CollapsibleContainer hidden={contentHidden}>
        <table className="recLvTable">
          <thead>
            <tr>
              <th>{CommonMessages[lang].level}</th>
              <th>{CommonMessages[lang].rank}</th>
              <th>{CommonMessages[lang].achievementAbbr}</th>
              <th>{CommonMessages[lang].rating}</th>
            </tr>
          </thead>
          <tbody>
            {lowestNewChartRating > 0 && (
              <>
                <tr>
                  <th colSpan={4}>{messages.newChartsRecLv}</th>
                </tr>
                {ranks
                  .map((rank) =>
                    newLvsByRank[rank.title].map((recLv, idx) => (
                      <RecommendedLevelRow
                        key={idx}
                        gameRegion={gameRegion}
                        gameVer={gameVer}
                        rankTitle={rank.title}
                        recLv={recLv}
                      />
                    ))
                  )
                  .flat()}
              </>
            )}
            {lowestOldChartRating > 0 && (
              <>
                <tr>
                  <th colSpan={4}>{messages.oldChartsRecLv}</th>
                </tr>
                {ranks
                  .map((rank) =>
                    oldLvsByRank[rank.title].map((recLv, idx) => (
                      <RecommendedLevelRow
                        key={idx}
                        gameRegion={gameRegion}
                        gameVer={gameVer - 1}
                        rankTitle={rank.title}
                        recLv={recLv}
                        includeOldVersions
                      />
                    ))
                  )
                  .flat()}
              </>
            )}
          </tbody>
        </table>
        <p className="recLvDesc">{messages.levelComment}</p>
      </CollapsibleContainer>
    </div>
  );
};
