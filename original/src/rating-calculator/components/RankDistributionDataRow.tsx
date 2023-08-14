import React from 'react';

import {RankDistributionRow} from './RankDistributionRow';

interface Props {
  rowHead: string;
  columns: Iterable<string>;
  rankDist: Map<string, number>;
  rowClassname?: string;
  baseCellClassname: string;
  perColumnClassnames: ReadonlyArray<string>;
}

export const RankDistributionDataRow = React.memo((props: Props) => {
  const values: (string | number)[] = [props.rowHead];
  for (const key of props.columns) {
    const count = props.rankDist.get(key);
    values.push(count || '-');
  }
  return (
    <RankDistributionRow
      values={values}
      rowClassname={props.rowClassname}
      baseCellClassname={props.baseCellClassname}
      perColumnClassnames={props.perColumnClassnames}
    />
  );
});
