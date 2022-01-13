import React from "react";
import {BREAK_BONUS_MULTIPLIER} from "../classic-layout/constants";
import {BreakScoreMap} from "../classic-layout/types";

function getClassNameByBreakScore(score: number) {
  return score > 2000
    ? "perfectJudgement"
    : score > 1000
    ? "greatJudgement"
    : score > 0
    ? "goodJudgement"
    : "missJudgement";
}

interface Props {
  dxAchv: string;
  breakDist: BreakScoreMap;
}

export class DxAchvDetails extends React.PureComponent<Props> {
  render() {
    const {dxAchv, breakDist} = this.props;
    return (
      <table className="dxAchvDetails">
        <thead>
          <tr>
            <th className="dxAchv" colSpan={8}>
              {dxAchv}%
            </th>
          </tr>
          <tr>
            {Array.from(BREAK_BONUS_MULTIPLIER.keys()).map((score, i) => (
              <th key={i} className={getClassNameByBreakScore(score)}>
                {score}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Array.from(BREAK_BONUS_MULTIPLIER.keys()).map((score, i) => (
              <td key={i} className={getClassNameByBreakScore(score)}>
                {breakDist.get(score)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }
}
