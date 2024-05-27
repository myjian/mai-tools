import React from 'react';

import {ChartRecord} from '../../common/chart-record';
import {ChartType, getChartTypeName} from '../../common/chart-type';
import {
  DIFFICULTIES,
  Difficulty,
  getDifficultyClassName,
  getDifficultyName,
} from '../../common/difficulties';
import {useLanguage} from '../../common/lang-react';
import {CommonMessages} from '../common-messages';
import {RankDistributionDataRow} from './RankDistributionDataRow';
import {RankDistributionHeadRow} from './RankDistributionHeadRow';

const DIFF_RANK_CELL_BASE_CLASSNAME = 'diffRankCell';
const DIFF_RANK_TOP_LEFT_CELL_CLASSNAME = 'difficultyRankDistHead';

function getRecordsPerDifficulty(records: ReadonlyArray<ChartRecord>) {
  const recordsPerDifficulty = new Map<Difficulty, Record<ChartType, number>>();
  for (let i = DIFFICULTIES.length - 1; i >= 0; i--) {
    recordsPerDifficulty.set(DIFFICULTIES[i], {[ChartType.DX]: 0, [ChartType.STANDARD]: 0});
  }
  for (const r of records) {
    recordsPerDifficulty.get(r.difficulty)[r.chartType] += 1;
  }
  return recordsPerDifficulty;
}

interface Props {
  chartRecords: ReadonlyArray<ChartRecord>;
  topChartsCount: number;
}

export const DifficultyDistribution = ({chartRecords, topChartsCount}: Props) => {
  const lang = useLanguage();
  const topRecords = chartRecords.slice(0, topChartsCount);
  const hasChartType = topRecords.reduce(
    (has, r) => {
      has[r.chartType] = true;
      return has;
    },
    {[ChartType.STANDARD]: false, [ChartType.DX]: false}
  );
  const chartTypeNames = [ChartType.DX, ChartType.STANDARD]
    .filter((chartType) => hasChartType[chartType])
    .map(getChartTypeName);
  const recordsPerDiff = getRecordsPerDifficulty(topRecords);
  return (
    <table className="rankDistributionTable">
      <thead>
        <RankDistributionHeadRow
          firstCell={CommonMessages[lang].difficulty}
          baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
          perColumnClassnames={[DIFF_RANK_TOP_LEFT_CELL_CLASSNAME]}
          columns={chartTypeNames}
        />
      </thead>
      <tbody>
        {Array.from(recordsPerDiff.entries())
          .filter(
            ([_, countByChartType]) =>
              countByChartType[ChartType.DX] + countByChartType[ChartType.STANDARD] > 0
          )
          .map(([d, countByChartType]) => {
            const dist = new Map([
              [getChartTypeName(ChartType.STANDARD), countByChartType[ChartType.STANDARD]],
              [getChartTypeName(ChartType.DX), countByChartType[ChartType.DX]],
            ]);
            return (
              <RankDistributionDataRow
                key={d}
                rowHead={getDifficultyName(d)}
                columns={chartTypeNames}
                rankDist={dist}
                baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
                perColumnClassnames={[getDifficultyClassName(d)]}
              />
            );
          })}
      </tbody>
    </table>
  );
};
