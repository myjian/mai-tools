import React from 'react';

import {ChartRecord} from '../../common/chart-record';
import {ChartType, getChartTypeName} from '../../common/chart-type';
import {
  DIFFICULTIES,
  Difficulty,
  DIFFICULTY_CLASSNAME_MAP,
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
  const recordsPerDiff = getRecordsPerDifficulty(topRecords);
  const keyMap = new Map<string, boolean>([[CommonMessages[lang].subtotal, true]]);
  const rows: JSX.Element[] = [];
  recordsPerDiff.forEach((countByChartType, d) => {
    for (const chartType of [ChartType.DX, ChartType.STANDARD]) {
      if (!countByChartType[chartType]) continue;
      const dist = new Map([[CommonMessages[lang].subtotal, countByChartType[chartType]]]);
      rows.push(
        <RankDistributionDataRow
          key={'' + d + chartType}
          rowHead={`${getDifficultyName(d)} (${getChartTypeName(chartType)})`}
          columns={keyMap.keys()}
          rankDist={dist}
          rowClassname={DIFFICULTY_CLASSNAME_MAP.get(d)}
          baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
          perColumnClassnames={[]}
        />
      );
    }
  });
  return (
    <table className="rankDistributionTable">
      <thead>
        <RankDistributionHeadRow
          firstCell={CommonMessages[lang].difficulty}
          baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
          perColumnClassnames={[DIFF_RANK_TOP_LEFT_CELL_CLASSNAME]}
          columns={keyMap.keys()}
        />
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
