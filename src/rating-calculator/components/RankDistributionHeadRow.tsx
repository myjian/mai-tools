import React from 'react';

import {RankDistributionRow} from './RankDistributionRow';

interface Props {
  firstCell: string;
  baseCellClassname: string | undefined;
  perColumnClassnames: ReadonlyArray<string>;
  columns: Iterable<string>;
}

export const RankDistributionHeadRow = ({
  firstCell,
  columns,
  baseCellClassname,
  perColumnClassnames,
}: Props) => {
  const values = [firstCell];
  for (const key of columns) {
    values.push(key);
  }
  return (
    <RankDistributionRow
      values={values}
      isHeading
      baseCellClassname={baseCellClassname}
      perColumnClassnames={perColumnClassnames}
    />
  );
};
