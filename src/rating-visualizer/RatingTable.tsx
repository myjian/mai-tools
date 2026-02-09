import {memo} from 'react';

import {LevelDef} from '../common/level-helper';
import {RankDef} from '../common/rank-functions';

export const enum DisplayValue {
  MIN = 'MIN',
  MAX = 'MAX',
  RANGE = 'RANGE',
}

interface Props {
  levels: ReadonlyArray<LevelDef>;
  ranks: ReadonlyArray<RankDef>;
  displayValue: DisplayValue;
}

export const RatingTable = memo(({displayValue, levels, ranks}: Props) => {
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
        {
          levels
            .map((lv, idx) => {
              return (
                <tr key={idx}>
                  <th>{lv.title}</th>
                  {ranks.map((r, idx) => {
                    const maxAchv = idx === 0 ? r.minAchv : ranks[idx - 1].minAchv - 0.0001;
                    const minRating = Math.floor(lv.minLv * r.minAchv * r.factor);
                    if (displayValue === DisplayValue.MIN) {
                      return <td key={idx}>{minRating}</td>;
                    }
                    const maxRating =
                      r.maxAchv && r.maxFactor
                        ? Math.floor(lv.maxLv * r.maxAchv * r.maxFactor)
                        : Math.floor(lv.maxLv * maxAchv * r.factor);
                    if (displayValue === DisplayValue.MAX) {
                      return <td key={idx}>{maxRating}</td>;
                    }
                    const text =
                      minRating === maxRating ? minRating : `${maxRating} - ${minRating}`;
                    return <td key={idx}>{text}</td>;
                  })}
                </tr>
              );
            })
            .reverse() // make highest level the first row
        }
      </tbody>
    </table>
  );
});
