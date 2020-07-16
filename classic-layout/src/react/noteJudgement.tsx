import React from 'react';

import {formatFloat} from '../numberHelper';
import {JudgementDisplayMap, StrictJudgementMap} from '../types';

function getPerfectCount(j: JudgementDisplayMap | StrictJudgementMap) {
  const cpV = (j as StrictJudgementMap).cp;
  if (cpV) {
    return cpV + (j.perfect as number);
  }
  return j.perfect;
}

interface NoteJudgementProps {
  noteType: string;
  judgements: JudgementDisplayMap | StrictJudgementMap;
  lastColumn: {score: number, isMax: boolean};
}
export class NoteJudgement extends React.PureComponent<NoteJudgementProps> {
  render() {
    const {noteType, judgements, lastColumn} = this.props;
    if (!judgements) {
      return null;
    }
    const heading = noteType.charAt(0).toUpperCase() + noteType.substring(1);
    const scoreClass = lastColumn.isMax ? "score maxScore" : "score";
    const perfectCount = getPerfectCount(judgements);
    return (
      <tr className={noteType + "NoteRow"}>
        <th className="rowHead">{heading}</th>
        <td className="perfect">{perfectCount}</td>
        <td className="great">{judgements.great}</td>
        <td className="good">{judgements.good}</td>
        <td className="miss">{judgements.miss}</td>
        <td className={scoreClass}>{this.getLastColumnText()}</td>
      </tr>
    );
  }
  
  private getLastColumnText() {
    const {lastColumn} = this.props;
    const score = lastColumn.score;
    return formatFloat(score, 4);
  }
}
