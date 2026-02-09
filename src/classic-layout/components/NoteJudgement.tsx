import {memo} from 'react';

import {formatFloat} from '../../common/number-helper';
import {Judgement} from '../types';

export function getLastColumnText(score: number | string, isDxMode: boolean) {
  if (typeof score === 'string') {
    // When showDetail is true and there is no loss score, score will be empty string.
    return score.length == 0 ? '0' : score;
  }
  return isDxMode ? formatFloat(score, 4) + '%' : score.toLocaleString('en');
}

interface NoteJudgementProps {
  noteType: string;
  judgements: Record<Judgement, number>;
  loss: Record<Judgement, string>;
  lastColumn: {score: number | string; isMax: boolean};
  isDxMode: boolean;
  showDetail: boolean;
}
export const NoteJudgement = memo(
  ({noteType, judgements, lastColumn, loss, isDxMode, showDetail}: NoteJudgementProps) => {
    if (!judgements) {
      return null;
    }
    const heading = noteType.charAt(0).toUpperCase() + noteType.substring(1);
    const scoreClass = lastColumn.isMax ? 'score maxScore' : 'score';
    return (
      <tr>
        <th className="rowHead">{heading}</th>
        <td className="perfect">
          {judgements.perfect}
          {showDetail ? <p>{loss.perfect}</p> : ''}
        </td>
        <td className="great">
          {judgements.great}
          {showDetail ? <p>{loss.great}</p> : ''}
        </td>
        <td className="good">
          {judgements.good}
          {showDetail ? <p>{loss.good}</p> : ''}
        </td>
        <td className="miss">
          {judgements.miss}
          {showDetail ? <p>{loss.miss}</p> : ''}
        </td>
        <td className={scoreClass}>{getLastColumnText(lastColumn.score, isDxMode)}</td>
      </tr>
    );
  },
);
