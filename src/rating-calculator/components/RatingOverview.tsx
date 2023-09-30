import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {getGradeByIndex} from '../grade';
import {RatingData} from '../types';

const MessagesByLang = {
  [Language.en_US]: {
    analysisResult: 'Analysis Result',
    average: 'Avg',
    maximum: 'Max',
    minimum: 'Min',
    column: ':',
    date: 'Date',
    newChartsRating: 'New Charts Rating',
    oldChartsRating: 'Old Charts Rating',
    grade: 'Grade',
  },
  [Language.zh_TW]: {
    analysisResult: '分析結果',
    average: '平均',
    maximum: '最大',
    minimum: '最小',
    column: '：',
    date: '日期',
    newChartsRating: '新譜面 Rating',
    oldChartsRating: '舊譜面 Rating',
    grade: '段位',
  },
  [Language.ko_KR]: {
    analysisResult: '분석결과',
    average: '평균',
    maximum: '최대',
    minimum: '최소',
    column: '：',
    date: '날짜',
    newChartsRating: '신곡 레이팅',
    oldChartsRating: '구곡 레이팅',
    grade: '등급',
  },
};

interface Props {
  playerGradeIndex: number;
  fullNewChartsRating?: number;
  fullOldChartsRating?: number;
  ratingData: RatingData;
  totalRating: number;
}

export const RatingOverview = ({
  playerGradeIndex,
  fullNewChartsRating,
  fullOldChartsRating,
  ratingData,
  totalRating,
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
  const {newChartsRating, newTopChartsCount, oldChartsRating, oldTopChartsCount} = ratingData;
  const minNewChartRating =
    newTopChartsCount > 0
      ? Math.floor(ratingData.newChartRecords[newTopChartsCount - 1].rating)
      : 0;
  const minOldChartRating =
    oldTopChartsCount > 0
      ? Math.floor(ratingData.oldChartRecords[oldTopChartsCount - 1].rating)
      : 0;
  const maxNewChartRating =
    newTopChartsCount > 0 ? Math.floor(ratingData.newChartRecords[0].rating) : 0;
  const maxOldChartRating =
    oldTopChartsCount > 0 ? Math.floor(ratingData.oldChartRecords[0].rating) : 0;
  const playerGrade = playerGradeIndex > 0 ? getGradeByIndex(playerGradeIndex) : null;

  return (
    <div className="ratingOverview">
      <div>
        <span>
          {messages.date}
          {messages.column}{' '}
        </span>
        <span>{ratingData.date.toLocaleDateString()}</span>
      </div>
      <h2 id="outputHeading">{ratingData.playerName || messages.analysisResult}</h2>
      <div className="totalRatingRow">
        <span className="totalRating">
          Rating：{' '}
          {showMore
            ? `${totalRating} / ${getDenominatorText(fullNewChartsRating + fullOldChartsRating)}`
            : totalRating}
        </span>
        <button className="expandRatingOverview" onClick={toggleShowMore}>
          {showMore ? '－' : '＋'}
        </button>
      </div>
      <table className="ratingOverviewTable">
        <tbody>
          <tr>
            <td>{messages.newChartsRating}</td>
            <td className="columnColumn">{messages.column}</td>
            <td className="subRatingColumn">
              {showMore
                ? `${newChartsRating} / ${getDenominatorText(fullNewChartsRating)}`
                : newChartsRating}
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
              {showMore
                ? `${oldChartsRating} / ${getDenominatorText(fullOldChartsRating)}`
                : oldChartsRating}
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

function getDenominatorText(denom: number): string {
  return denom ? denom.toFixed(0) : '?';
}
