import React, {ReactNode} from 'react';

import {ColumnType} from '../types';

const SCORE_RECORD_ROW_CLASSNAME = 'scoreRecordRow';
const SCORE_RECORD_CELL_BASE_CLASSNAME = 'scoreRecordCell';
const ACHV_CELL_CLASSNAME = 'achievementCell';

const SCORE_RECORD_CELL_CLASSNAMES: Record<ColumnType, string> = {
  [ColumnType.NO]: 'orderCell',
  [ColumnType.SONG_TITLE]: 'songTitleCell',
  [ColumnType.CHART_TYPE]: 'chartTypeCell',
  [ColumnType.LEVEL]: 'levelCell',
  [ColumnType.ACHIEVEMENT]: ACHV_CELL_CLASSNAME,
  [ColumnType.RANK]: 'rankCell',
  [ColumnType.NEXT_RANK]: 'rankCell',
  [ColumnType.RATING]: 'ratingCell',
  [ColumnType.NEXT_RATING]: 'ratingCell',
};

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
          const columnClassName = SCORE_RECORD_CELL_CLASSNAMES[v];
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
