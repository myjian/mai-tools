import React from 'react';

import {UIString} from '../i18n';
import {getRankDefinitions} from '../rank-functions';
import {RankDistributionRow} from './RankDistributionRow';

interface Props {
  minRank: string;
  showTotal?: boolean;
  baseCellClassname: string | undefined;
  perColumnClassnames: ReadonlyArray<string>;
}
export class RankDistributionHeadRow extends React.PureComponent<Props> {
  render() {
    const {minRank, showTotal, baseCellClassname, perColumnClassnames} = this.props;
    const values = [""];
    for (const rankDef of getRankDefinitions(true)) {
      values.push(rankDef.title);
      if (rankDef.title === minRank) {
        break;
      }
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
