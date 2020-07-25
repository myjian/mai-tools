import React from 'react';

import {getGradeByIndex} from '../grade';
import {UIString} from '../i18n';

interface Props {
  oldChartsRating: number;
  newChartsRating: number;
  playerGradeIndex: number;
  isDxPlus: boolean;
}

export class RatingOverview extends React.PureComponent<Props> {
  render() {
    const {oldChartsRating, newChartsRating, playerGradeIndex, isDxPlus} = this.props;
    let totalRating = newChartsRating + oldChartsRating;
    const playerGrade = playerGradeIndex > 0 ? getGradeByIndex(playerGradeIndex, isDxPlus) : null;
    if (playerGrade) {
      totalRating += playerGrade.bonus;
    }
    return (
      <div className="ratingOverview">
        <div className="totalRatingRow">
          Rating： <span>{totalRating}</span>
        </div>
        <table className="ratingOverviewTable">
          <tbody>
            <tr>
              <td>{UIString.newChartsRating}</td>
              <td className="columnColumn">{UIString.column}</td>
              <td>{newChartsRating}</td>
            </tr>
            <tr>
              <td>{UIString.oldChartsRating}</td>
              <td>{UIString.column}</td>
              <td>{oldChartsRating}</td>
            </tr>
            {playerGrade && (
              <tr>
                <td>
                  {UIString.grade} (<span>{playerGrade.title}</span>)
                </td>
                <td>{UIString.column}</td>
                <td>{playerGrade.bonus}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
