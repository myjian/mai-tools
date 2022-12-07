import React from 'react';

import {DxVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {roundFloat} from '../../common/number-helper';
import {getRankDefinitions, RankDef} from '../../common/rank-functions';
import {GameRegion} from '../types';
import {RecommendedLevelCell} from './RecommendedLevelCell';

const MIN_RANK = "SS";
const MAX_LV = 15;

const MessagesByLang = {
  [Language.en_US]: {
    recommendedLevels: "Recommended levels",
    projectedRating: "Potential Rating",
    newChartsRecLv: "New Charts",
    oldChartsRecLv: "Old Charts",
    levelComment:
      "Note: X.7 and above is classified under X+. For example, 10.7, 10.8, and 10.9 are 10+.",
  },
  [Language.zh_TW]: {
    recommendedLevels: "刷分目標 (推薦等級)",
    projectedRating: "可獲得 R 值",
    newChartsRecLv: "新譜面",
    oldChartsRecLv: "舊譜面",
    levelComment: "註：X.7 以上是歸類在官方的 X+。舉例來說：10.7, 10.8, 10.9 都算是 10+。",
  },
};

interface Props {
  gameRegion: GameRegion;
  gameVer: DxVersion;
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
  let ranks = getRankDefinitions();
  const minRankIdx = ranks.findIndex((r) => r.title === MIN_RANK);
  ranks = ranks
    .slice(0, minRankIdx + 1)
    .filter((r, i, arr) => i === arr.length - 1 || r.title !== arr[i + 1].title);
  const avgNewChartRating =
    newTopChartsCount > 0 ? Math.floor(newChartsRating / newTopChartsCount) : 0;
  const avgOldChartRating =
    oldTopChartsCount > 0 ? Math.floor(oldChartsRating / oldTopChartsCount) : 0;
  const newLvs = ranks.map((r) => {
    const lv = calcRecommendedLv(avgNewChartRating, r);
    return lv > MAX_LV ? -1 : lv;
  });
  const oldLvs = ranks.map((r) => {
    const lv = calcRecommendedLv(avgOldChartRating, r);
    return lv > MAX_LV ? -1 : lv;
  });
  return (
    <div className="recLvSection">
      <h3 className="recLvTitle">{messages.recommendedLevels}</h3>
      <table className="recLvTable">
        <thead>
          <tr>
            <th className="recLvFirstCol"></th>
            {ranks.map((r) => (
              <th>
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
              {newLvs.map((lv) => (
                <RecommendedLevelCell gameRegion={gameRegion} gameVer={gameVer} lv={lv} />
              ))}
              <td>{Math.floor(avgNewChartRating)}↑</td>
            </tr>
          )}
          {avgOldChartRating > 0 && (
            <tr>
              <th className="recLvFirstCol">{messages.oldChartsRecLv}</th>
              {oldLvs.map((lv) => (
                <RecommendedLevelCell
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

function calcRecommendedLv(rating: number, r: RankDef): number {
  return roundFloat((rating / r.factor / r.minAchv) * 100, "ceil", 0.1);
}
