import React, {useCallback, useState} from 'react';

import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';
import {getRankDefinitions} from '../common/rank-functions';
import {getRating} from '../common/rating-functions';
import {CommonMessages} from '../rating-calculator/common-messages';

const MIN_RANK_OPTION = 'A';
const RANK_FACTOR_CELL_BASE_CLASSNAME = 'qlRankFactorCell';
const RANK_FACTOR_CELL_CLASSNAMES = ['qlRankTitleCell', 'qlThresholdCell'];

const MessagesByLang = {
  [Language.en_US]: {
    calculator: 'Calculator',
    rank: 'Rank',
    achievement: 'Achievement',
    factor: 'Factor',
  },
  [Language.zh_TW]: {
    calculator: '計算機',
    rank: 'Rank',
    achievement: '達成率',
    factor: '係數',
  },
  [Language.ko_KR]: {
    calculator: '계산기',
    rank: '등급',
    achievement: '정확도',
    factor: '배수',
  },
};

interface RankFactorRowProps {
  values: ReadonlyArray<string | number>;
  isHeading?: boolean;
}
const RankFactorRow = (props: RankFactorRowProps) => {
  const {isHeading} = props;
  return (
    <tr>
      {props.values.map((v, index) => {
        const useTh = isHeading || index === 0;
        let className = RANK_FACTOR_CELL_BASE_CLASSNAME;
        if (index < RANK_FACTOR_CELL_CLASSNAMES.length) {
          className += ' ' + RANK_FACTOR_CELL_CLASSNAMES[index];
        }
        return useTh ? (
          <th key={index} className={className}>
            {v}
          </th>
        ) : (
          <td key={index} className={className}>
            {v}
          </td>
        );
      })}
    </tr>
  );
};

export const MultiplierTable = () => {
  const rankDefs = getRankDefinitions();
  const stopIndex = rankDefs.findIndex((r) => r.title === MIN_RANK_OPTION) + 1;
  const lang = useLanguage();
  const messages = MessagesByLang[lang];
  const commonMessages = CommonMessages[lang];

  const [level, setLevel] = useState(13);
  const [achv, setAchv] = useState(100);
  const handleLevelChange = useCallback((evt: React.SyntheticEvent<HTMLInputElement>) => {
    const value = parseFloat(evt.currentTarget.value);
    if (!isNaN(value)) {
      setLevel(value);
    }
  }, []);
  const handleAchvChange = useCallback((evt: React.SyntheticEvent<HTMLInputElement>) => {
    const value = parseFloat(evt.currentTarget.value);
    if (!isNaN(value)) {
      setAchv(value);
    }
  }, []);
  const rating = getRating(level, achv);

  return (
    <div className="quickLookup">
      <h2 className="quickLookupHeading">{messages.calculator}</h2>
      <table className="calculatorTable">
        <thead>
          <tr>
            <th>{commonMessages.level}</th>
            <th>{messages.achievement}</th>
            <th>{commonMessages.rating}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input name="level" onChange={handleLevelChange} defaultValue={level}></input>
            </td>
            <td>
              <input name="achv" onChange={handleAchvChange} defaultValue={achv}></input>
            </td>
            <td>{Math.floor(rating)}</td>
          </tr>
        </tbody>
      </table>
      <table className="lookupTable">
        <thead className="lookupTableHead">
          <RankFactorRow
            values={[
              messages.rank,
              messages.achievement,
              messages.factor,
              `${commonMessages.rating} - ${level}`,
            ]}
            isHeading
          />
        </thead>
        <tbody>
          {rankDefs.slice(0, stopIndex).map((r, idx) => (
            <RankFactorRow
              key={idx}
              values={[r.title, r.minAchv, r.factor, Math.floor(getRating(level, r.minAchv))]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
