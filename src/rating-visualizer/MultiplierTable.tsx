import React from 'react';

import {DxVersion} from '../common/constants';
import {LANG} from '../common/lang';
import {getRankDefinitions} from '../common/rank-functions';

const MIN_RANK_OPTION = "A";
const RANK_FACTOR_CELL_BASE_CLASSNAME = "qlRankFactorCell";
const RANK_FACTOR_CELL_CLASSNAMES = ["qlRankTitleCell", "qlThresholdCell"];

const UIString = {
  en: {
    rankFactorTable: "Rank Factor Table",
    rank: "Rank",
    achievement: "Achievement",
    factor: "Factor",
    multiplier: "Multiplier (Factor × Achievement)",
  },
  zh: {
    rankFactorTable: "Rank 係數表",
    rank: "Rank",
    achievement: "達成率",
    factor: "係數",
    multiplier: "倍率 (係數 × 達成率)",
  },
}[LANG];

interface RankFactorRowProps {
  values: ReadonlyArray<string | number>;
  isHeading?: boolean;
}
const RankFactorRow: React.FC<RankFactorRowProps> = (props) => {
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

interface State {
  minRankOption: string;
}

export class MultiplierTable extends React.PureComponent<Props, State> {
  state: State = {minRankOption: MIN_RANK_OPTION};

  render() {
    const {gameVer} = this.props;
    const {minRankOption} = this.state;
    const rankDefs = getRankDefinitions(gameVer);
    const stopIndex = rankDefs.findIndex((r) => r.title === minRankOption) + 1;
    return (
      <div className="quickLookup">
        <h2 className="quickLookupHeading">{UIString.rankFactorTable}</h2>
        <table className="lookupTable">
          <thead className="lookupTableHead">
            <RankFactorRow
              values={[UIString.rank, UIString.achievement, UIString.factor, UIString.multiplier]}
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
  }
}
