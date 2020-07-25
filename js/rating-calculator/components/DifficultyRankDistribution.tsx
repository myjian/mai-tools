import React from 'react';

import {
  getMinRank,
  getRankDistribution,
  mergeRecords,
  RatingTargetData,
} from '../rank-distribution';
import {DIFFICULTIES, DIFFICULTY_CLASSNAME_MAP} from '../shared-constants';
import {ChartRecord} from '../types';
import {RankDistributionDataRow} from './RankDistributionDataRow';
import {RankDistributionHeadRow} from './RankDistributionHeadRow';

const DIFF_RANK_CELL_BASE_CLASSNAME = "diffRankCell";
const DIFF_RANK_TOP_LEFT_CELL_CLASSNAME = "difficultyRankDistHead";

function getRecordsPerDifficulty(records: ReadonlyArray<ChartRecord>) {
  const recordsPerDifficulty = new Map<string, ChartRecord[]>();
  for (let i = DIFFICULTIES.length - 1; i >= 0; i--) {
    recordsPerDifficulty.set(DIFFICULTIES[i], []);
  }
  for (const r of records) {
    recordsPerDifficulty.get(r.difficulty).push(r);
  }
  for (let i = DIFFICULTIES.length - 1; i >= 0; i--) {
    if (!recordsPerDifficulty.get(DIFFICULTIES[i]).length) {
      recordsPerDifficulty.delete(DIFFICULTIES[i]);
    }
  }
  return recordsPerDifficulty;
}

export class DifficultyRankDistribution extends React.PureComponent<RatingTargetData> {
  render() {
    const combinedTopRecords = mergeRecords(this.props);
    const minRank = getMinRank(combinedTopRecords);
    const recordsPerDifficulty = getRecordsPerDifficulty(combinedTopRecords);
    return (
      <table className="rankDistributionTable">
        <thead>
          <RankDistributionHeadRow
            minRank={minRank}
            baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
            perColumnClassnames={[DIFF_RANK_TOP_LEFT_CELL_CLASSNAME]}
            showTotal
          />
        </thead>
        <tbody>
          {Array.from(recordsPerDifficulty.entries()).map(([d, records]) => (
            <RankDistributionDataRow
              key={d}
              rowHead={d}
              minRank={minRank}
              showTotal
              rankDist={getRankDistribution(records)}
              rowClassname={DIFFICULTY_CLASSNAME_MAP.get(d)}
              baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
              perColumnClassnames={[]}
            />
          ))}
        </tbody>
      </table>
    );
  }
}
