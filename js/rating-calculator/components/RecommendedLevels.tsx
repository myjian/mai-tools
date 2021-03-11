import React from 'react';

import {roundFloat} from '../../common/number-helper';
import {RANK_DEFINITIONS, RankDef} from '../../common/rank-functions';
import {UIString} from '../i18n';
import {GameRegion} from '../types';
import {RecommendedLevelCell} from './RecommendedLevelCell';

const MIN_RANK = "SS";
const MAX_LV = 15;

interface Props {
  gameRegion: GameRegion;
  gameVer: number;
  oldChartsRating: number;
  oldTopChartsCount: number;
  newChartsRating: number;
  newTopChartsCount: number;
}
export class RecommendedLevels extends React.PureComponent<Props> {
  render() {
    const {
      gameRegion,
      gameVer,
      newChartsRating,
      newTopChartsCount,
      oldChartsRating,
      oldTopChartsCount,
    } = this.props;
    let ranks = RANK_DEFINITIONS;
    const minRankIdx = ranks.findIndex((r) => r.title === MIN_RANK);
    ranks = ranks
      .slice(0, minRankIdx + 1)
      .filter((r, i, arr) => i === arr.length - 1 || r.title !== arr[i + 1].title);
    const avgNewChartRating =
      newTopChartsCount > 0 ? Math.floor(newChartsRating / newTopChartsCount) : 0;
    const avgOldChartRating =
      oldTopChartsCount > 0 ? Math.floor(oldChartsRating / oldTopChartsCount) : 0;
    const newLvs = ranks.map((r) => {
      const lv = this.calcRecommendedLv(avgNewChartRating, r);
      return lv > MAX_LV ? -1 : lv;
    });
    const oldLvs = ranks.map((r) => {
      const lv = this.calcRecommendedLv(avgOldChartRating, r);
      return lv > MAX_LV ? -1 : lv;
    });
    return (
      <div className="recLvSection">
        <h3 className="recLvTitle">{UIString.recommendedLevels}</h3>
        <p className="recLvDesc">{UIString.levelComment}</p>
        <table className="recLvTable">
          <thead>
            <tr>
              <th className="recLvFirstCol"></th>
              {ranks.map((r) => (
                <th>
                  <span className="recLvRankTitle">{r.title}</span>
                  <span className="recLvRankAchv">{r.th}%</span>
                </th>
              ))}
              <th>{UIString.projectedRating}</th>
            </tr>
          </thead>
          <tbody>
            {avgNewChartRating > 0 && (
              <tr>
                <th className="recLvFirstCol">{UIString.newChartsRecLv}</th>
                {newLvs.map((lv) => (
                  <RecommendedLevelCell gameRegion={gameRegion} gameVer={gameVer} lv={lv} />
                ))}
                <td>{Math.floor(avgNewChartRating)}↑</td>
              </tr>
            )}
            {avgOldChartRating > 0 && (
              <tr>
                <th className="recLvFirstCol">{UIString.oldChartsRecLv}</th>
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
      </div>
    );
  }

  private calcRecommendedLv(rating: number, r: RankDef): number {
    return roundFloat((rating / r.factor / r.th) * 100, "ceil", 0.1);
  }
}
