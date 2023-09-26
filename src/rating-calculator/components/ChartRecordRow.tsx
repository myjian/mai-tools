import React from 'react';

import {RATING_TARGET_SONG_NAME_PREFIX} from '../../common/song-name-helper';
import {getZhWikiLink} from '../../common/wiki-link';

const SCORE_RECORD_ROW_CLASSNAME = 'scoreRecordRow';
const SCORE_RECORD_COMPACT_ROW_CLASSNAME = 'scoreRecordCompactRow';
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
];

interface Props {
  className?: string;
  columnValues: ReadonlyArray<string | number>;
  compactMode?: boolean;
  isHeading?: boolean;
  onClickCell?: (index: number) => void;
}
export class ChartRecordRow extends React.PureComponent<Props> {
  render() {
    const {columnValues, isHeading, onClickCell} = this.props;
    let className = SCORE_RECORD_ROW_CLASSNAME;
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    if (this.props.compactMode) {
      className += ' ' + SCORE_RECORD_COMPACT_ROW_CLASSNAME;
    }
    return (
      <tr className={className}>
        {columnValues.map((v, index) => {
          const columnClassName = SCORE_RECORD_CELL_CLASSNAMES[index];
          let className = SCORE_RECORD_CELL_BASE_CLASSNAME + ' ' + columnClassName;
          const children = this.getChildren(v, index, isHeading);
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

  private getChildren = (
    value: string | number,
    colIdx: number,
    isHeading: boolean
  ): React.ReactNode => {
    if (!isHeading && colIdx === 1) {
      let songName = value as string;
      const startIndex = songName.startsWith(RATING_TARGET_SONG_NAME_PREFIX)
        ? RATING_TARGET_SONG_NAME_PREFIX.length
        : 0;
      songName = songName.substring(startIndex);
      return (
        <a className="songWikiLink" href={getZhWikiLink(songName)} target="_blank">
          {value}
        </a>
      );
    }
    if (typeof value === 'string' && value.includes('\n')) {
      return value.split('\n').map((v, idx) => <div key={idx}>{v}</div>);
    }
    return value;
  };
}
