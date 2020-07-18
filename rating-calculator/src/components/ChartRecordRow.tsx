import React from 'react';

const SCORE_RECORD_ROW_CLASSNAME = "scoreRecordRow";
const SCORE_RECORD_CELL_BASE_CLASSNAME = "scoreRecordCell";
const SCORE_RECORD_CELL_CLASSNAMES = [
  "orderCell",
  "songTitleCell",
  "difficultyCell",
  "innerLvCell",
  "achievementCell",
  "rankFactorCell",
  "ratingCell",
];

interface Props {
  className?: string;
  columnValues: ReadonlyArray<string>;
  isHeading?: boolean;
}
export const ScoreRow: React.FC<Props> = React.memo((props) => {
  const {columnValues, isHeading} = props;
  let className = SCORE_RECORD_ROW_CLASSNAME;
  if (props.className) {
    className += " " + props.className;
  }
  return (
    <tr className={className}>
      {columnValues.map((v, index) => {
        const className =
          SCORE_RECORD_CELL_BASE_CLASSNAME + " " + SCORE_RECORD_CELL_CLASSNAMES[index];
        if (isHeading) {
          return <th className={className}>{v}</th>;
        }
        return <td className={className}>{v}</td>;
      })}
    </tr>
  );
});
