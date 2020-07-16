import React from 'react';

import {DisplayMode} from '../constants';
import {
  BreakScoreMap,
  FullNoteType,
  JudgementDisplayMap,
  ScorePerType,
  StrictJudgementMap,
} from '../types';
import {BreakNoteJudgement} from './breakNoteJudgement';
import {NextRankInfo} from './nextRankInfo';
import {NoteJudgement} from './noteJudgement';

interface JudgementContainerProps {
  noteJudgements: Map<FullNoteType, JudgementDisplayMap | StrictJudgementMap>;
  breakDistribution: BreakScoreMap;
  totalJudgements: JudgementDisplayMap;
  scorePerType: ScorePerType;
  nextRank?: {title: string, diff: number};
  combo?: string;
  isDxMode: boolean;
  displayMode: DisplayMode;
}

export class JudgementContainer extends React.PureComponent<JudgementContainerProps> {
  render() {
    const {
      nextRank, noteJudgements, breakDistribution,
      totalJudgements, scorePerType, combo,
      isDxMode, displayMode
    } = this.props;
    return (
      <div className="judgementContainer">
        <table className="judgement">
          <tbody>
            <tr>
              <th className="rowHead">&nbsp;</th>
              <th className="perfect">Perfect</th>
              <th className="great">Great</th>
              <th className="good">Good</th>
              <th className="miss">Miss</th>
              <th className="score">Score</th>
            </tr>
            <NoteJudgement
              noteType="total"
              judgements={totalJudgements}
              lastColumn={scorePerType.get("total")}
              isDxMode={isDxMode}
            />
            <NextRankInfo nextRank={nextRank} showTitle={displayMode !== DisplayMode.NORMAL} />
            {combo && (
              <tr className="maxCombo">
                <th className="noRightBorder" colSpan={4}>MAX COMBO</th>
                <td className="noLeftBorder" colSpan={2}>{combo}</td>
              </tr>
            )}
            <tr className="tableSeparator">
              <td colSpan={6}></td>
            </tr>
            <NoteJudgement
              noteType="tap"
              judgements={noteJudgements.get("tap")}
              lastColumn={scorePerType.get("tap")}
              isDxMode={isDxMode}
            />
            <NoteJudgement
              noteType="hold"
              judgements={noteJudgements.get("hold")}
              lastColumn={scorePerType.get("hold")}
              isDxMode={isDxMode}
            />
            <NoteJudgement
              noteType="slide"
              judgements={noteJudgements.get("slide")}
              lastColumn={scorePerType.get("slide")}
              isDxMode={isDxMode}
            />
            <NoteJudgement
              noteType="touch"
              judgements={noteJudgements.get("touch")}
              lastColumn={scorePerType.get("touch")}
              isDxMode={isDxMode}
            />
            <BreakNoteJudgement
              judgements={noteJudgements.get("break")}
              distribution={breakDistribution}
              lastColumn={scorePerType.get("break")}
              isDxMode={isDxMode}
              displayMode={displayMode}
            />
          </tbody>
        </table>
      </div>
    );
  }
}
