import React from 'react';

const LAST_CELL_CLASSNAME = "totalCell";

interface Props {
  values: ReadonlyArray<string|number>;
  isHeading?: boolean;
  showTotal?: boolean;
  rowClassname?: string;
  baseCellClassname: string;
  perColumnClassnames: ReadonlyArray<string>;
}
export class RankDistributionRow extends React.PureComponent<Props> {
  render() {
    const {
      values,
      isHeading,
      showTotal,
      rowClassname,
      baseCellClassname,
      perColumnClassnames,
    } = this.props;
    return (
      <tr className={rowClassname}>
        {values.map((v, index) => {
          const useTh = isHeading || index === 0;
          let className = baseCellClassname;
          if (index < perColumnClassnames.length) {
            className += " " + perColumnClassnames[index];
          }
          if (showTotal && index === values.length - 1) {
            className += " " + LAST_CELL_CLASSNAME;
          }
          if (useTh) {
            return <th className={className}>{v}</th>;
          }
          return <td className={className}>{v}</td>;
        })}
      </tr>
    );
  }
}
