import React from 'react';

import {UIString} from '../i18n';
import {roundFloat} from '../number-helper';
import {getRankDefinitions} from '../rank-functions';
import {RankDef} from '../types';

const MIN_RANK = "SS";
const DX_MAX_LV = 14;
const DX_PLUS_MAX_LV = 15;

interface Props {
  oldChartsRating: number;
  oldTopChartsCount: number;
  newChartsRating: number;
  newTopChartsCount: number;
  isDxPlus: boolean;
}
export class RecommendedLevels extends React.PureComponent<Props> {
  render() {
    const {
      isDxPlus,
      newChartsRating,
      newTopChartsCount,
      oldChartsRating,
      oldTopChartsCount,
    } = this.props;
    const maxLv = isDxPlus ? DX_PLUS_MAX_LV : DX_MAX_LV;
    let ranks = getRankDefinitions(isDxPlus);
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
      return lv > maxLv ? "--" : lv.toFixed(1) + UIString.tilde;
    });
    const oldLvs = ranks.map((r) => {
      const lv = this.calcRecommendedLv(avgOldChartRating, r);
      return lv > maxLv ? "--" : lv.toFixed(1) + UIString.tilde;
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
                  <span className="recLvRankAchv">{r.th}</span>
                </th>
              ))}
              <th>{UIString.projectedRating}</th>
            </tr>
          </thead>
          <tbody>
            {avgNewChartRating > 0 && (
              <tr>
                <th className="recLvFirstCol">{UIString.newCharts}</th>
                {newLvs.map((lv) => (
                  <td>{lv}</td>
                ))}
                <td>{Math.floor(avgNewChartRating)}↑</td>
              </tr>
            )}
            {avgOldChartRating > 0 && (
              <tr>
                <th className="recLvFirstCol">{UIString.oldCharts}</th>
                {oldLvs.map((lv) => (
                  <td>{lv}</td>
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
