import React from 'react';

import {DIFFICULTIES, DIFFICULTY_CLASSNAME_MAP} from '../../common/constants';
import {UIString} from '../i18n';
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
  return recordsPerDifficulty;
}

interface Props {
  chartRecords: ReadonlyArray<ChartRecord>;
  topChartsCount: number;
}

export class DifficultyDistribution extends React.PureComponent<Props> {
  render() {
    const {chartRecords, topChartsCount} = this.props;
    const topRecords = chartRecords.slice(0, topChartsCount);
    const recordsPerDiff = getRecordsPerDifficulty(topRecords);
    const keyMap = new Map<string, boolean>([[UIString.subtotal, true]]);
    return (
      <table className="rankDistributionTable">
        <thead>
          <RankDistributionHeadRow
            firstCell={UIString.difficulty}
            baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
            perColumnClassnames={[DIFF_RANK_TOP_LEFT_CELL_CLASSNAME]}
            columns={keyMap.keys()}
          />
        </thead>
        <tbody>
          {Array.from(recordsPerDiff.entries()).map(([d, records]) => {
            if (!records.length) {
              return;
            }
            const dist = new Map<string, number>([
              [UIString.subtotal, records.length],
            ]);
            return (
              <RankDistributionDataRow
                key={d}
                rowHead={d}
                columns={keyMap.keys()}
                rankDist={dist}
                rowClassname={DIFFICULTY_CLASSNAME_MAP.get(d)}
                baseCellClassname={DIFF_RANK_CELL_BASE_CLASSNAME}
                perColumnClassnames={[]}
              />
            );
          })}
        </tbody>
      </table>
    );
  }
}
