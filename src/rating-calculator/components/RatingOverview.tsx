import React, {useCallback, useState} from 'react';

import {DxVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {getGradeByIndex, getTopGradeBonus} from '../grade';

const MessagesByLang = {
  [Language.en_US]: {
    average: "Average",
    column: ":",
    newChartsRating: "New Charts Rating",
    oldChartsRating: "Old Charts Rating",
    grade: "Grade",
  },
  [Language.zh_TW]: {
    average: "平均",
    column: "：",
    newChartsRating: "新譜面 Rating",
    oldChartsRating: "舊譜面 Rating",
    grade: "段位",
  },
};

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

export const RatingOverview = ({
  gameVer,
  oldChartsRating,
  oldChartsMaxRating,
  oldTopChartsCount,
  newChartsRating,
  newChartsMaxRating,
  newTopChartsCount,
  playerGradeIndex,
}: Props) => {
  const [showRatingRatio, setShowRatingRatio] = useState<boolean>();

  const toggleRatingRatio = useCallback(() => {
    setShowRatingRatio(!showRatingRatio);
  }, [showRatingRatio]);

  const messages = MessagesByLang[useLanguage()];
  let totalRating = newChartsRating + oldChartsRating;
  const playerGrade = playerGradeIndex > 0 ? getGradeByIndex(playerGradeIndex) : null;
  if (playerGrade) {
    totalRating += playerGrade.bonus;
  }
  const topGradeBonus = getTopGradeBonus(gameVer);

  return (
    <div className="ratingOverview">
      <div className="totalRatingRow" tabIndex={0} onClick={toggleRatingRatio}>
        Rating：{" "}
        <span>
          {showRatingRatio
            ? `${totalRating} / ${newChartsMaxRating + oldChartsMaxRating + topGradeBonus}`
            : totalRating}
        </span>
      </div>
      <table className="ratingOverviewTable">
        <tbody>
          <tr>
            <td>{messages.newChartsRating}</td>
            <td className="columnColumn">{messages.column}</td>
            <td className="subRatingColumn">
              {showRatingRatio ? `${newChartsRating} / ${newChartsMaxRating}` : newChartsRating}
            </td>
            <td className="avgRatingColumn">
              ({messages.average}
              {messages.column} {getAvg(newChartsRating, newTopChartsCount)})
            </td>
          </tr>
          <tr>
            <td>{messages.oldChartsRating}</td>
            <td>{messages.column}</td>
            <td className="subRatingColumn">
              {showRatingRatio ? `${oldChartsRating} / ${oldChartsMaxRating}` : oldChartsRating}
            </td>
            <td className="avgRatingColumn">
              ({messages.average}
              {messages.column} {getAvg(oldChartsRating, oldTopChartsCount)})
            </td>
          </tr>
          {playerGrade && (
            <tr>
              <td>
                {messages.grade} (<span>{playerGrade.title}</span>)
              </td>
              <td>{messages.column}</td>
              <td className="subRatingColumn">
                {showRatingRatio ? `${playerGrade.bonus} / ${topGradeBonus}` : playerGrade.bonus}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

function getAvg(sum: number, count: number) {
  return count ? (sum / count).toFixed(0) : 0;
}
