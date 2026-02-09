import {memo} from 'react';

import {ChartRecord} from '../../common/chart-record';
import {GameVersion} from '../../common/game-version';
import {getOfficialLevel} from '../../common/level-helper';
import {compareNumber} from '../../common/number-helper';
import {getRankDistribution, getRankMap} from '../rank-distribution';
import {RankDistributionDataRow} from './RankDistributionDataRow';
import {RankDistributionHeadRow} from './RankDistributionHeadRow';

const LEVEL_RANK_CELL_BASE_CLASSNAME = 'levelRankCell';
const LEVEL_RANK_CELL_CLASSNAMES = ['officialLevelCell'];

function getRecordsPerLevel(gameVer: GameVersion, records: ReadonlyArray<ChartRecord>) {
  const levels = records.map((r) => r.level);
  levels.sort(compareNumber);
  levels.reverse();
  const recordsPerLevel = new Map<string, ChartRecord[]>();
  for (const lv of levels) {
    const officialLv = getOfficialLevel(gameVer, lv);
    if (!recordsPerLevel.has(officialLv)) {
      recordsPerLevel.set(officialLv, []);
    }
  }
  for (const r of records) {
    recordsPerLevel.get(getOfficialLevel(gameVer, r.level)).push(r);
  }
  return recordsPerLevel;
}

interface Props {
  gameVer: GameVersion;
  topLeftCell: string;
  chartRecords: ReadonlyArray<ChartRecord>;
  topChartsCount: number;
}

export const LevelRankDistribution = memo(
  ({gameVer, chartRecords, topLeftCell, topChartsCount}: Props) => {
    const topRecords = chartRecords.slice(0, topChartsCount);
    const includeAllPerfect = gameVer >= GameVersion.CiRCLE;
    const rankMap = getRankMap(topRecords, includeAllPerfect);
    const recordsPerLevel = getRecordsPerLevel(gameVer, topRecords);
    return (
      <table className="rankDistributionTable">
        <thead>
          <RankDistributionHeadRow
            columns={rankMap.keys()}
            firstCell={topLeftCell}
            baseCellClassname={LEVEL_RANK_CELL_BASE_CLASSNAME}
            perColumnClassnames={LEVEL_RANK_CELL_CLASSNAMES}
          />
        </thead>
        <tbody>
          {Array.from(recordsPerLevel.entries()).map(([level, records]) => (
            <RankDistributionDataRow
              key={level}
              rowHead={level}
              columns={rankMap.keys()}
              rankDist={getRankDistribution(records, includeAllPerfect)}
              baseCellClassname={LEVEL_RANK_CELL_BASE_CLASSNAME}
              perColumnClassnames={LEVEL_RANK_CELL_CLASSNAMES}
            />
          ))}
        </tbody>
      </table>
    );
  },
);
