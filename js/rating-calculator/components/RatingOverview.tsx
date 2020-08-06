import React from 'react';

import {getGradeByIndex} from '../grade';
import {UIString} from '../i18n';

interface Props {
  oldChartsRating: number;
  oldTopChartsCount: number;
  newChartsRating: number;
  newTopChartsCount: number;
  playerGradeIndex: number;
  isDxPlus: boolean;
}

export class RatingOverview extends React.PureComponent<Props> {
  render() {
    const {oldChartsRating, oldTopChartsCount, newChartsRating, newTopChartsCount, playerGradeIndex, isDxPlus} = this.props;
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
              <td className="subRatingColumn">{newChartsRating}</td>
              <td className="avgRatingColumn">({UIString.average}{UIString.column} {(newChartsRating/newTopChartsCount).toFixed(0)})</td>
            </tr>
            <tr>
              <td>{UIString.oldChartsRating}</td>
              <td>{UIString.column}</td>
              <td className="subRatingColumn">{oldChartsRating}</td>
              <td className="avgRatingColumn">({UIString.average}{UIString.column} {(oldChartsRating/oldTopChartsCount).toFixed(0)})</td>
            </tr>
            {playerGrade && (
              <tr>
                <td>
                  {UIString.grade} (<span>{playerGrade.title}</span>)
                </td>
                <td>{UIString.column}</td>
                <td className="subRatingColumn">{playerGrade.bonus}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
