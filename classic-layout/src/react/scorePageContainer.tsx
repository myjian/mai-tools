import React from 'react';

import {calculateScoreInfo} from '../scoreCalc';
import {
  BreakScoreMap,
  FullJudgementMap,
  FullNoteType,
  JudgementMap,
  JudgementType,
  NoteType,
  ScorePerType,
  StrictJudgementMap,
  StrictJudgementType,
} from '../types';
import {ScorePage} from './scorePage';

function calculateTotalJudgements(noteJudgements: Map<NoteType, StrictJudgementMap>) {
  const res: {[j in JudgementType]: number} = {perfect: 0, great: 0, good: 0, miss: 0};
  noteJudgements.forEach((noteJ) => {
    Object.keys(noteJ).forEach((rawJ) => {
      let j = rawJ as StrictJudgementType;
      const count = noteJ[j];
      if (j === "cp") {
        j = "perfect";
      }
      res[j] += count;
    });
  });
  return res;
}

function calculateApFcStatus(
  totalJudgements: {[j in JudgementType]: number},
  finaleBorder: Map<string, number>,
) {
  if (totalJudgements.miss) {
    return null;
  } else if (finaleBorder.get("AP+") === 0) {
    return "AP+";
  } else if (totalJudgements.good) {
    return "FC";
  } else if (totalJudgements.great) {
    return "FC+";
  }
  return "AP";
}

interface Props {
  songTitle: string;
  songImgSrc?: string;
  achievement: number;
  noteJudgements: Map<NoteType, StrictJudgementMap>;
  difficulty?: string;
  track: string;
  date: string;
  highScore?: boolean;
  combo?: string;
  syncStatus?: string;
  rankImg: Map<string, string>;
  apFcImg?: string;
  syncImg?: string;
  fetchRankImage: (title: string) => void;
}
interface State {
  finaleAchievement: number;
  maxFinaleScore: number;
  breakDistribution: BreakScoreMap;
  finaleBorder: Map<string, number>;
  pctPerNoteType: Map<string, number>;
  playerScorePerType: ScorePerType;
  totalJudgements: JudgementMap;
  dxAchvPerType: Map<string, number>;
  apFcStatus: string | null;
  achvLossDetail: {dx: Map<FullNoteType, FullJudgementMap>, finale: Map<FullNoteType, FullJudgementMap>};
}
export class ScorePageContainer extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props) {
    const info = calculateScoreInfo(nextProps.noteJudgements, nextProps.achievement);
    const totalJudgements = calculateTotalJudgements(nextProps.noteJudgements);
    const apFcStatus = calculateApFcStatus(totalJudgements, info.finaleBorder);
    return {...info, totalJudgements, apFcStatus};
  }

  render() {
    return <ScorePage {...this.props} {...this.state} />;
  }
}
