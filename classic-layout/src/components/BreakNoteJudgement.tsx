import React from 'react';

import {DisplayMode} from '../constants';
import {JudgementDisplayMap} from '../types';
import {getLastColumnText, NoteJudgement} from './NoteJudgement';

interface BreakNoteJudgementProps {
  judgements: JudgementDisplayMap;
  distribution: Map<number, number>;
  lastColumn: {score: number|string, isMax: boolean};
  isDxMode: boolean;
  displayMode: DisplayMode;
}
export class BreakNoteJudgement extends React.PureComponent<BreakNoteJudgementProps> {
  render() {
    const {judgements, distribution, lastColumn, isDxMode, displayMode} = this.props;
    const scoreClass = lastColumn.isMax ? "score maxScore" : "score";
    if (displayMode === DisplayMode.DETAIL) {
      return (
        <tr className="breakNoteRow">
          <th className="rowHead">Break</th>
          <td colSpan={3} className="noRightBorder">
            <div className="breakDistribution">
              <span className="perfect">{distribution.get(2600)}</span>
              <span className="perfect">{distribution.get(2550)}</span>
              <span className="perfect">{distribution.get(2500)}</span>
              <span className="great">{distribution.get(2000)}</span>
              <span className="great">{distribution.get(1500)}</span>
              <span className="great">{distribution.get(1250)}</span>
              <span className="good">{distribution.get(1000)}</span>
            </div>
          </td>
          <td className="noLeftBorder"><div className="miss missWithBefore">{distribution.get(0)}</div></td>
          <td className={scoreClass}>{getLastColumnText(lastColumn.score, isDxMode)}</td>
        </tr>
      );
    } else {
      return (
        <NoteJudgement
          noteType="break"
          judgements={judgements}
          lastColumn={lastColumn}
          isDxMode={isDxMode}
        />
      );
    }
  }
}
