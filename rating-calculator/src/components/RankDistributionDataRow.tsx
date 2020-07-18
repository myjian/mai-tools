import React from 'react';

import {RankDistributionRow} from './RankDistributionRow';

interface Props {
  rowHead: string;
  rankDist: Map<string, number>;
  minRank: string;
  showTotal?: boolean;
  rowClassname?: string;
  baseCellClassname: string;
  perColumnClassnames: ReadonlyArray<string>;
}
export const RankDistributionDataRow: React.FC<Props> = React.memo((props: Props) => {
  const values: (string | number)[] = [props.rowHead];
  let totalCount = 0;
  for (const [rank, count] of props.rankDist) {
    values.push(count);
    totalCount += count;
    if (rank === props.minRank) {
      break;
    }
  }
  if (props.showTotal) {
    values.push(totalCount);
  }
  return (
    <RankDistributionRow
      values={values}
      showTotal={props.showTotal}
      rowClassname={props.rowClassname}
      baseCellClassname={props.baseCellClassname}
      perColumnClassnames={props.perColumnClassnames}
    />
  );
});
