import React from 'react';

import {getRankDefinitions} from '../rank-functions';

const MIN_RANK_OPTION = "A";
const RANK_FACTOR_CELL_BASE_CLASSNAME = "qlRankFactorCell";
const RANK_FACTOR_CELL_CLASSNAMES = ["qlRankTitleCell", "qlThresholdCell"];

function renderRankFactorRow(
  columnValues: ReadonlyArray<string>,
  rowClassnames: ReadonlyArray<string>,
  isHeading: boolean
) {
  return (
    <tr className={rowClassnames.join(" ")}>
      {columnValues.map((v, index) => {
        const useTh = isHeading || index === 0;
        let className = RANK_FACTOR_CELL_BASE_CLASSNAME;
        if (index < RANK_FACTOR_CELL_CLASSNAMES.length) {
          className += " " + RANK_FACTOR_CELL_CLASSNAMES[index];
        }
        return useTh ? <th className={className}>{v}</th> : <td className={className}>{v}</td>;
      })}
    </tr>
  );
}

interface Props {
  isDxPlus: boolean;
}

interface State {
  minRankOption: string;
}

export class MultiplierTable extends React.PureComponent<Props, State> {
  state: State = {minRankOption: MIN_RANK_OPTION};

  render() {
    const {isDxPlus} = this.props;
    const {minRankOption} = this.state;
    const rankDefs = getRankDefinitions(isDxPlus);
    const stopIndex = rankDefs.findIndex((r) => r.title === minRankOption) + 1;
    return (
      <div className="quickLookup">
        <h2 className="quickLookupHeading">Rank 係數表</h2>
        <table className="quickLookupTable">
          <thead>
            {renderRankFactorRow(
              ["Rank", "達成率", "係數", "倍率 (係數 × 達成率)"],
              [], // rowClassname
              true // isHeading
            )}
          </thead>
          <tbody>
            {rankDefs.slice(0, stopIndex).map((r, idx, arr) => {
              const minMultiplier = (r.th * r.factor) / 100;
              const maxMultiplier =
                idx > 0 ? ((arr[idx - 1].th - 0.0001) * r.factor) / 100 : minMultiplier;
              const minMulText = minMultiplier.toFixed(3);
              const maxMulText = maxMultiplier.toFixed(3);
              const multiplierRange =
                minMulText !== maxMulText ? `${minMulText} - ${maxMulText}` : minMulText;
              return renderRankFactorRow(
                [r.title, r.th.toString(), r.factor.toString(), multiplierRange],
                [],
                false
              );
            })}
          </tbody>
        </table>
        <hr className="sectionSep" />
      </div>
    );
  }
}
