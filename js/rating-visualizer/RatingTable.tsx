import React from 'react';

import {LevelDef, RankRangeDef} from './types';

const MIN_RANK_TITLE = "AAA";

interface Props {
  levels: ReadonlyArray<LevelDef>;
  ranks: ReadonlyArray<RankRangeDef>;
}

export class RatingTable extends React.PureComponent<Props> {
  render() {
    const {levels} = this.props;
    let {ranks} = this.props;
    const rankLastIdx = ranks.findIndex((r) => r.title === MIN_RANK_TITLE);
    ranks = ranks.slice(0, rankLastIdx + 1);
    return (
      <table className="lookupTable">
        <thead className="lookupTableHead">
          <tr>
            <th className="lookupTopLeftCell"></th>
            {ranks.map((r) => (
              <th>{r.title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="lookupTableBody">
          {levels.map((lv) => {
            return (
              <tr>
                <th>{lv.title}</th>
                {ranks.map((r) => {
                  const minRating = Math.floor(lv.minLv * r.minAchv * r.rankFactor * 0.01);
                  const maxRating = Math.floor(lv.maxLv * r.maxAchv * r.rankFactor * 0.01);
                  const text = minRating === maxRating ? minRating : `${minRating} - ${maxRating}`;
                  return <td>{text}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
