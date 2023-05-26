import React from 'react';

import {RecommendedLevelCell} from '../../common/components/RecommendedLevelCell';
import {GameRegion} from '../../common/game-region';
import {GameVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {
  calcRecommendedLv,
  getRankDefinitions,
  getRankIndexByAchievement,
} from '../../common/rank-functions';

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
    projectedRating: '可獲得 R 值',
    newChartsRecLv: '新譜面',
    oldChartsRecLv: '舊譜面',
    levelComment: '註：X.7 以上是歸類在官方的 X+。舉例來說：10.7, 10.8, 10.9 都算是 10+。',
  },
  [Language.ko_KR]: {
    recommendedLevels: '추천 난이도',
    projectedRating: '잠재적 레이팅',
    newChartsRecLv: '신곡 채보',
    oldChartsRecLv: '구곡 채보',
    levelComment: '참고：X.7 이상은 X+로 표시됩니다. 예를 들면 10.7, 10.8, 10.9는 10+입니다.',
  },
};

interface Props {
  gameRegion: GameRegion;
  gameVer: GameVersion;
  oldChartsRating: number;
  oldTopChartsCount: number;
  newChartsRating: number;
  newTopChartsCount: number;
}

export const RecommendedLevels = ({
  gameRegion,
  gameVer,
  newChartsRating,
  newTopChartsCount,
  oldChartsRating,
  oldTopChartsCount,
}: Props) => {
  const messages = MessagesByLang[useLanguage()];
  const ranks = getRankDefinitions().slice(0, getRankIndexByAchievement(MIN_ACHIEVEMENT) + 1);
  const avgNewChartRating =
    newTopChartsCount > 0 ? Math.floor(newChartsRating / newTopChartsCount) : 0;
  const avgOldChartRating =
    oldTopChartsCount > 0 ? Math.floor(oldChartsRating / oldTopChartsCount) : 0;
  const newLvs = ranks.map((r) => calcRecommendedLv(avgNewChartRating, r));
  const oldLvs = ranks.map((r) => calcRecommendedLv(avgOldChartRating, r));
  return (
    <div className="recLvSection">
      <h3 className="recLvTitle">{messages.recommendedLevels}</h3>
      <table className="recLvTable">
        <thead>
          <tr>
            <th className="recLvFirstCol"></th>
            {ranks.map((r) => (
              <th key={r.title}>
                <span className="recLvRankTitle">{r.title}</span>
                <span className="recLvRankAchv">{r.minAchv}%</span>
              </th>
            ))}
            <th>{messages.projectedRating}</th>
          </tr>
        </thead>
        <tbody>
          {avgNewChartRating > 0 && (
            <tr>
              <th className="recLvFirstCol">{messages.newChartsRecLv}</th>
              {newLvs.map((lv, idx) => (
                <RecommendedLevelCell key={idx} gameRegion={gameRegion} gameVer={gameVer} lv={lv} />
              ))}
              <td>{Math.floor(avgNewChartRating)}↑</td>
            </tr>
          )}
          {avgOldChartRating > 0 && (
            <tr>
              <th className="recLvFirstCol">{messages.oldChartsRecLv}</th>
              {oldLvs.map((lv, idx) => (
                <RecommendedLevelCell
                  key={idx}
                  gameRegion={gameRegion}
                  gameVer={gameVer - 1}
                  includeOldVersions
                  lv={lv}
                />
              ))}
              <td>{Math.floor(avgOldChartRating)}↑</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="recLvDesc">{messages.levelComment}</p>
    </div>
  );
};
