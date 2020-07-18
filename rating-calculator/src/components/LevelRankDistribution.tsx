import React from 'react';

import {getOfficialLevel} from '../level-helper';
import {compareNumber} from '../number-helper';
import {
  getMinRank,
  getRankDistribution,
  mergeRecords,
  RatingTargetData,
} from '../rank-distribution';
import {ChartRecord} from '../types';
import {RankDistributionDataRow} from './RankDistributionDataRow';
import {RankDistributionHeadRow} from './RankDistributionHeadRow';

const LEVEL_RANK_CELL_BASE_CLASSNAME = "levelRankCell";
const LEVEL_RANK_CELL_CLASSNAMES = ["officialLevelCell"];

function getRecordsPerLevel(records: ReadonlyArray<ChartRecord>) {
  const levels = records.map((r) => r.level);
  levels.sort(compareNumber);
  levels.reverse();
  const recordsPerLevel = new Map<string, ChartRecord[]>();
  for (const lv of levels) {
    const officialLv = getOfficialLevel(lv);
    if (!recordsPerLevel.has(officialLv)) {
      recordsPerLevel.set(officialLv, []);
    }
  }
  for (const r of records) {
    recordsPerLevel.get(getOfficialLevel(r.level)).push(r);
  }
  return recordsPerLevel;
}

export class LevelRankDistribution extends React.PureComponent<RatingTargetData> {
  render() {
    const combinedTopRecords = mergeRecords(this.props);
    const minRank = getMinRank(combinedTopRecords);
    const recordsPerLevel = getRecordsPerLevel(combinedTopRecords);
    return (
      <table className="rankDistributionTable">
        <thead>
          <RankDistributionHeadRow
            minRank={minRank}
            baseCellClassname={LEVEL_RANK_CELL_BASE_CLASSNAME}
            perColumnClassnames={LEVEL_RANK_CELL_CLASSNAMES}
          />
        </thead>
        <tbody>
          {Array.from(recordsPerLevel.entries()).map(([level, records]) => (
            <RankDistributionDataRow
              key={level}
              rowHead={level}
              minRank={minRank}
              rankDist={getRankDistribution(records)}
              baseCellClassname={LEVEL_RANK_CELL_BASE_CLASSNAME}
              perColumnClassnames={LEVEL_RANK_CELL_CLASSNAMES}
            />
          ))}
        </tbody>
      </table>
    );
  }
}
