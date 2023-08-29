import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {CommonMessages} from '../common-messages';
import {getGradeByIndex} from '../grade';
import {RatingData} from '../types';

const MessagesByLang = {
  [Language.en_US]: {
    average: 'Avg',
    maximum: 'Max',
    minimum: 'Min',
    column: ':',
    newChartsRating: 'New Charts Rating',
    oldChartsRating: 'Old Charts Rating',
    grade: 'Grade',
  },
  [Language.zh_TW]: {
    average: '平均',
    maximum: '最大',
    minimum: '最小',
    column: '：',
    newChartsRating: '新譜面 Rating',
    oldChartsRating: '舊譜面 Rating',
    grade: '段位',
  },
  [Language.ko_KR]: {
    average: '평균',
    maximum: '최대',
    minimum: '최소',
    column: '：',
    newChartsRating: '신곡 레이팅',
    oldChartsRating: '구곡 레이팅',
    grade: '등급',
  },
};

interface Props {
  fullNewChartsRating?: number;
  fullOldChartsRating?: number;
  ratingData: RatingData;
  playerGradeIndex: number;
}

export const RatingOverview = ({
  fullNewChartsRating,
  fullOldChartsRating,
  ratingData,
  playerGradeIndex,
}: Props) => {
  const [showMore, setShowMore] = useState<boolean>();

  const toggleShowMore = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setShowMore(!showMore);
    },
    [showMore]
  );

  const lang = useLanguage();
  const messages = MessagesByLang[lang];
  const commonMessages = CommonMessages[lang];
  const {newChartsRating, newTopChartsCount, oldChartsRating, oldTopChartsCount} = ratingData;
  const totalRating = newChartsRating + oldChartsRating;
  const minNewChartRating =
    newTopChartsCount > 0 ? ratingData.newChartRecords[newTopChartsCount - 1].rating.toFixed(0) : 0;
  const minOldChartRating =
    oldTopChartsCount > 0 ? ratingData.oldChartRecords[oldTopChartsCount - 1].rating.toFixed(0) : 0;
  const maxNewChartRating =
    newTopChartsCount > 0 ? ratingData.newChartRecords[0].rating.toFixed(0) : 0;
  const maxOldChartRating =
    oldTopChartsCount > 0 ? ratingData.oldChartRecords[0].rating.toFixed(0) : 0;
  const playerGrade = playerGradeIndex > 0 ? getGradeByIndex(playerGradeIndex) : null;

  return (
    <div className="ratingOverview">
      <div className="totalRatingRow">
        <span className="totalRating">
          Rating：{' '}
          {showMore ? `${totalRating} / ${fullNewChartsRating + fullOldChartsRating}` : totalRating}
        </span>
        <button onClick={toggleShowMore}>
          {showMore ? commonMessages.showLess : commonMessages.showMore}
        </button>
      </div>
      <table className="ratingOverviewTable">
        <tbody>
          <tr>
            <td>{messages.newChartsRating}</td>
            <td className="columnColumn">{messages.column}</td>
            <td className="subRatingColumn">
              {showMore ? `${newChartsRating} / ${fullNewChartsRating}` : newChartsRating}
            </td>
            <td className="avgRatingColumn">
              ({`${messages.average} ${getAvg(newChartsRating, newTopChartsCount)}`}
              {showMore
                ? ` ${messages.maximum} ${maxNewChartRating} ${messages.minimum} ${minNewChartRating}`
                : ''}
              )
            </td>
          </tr>
          <tr>
            <td>{messages.oldChartsRating}</td>
            <td>{messages.column}</td>
            <td className="subRatingColumn">
              {showMore ? `${oldChartsRating} / ${fullOldChartsRating}` : oldChartsRating}
            </td>
            <td className="avgRatingColumn">
              ({`${messages.average} ${getAvg(oldChartsRating, oldTopChartsCount)}`}
              {showMore
                ? ` ${messages.maximum} ${maxOldChartRating} ${messages.minimum} ${minOldChartRating}`
                : ''}
              )
            </td>
          </tr>
          {playerGrade && (
            <tr>
              <td>{messages.grade}</td>
              <td>{messages.column}</td>
              <td className="subRatingColumn" colSpan={2}>
                {playerGrade.title}
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
