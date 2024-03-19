import React, {ReactNode} from 'react';

import {ColumnType} from '../types';

const SCORE_RECORD_ROW_CLASSNAME = 'scoreRecordRow';
const SCORE_RECORD_CELL_BASE_CLASSNAME = 'scoreRecordCell';
const ACHV_CELL_CLASSNAME = 'achievementCell';
const SCORE_RECORD_CELL_CLASSNAMES = [
  'orderCell',
  'songTitleCell',
  'chartTypeCell',
  'levelCell',
  ACHV_CELL_CLASSNAME,
  'rankCell',
  'ratingCell',
  'newRatingCell',
];

interface Props {
  className?: string;
  columns: ReadonlyArray<ColumnType>;
  renderCell: (col: ColumnType) => ReactNode;
  isHeading?: boolean;
  onClickCell?: (index: number) => void;
}
export class ChartRecordRow extends React.PureComponent<Props> {
  render() {
    const {columns, isHeading, renderCell, onClickCell} = this.props;
    let className = SCORE_RECORD_ROW_CLASSNAME;
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <tr className={className}>
        {columns.map((v, index) => {
          const columnClassName = SCORE_RECORD_CELL_CLASSNAMES[index];
          let className = SCORE_RECORD_CELL_BASE_CLASSNAME + ' ' + columnClassName;
          const children = renderCell(v);
          const clickProps = onClickCell
            ? {
                tabIndex: 0,
                onClick: () => onClickCell(index),
                onKeyDown: (evt: React.KeyboardEvent) => {
                  if (evt.key === 'Enter') {
                    onClickCell(index);
                  }
                },
              }
            : {};
          if (isHeading) {
            return (
              <th key={index} className={className} {...clickProps}>
                {children}
              </th>
            );
          }
          return (
            <td key={index} className={className} {...clickProps}>
              {children}
            </td>
          );
        })}
      </tr>
    );
  }
}
