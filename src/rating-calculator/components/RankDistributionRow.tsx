import React from 'react';

interface Props {
  values: ReadonlyArray<string | number>;
  isHeading?: boolean;
  rowClassname?: string;
  baseCellClassname: string;
  perColumnClassnames: ReadonlyArray<string>;
}
export class RankDistributionRow extends React.PureComponent<Props> {
  render() {
    const {values, isHeading, rowClassname, baseCellClassname, perColumnClassnames} = this.props;
    return (
      <tr className={rowClassname}>
        {values.map((v, index) => {
          const useTh = isHeading || index === 0;
          let className = baseCellClassname;
          if (perColumnClassnames[index]) {
            className += " " + perColumnClassnames[index];
          }
          if (useTh) {
            return <th key={index} className={className}>{v}</th>;
          }
          return <td key={index} className={className}>{v}</td>;
        })}
      </tr>
    );
  }
}
