import React from 'react';

import {DxVersion} from '../../common/constants';
import {getGradeByIndex, getTopGradeBonus} from '../grade';
import {UIString} from '../i18n';

interface Props {
  gameVer: DxVersion;
  oldChartsRating: number;
  oldChartsMaxRating?: number;
  oldTopChartsCount: number;
  newChartsRating: number;
  newChartsMaxRating?: number;
  newTopChartsCount: number;
  playerGradeIndex: number;
}

interface State {
  forceDisplayRatingRatio?: boolean;
}

export class RatingOverview extends React.PureComponent<Props, State> {
  state: State = {};

  render() {
    const {
      gameVer,
      oldChartsRating,
      oldChartsMaxRating,
      oldTopChartsCount,
      newChartsRating,
      newChartsMaxRating,
      newTopChartsCount,
      playerGradeIndex,
    } = this.props;
    let totalRating = newChartsRating + oldChartsRating;
    const playerGrade = playerGradeIndex > 0 ? getGradeByIndex(playerGradeIndex) : null;
    if (playerGrade) {
      totalRating += playerGrade.bonus;
    }
    const topGradeBonus = getTopGradeBonus(gameVer);

    const {forceDisplayRatingRatio} = this.state;
    let displayRatingRatio = forceDisplayRatingRatio;
    if (forceDisplayRatingRatio !== false && oldChartsMaxRating && newChartsMaxRating) {
      displayRatingRatio =
        forceDisplayRatingRatio ||
        oldChartsMaxRating - oldChartsRating < 100 ||
        newChartsMaxRating - newChartsRating < 100;
    } else {
      displayRatingRatio = false;
    }

    if (displayRatingRatio && forceDisplayRatingRatio === undefined) {
      // Making the first click disable rating ratio rather than enable it.
      window.setTimeout(() => {
        this.setState({forceDisplayRatingRatio: true});
      }, 0);
    }

    return (
      <div className="ratingOverview">
        <div className="totalRatingRow" tabIndex={0} onClick={this.handleForceShowRatio}>
          Rating：{" "}
          <span>
            {displayRatingRatio
              ? `${totalRating} / ${newChartsMaxRating + oldChartsMaxRating + topGradeBonus}`
              : totalRating}
          </span>
        </div>
        <table className="ratingOverviewTable">
          <tbody>
            <tr>
              <td>{UIString.newChartsRating}</td>
              <td className="columnColumn">{UIString.column}</td>
              <td className="subRatingColumn">
                {displayRatingRatio
                  ? `${newChartsRating} / ${newChartsMaxRating}`
                  : newChartsRating}
              </td>
              <td className="avgRatingColumn">
                ({UIString.average}
                {UIString.column} {this.getAvg(newChartsRating, newTopChartsCount)})
              </td>
            </tr>
            <tr>
              <td>{UIString.oldChartsRating}</td>
              <td>{UIString.column}</td>
              <td className="subRatingColumn">
                {displayRatingRatio
                  ? `${oldChartsRating} / ${oldChartsMaxRating}`
                  : oldChartsRating}
              </td>
              <td className="avgRatingColumn">
                ({UIString.average}
                {UIString.column} {this.getAvg(oldChartsRating, oldTopChartsCount)})
              </td>
            </tr>
            {playerGrade && (
              <tr>
                <td>
                  {UIString.grade} (<span>{playerGrade.title}</span>)
                </td>
                <td>{UIString.column}</td>
                <td className="subRatingColumn">
                  {displayRatingRatio
                    ? `${playerGrade.bonus} / ${topGradeBonus}`
                    : playerGrade.bonus}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  private handleForceShowRatio = () => {
    this.setState(({forceDisplayRatingRatio}) => ({
      forceDisplayRatingRatio: !forceDisplayRatingRatio,
    }));
  };

  private getAvg(sum: number, count: number) {
    return count ? (sum / count).toFixed(0) : 0;
  }
}
