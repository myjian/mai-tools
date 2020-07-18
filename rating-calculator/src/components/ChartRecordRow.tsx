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
  columnValues: ReadonlyArray<string>;
  isHeading?: boolean;
}
export class ScoreRow extends React.PureComponent<Props> {
  render() {
    const {columnValues, isHeading} = this.props;
    let className = SCORE_RECORD_ROW_CLASSNAME;
    if (this.props.className) {
      className += " " + this.props.className;
    }
    return (
      <tr className={className}>
        {columnValues.map((v, index) => {
          const columnClassName = SCORE_RECORD_CELL_CLASSNAMES[index];
          const className = SCORE_RECORD_CELL_BASE_CLASSNAME + " " + columnClassName;
          const children = this.getChildren(v);
          if (isHeading) {
            return <th className={className}>{children}</th>;
          }
          return <td className={className}>{children}</td>;
        })}
      </tr>
    );
  }

  private getChildren = (value: string) => {
    if (value.includes("\n")) {
      return value.split("\n").map((v) => <div>{v}</div>);
    }
    return value;
  };
}
