import React from 'react';

const SCORE_RECORD_ROW_CLASSNAME = "scoreRecordRow";
const SCORE_RECORD_CELL_BASE_CLASSNAME = "scoreRecordCell";
const ACHV_CELL_CLASSNAME = "achievementCell";
const SCORE_RECORD_CELL_CLASSNAMES = [
  "orderCell",
  "songTitleCell",
  "difficultyCell",
  "innerLvCell",
  ACHV_CELL_CLASSNAME,
  "rankFactorCell",
  "ratingCell",
];

interface Props {
  className?: string;
  columnValues: ReadonlyArray<React.ReactText>;
  isHeading?: boolean;
  onClickCell?: (index: number) => void;
}
export class ScoreRow extends React.PureComponent<Props> {
  render() {
    const {columnValues, isHeading, onClickCell} = this.props;
    let className = SCORE_RECORD_ROW_CLASSNAME;
    if (this.props.className) {
      className += " " + this.props.className;
    }
    return (
      <tr className={className}>
        {columnValues.map((v, index) => {
          const columnClassName = SCORE_RECORD_CELL_CLASSNAMES[index];
          let className = SCORE_RECORD_CELL_BASE_CLASSNAME + " " + columnClassName;
          const children = this.getChildren(v);
          const clickProps = onClickCell ? {tabIndex: 0, onClick: () => onClickCell(index)} : {};
          if (isHeading) {
            return <th className={className} {...clickProps}>{children}</th>;
          }
          return <td className={className} {...clickProps}>{children}</td>;
        })}
      </tr>
    );
  }

  private getChildren = (value: React.ReactText) => {
    if (typeof value === "string" && value.includes("\n")) {
      return value.split("\n").map((v) => <div>{v}</div>);
    }
    return value;
  };
}
