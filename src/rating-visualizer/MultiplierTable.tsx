import React from 'react';

import {DxVersion} from '../common/game-version';
import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';
import {getRankDefinitions} from '../common/rank-functions';

const MIN_RANK_OPTION = "A";
const RANK_FACTOR_CELL_BASE_CLASSNAME = "qlRankFactorCell";
const RANK_FACTOR_CELL_CLASSNAMES = ["qlRankTitleCell", "qlThresholdCell"];

const MessagesByLang = {
  [Language.en_US]: {
    rankFactorTable: "Rank Factor Table",
    rank: "Rank",
    achievement: "Achievement",
    factor: "Factor",
    multiplier: "Multiplier (Factor × Achievement)",
  },
  [Language.zh_TW]: {
    rankFactorTable: "Rank 係數表",
    rank: "Rank",
    achievement: "達成率",
    factor: "係數",
    multiplier: "倍率 (係數 × 達成率)",
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
          className += " " + RANK_FACTOR_CELL_CLASSNAMES[index];
        }
        return useTh ? <th className={className}>{v}</th> : <td className={className}>{v}</td>;
      })}
    </tr>
  );
};

interface Props {
  gameVer: DxVersion;
}

export const MultiplierTable = ({gameVer}: Props) => {
  const rankDefs = getRankDefinitions(gameVer);
  const stopIndex = rankDefs.findIndex((r) => r.title === MIN_RANK_OPTION) + 1;
  const messages = MessagesByLang[useLanguage()];
  return (
    <div className="quickLookup">
      <h2 className="quickLookupHeading">{messages.rankFactorTable}</h2>
      <table className="lookupTable">
        <thead className="lookupTableHead">
          <RankFactorRow
            values={[messages.rank, messages.achievement, messages.factor, messages.multiplier]}
            isHeading
          />
        </thead>
        <tbody>
          {rankDefs.slice(0, stopIndex).map((r, idx, arr) => {
            const minMultiplier = (r.minAchv * r.factor) / 100;
            const maxMultiplier =
              idx > 0 ? ((arr[idx - 1].minAchv - 0.0001) * r.factor) / 100 : minMultiplier;
            const minMulText = minMultiplier.toFixed(3);
            const maxMulText = maxMultiplier.toFixed(3);
            const multiplierRange =
              minMulText !== maxMulText ? `${minMulText} - ${maxMulText}` : minMulText;
            return <RankFactorRow values={[r.title, r.minAchv, r.factor, multiplierRange]} />;
          })}
        </tbody>
      </table>
    </div>
  );
};
