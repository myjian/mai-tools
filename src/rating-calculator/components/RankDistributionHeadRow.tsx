import React from 'react';

import {UIString} from '../i18n';
import {RankDistributionRow} from './RankDistributionRow';

interface Props {
  firstCell: string;
  showTotal?: boolean;
  baseCellClassname: string | undefined;
  perColumnClassnames: ReadonlyArray<string>;
  columns: IterableIterator<string>
}
export class RankDistributionHeadRow extends React.PureComponent<Props> {
  render() {
    const {firstCell, columns, showTotal, baseCellClassname, perColumnClassnames} = this.props;
    const values = [firstCell];
    for (const key of columns) {
      values.push(key);
    }
    if (showTotal) {
      values.push(UIString.subtotal);
    }
    return (
      <RankDistributionRow
        values={values}
        isHeading
        showTotal={showTotal}
        baseCellClassname={baseCellClassname}
        perColumnClassnames={perColumnClassnames}
      />
    );
  }
}
