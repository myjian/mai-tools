import React from 'react';

import {RankDef} from '../common/rank-functions';
import {LevelDef} from './levels';

const MIN_RANK_TITLE = "AAA";

interface Props {
  levels: ReadonlyArray<LevelDef>;
  ranks: ReadonlyArray<RankDef>;
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
            {ranks.map((r, idx) => (
              <th key={idx}>{r.title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="lookupTableBody">
          {levels.map((lv, idx) => {
            return (
              <tr key={idx}>
                <th>{lv.title}</th>
                {ranks.map((r, idx) => {
                  const maxAchv = idx === 0 ? r.minAchv : ranks[idx - 1].minAchv - 0.0001;
                  const minRating = Math.floor(lv.minLv * r.minAchv * r.factor * 0.01);
                  const maxRating = Math.floor(lv.maxLv * maxAchv * r.factor * 0.01);
                  const text = minRating === maxRating ? minRating : `${maxRating} - ${minRating}`;
                  return <td key={idx}>{text}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
