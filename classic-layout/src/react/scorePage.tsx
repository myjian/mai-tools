import React from 'react';

import {DisplayMode} from '../constants';
import {formatFloat, roundFloat} from '../numberHelper';
import {
  getFinaleRankTitle,
  getRankDefinitions,
  getRankIndexByAchievement,
  getRankTitle,
} from '../rank-functions';
import {
  BreakScoreMap,
  FullJudgementMap,
  FullNoteType,
  JudgementDisplayMap,
  JudgementMap,
  NoteType,
  ScorePerType,
  StrictJudgementMap,
} from '../types';
import {AchievementInfo} from './achievementInfo';
import {DateAndPlace} from './dateAndPlace';
import {JudgementContainer} from './judgementContainer';
import {SongImg} from './songImg';
import {SongInfo} from './songInfo';

function getNextDisplayMode(m: DisplayMode): DisplayMode {
  switch (m) {
    case DisplayMode.NORMAL:
      return DisplayMode.DETAIL;
    case DisplayMode.DETAIL:
      return DisplayMode.LOSS;
    default:
      return DisplayMode.NORMAL;
  }
}

interface ScorePageProps {
  songTitle: string;
  songImgSrc?: string;
  achievement: number;
  apFcImg?: string;
  combo: string;
  date: string;
  difficulty: string;
  finaleAchievement: number;
  finaleBorder: Map<string, number>;
  highScore?: boolean;
  noteJudgements: Map<NoteType, StrictJudgementMap>;
  rankImg: Map<string, string>;
  syncImg?: string;
  syncStatus?: string;
  track: string;
  maxFinaleScore: number;
  breakDistribution: BreakScoreMap;
  pctPerNoteType: Map<string, number>;
  playerScorePerType: ScorePerType;
  totalJudgements: JudgementMap;
  dxAchvPerType: Map<string, number>;
  apFcStatus: string | null;
  achvLossDetail: {dx: Map<FullNoteType, FullJudgementMap>, finale: Map<FullNoteType, FullJudgementMap>};
  fetchRankImage: (title: string) => void;
}
interface ScorePageState {
  isDxMode: boolean;
  displayMode: DisplayMode;
  displayScorePerType?: ScorePerType;
  displayNoteJudgements?: Map<FullNoteType, JudgementDisplayMap>;
}

export class ScorePage extends React.PureComponent<ScorePageProps, ScorePageState> {
  state: ScorePageState = {isDxMode: false, displayMode: DisplayMode.NORMAL};
  
  componentDidMount() {
    const {achievement, finaleAchievement, rankImg, fetchRankImage} = this.props;
    const {isDxMode} = this.state;
    const rankTitle = isDxMode ? getRankTitle(achievement) : getFinaleRankTitle(finaleAchievement);
    if (!rankImg.has(rankTitle)) {
      fetchRankImage(rankTitle);
    }
  }

  render() {
    const {
      achievement, apFcImg, rankImg, syncImg, highScore,
      date, songTitle, track, difficulty,
      songImgSrc, noteJudgements, combo, syncStatus,
      apFcStatus, finaleAchievement, maxFinaleScore,
      breakDistribution, totalJudgements, playerScorePerType,
    } = this.props;
    const {isDxMode, displayMode, displayScorePerType, displayNoteJudgements} = this.state;
    const isLossMode = displayMode === DisplayMode.LOSS;
    const achv = isDxMode ? achievement : finaleAchievement;
    const maxAchv = isDxMode ? 101 : maxFinaleScore;
    const rankTitle = isDxMode ? getRankTitle(achv) : getFinaleRankTitle(achv);
    return (
      <div className="songScoreContainer">
        <DateAndPlace date={date} isDxMode={isDxMode} toggleDxMode={this.toggleDxMode} />
        <div className="songScoreBody">
          <hr className="trackTopLine" />
          <SongInfo
            songTitle={songTitle}
            track={track}
            difficulty={difficulty}
          />
          <SongImg imgSrc={songImgSrc} />
          <AchievementInfo
            apFcStatus={apFcStatus}
            apFcImg={apFcImg}
            rankTitle={rankTitle}
            rankImg={rankImg.get(rankTitle)}
            syncStatus={syncStatus}
            syncImg={syncImg}
            isDxMode={isDxMode}
            isHighScore={highScore}
            achievement={achv}
            maxAchv={maxAchv}
            showMaxAchv={displayMode !== DisplayMode.NORMAL}
            toggleDisplayMode={this.toggleDisplayMode}
          />
          <JudgementContainer
            noteJudgements={displayNoteJudgements || noteJudgements}
            breakDistribution={breakDistribution}
            totalJudgements={displayNoteJudgements ? displayNoteJudgements.get("total") : totalJudgements}
            scorePerType={displayScorePerType || playerScorePerType}
            nextRank={this.getNextRankEntry(achv, isDxMode)}
            combo={combo}
            isDxMode={isDxMode}
            displayMode={displayMode}
          />
        </div>
      </div>
    );    
  }
  
  private toggleDxMode = () => {
    this.setState(state => {
      const isDxMode = !state.isDxMode;
      const {displayMode} = state;
      const displayNoteJudgements = this.getNoteJudgementLoss(isDxMode, displayMode);
      const displayScorePerType = this.getDisplayScorePerType(isDxMode, displayMode);
      return {isDxMode, displayNoteJudgements, displayScorePerType};
    });
  }
  
  private toggleDisplayMode = () => {
    this.setState(state => {
      const displayMode = getNextDisplayMode(state.displayMode);
      const {isDxMode} = state;
      const displayNoteJudgements = this.getNoteJudgementLoss(isDxMode, displayMode);
      const displayScorePerType = this.getDisplayScorePerType(isDxMode, displayMode);
      return {displayMode, displayNoteJudgements, displayScorePerType};
    });
  }

  private getNextRankEntry(achv: number, isDxMode: boolean) {
    if (isDxMode) {
      if (achv === 101) {
        return undefined;
      } else if (achv >= 100.5) {
        return {
          title: "AP+",
          diff: 101 - achv,
        };
      }
      const nextRankDef = getRankDefinitions(true)[getRankIndexByAchievement(achv, true) - 1];
      return {
        title: nextRankDef.title,
        diff: nextRankDef.th - achv,
      };
    }
    let nextRank: {title: string, diff: number} | undefined;
    this.props.finaleBorder.forEach((diff, title) => {
      if (diff > 0 && !nextRank) {
        nextRank = {title, diff};
      }
    });
    return nextRank;
  }

  private getNoteJudgementLoss(isDxMode: boolean, displayMode: DisplayMode) {
    if (displayMode === DisplayMode.LOSS) {
      const lossDetail = isDxMode ? this.props.achvLossDetail.dx : this.props.achvLossDetail.finale;
      const digits = isDxMode ? 2 : 0;
      const map = new Map<FullNoteType, JudgementDisplayMap>();
      lossDetail.forEach((d, noteType) => {
        map.set(noteType, {
          perfect: formatFloat(d.perfect, digits),
          great: formatFloat(d.great, digits),
          good: formatFloat(d.good, digits),
          miss: formatFloat(d.miss, digits),
        });
      });
      return map;
    }
  }

  private getDisplayScorePerType(
    isDxMode: boolean,
    displayMode: DisplayMode,
  ) {
    const {achvLossDetail} = this.props;
    const lossDetail = isDxMode ? achvLossDetail.dx : achvLossDetail.finale;
    if (displayMode === DisplayMode.LOSS) {
      const displayScorePerType = new Map();
      lossDetail.forEach((detail, noteType) => {
        const score = detail.total;
        const isMax = score === 0;
        displayScorePerType.set(noteType, {isMax, score});
      });
      return displayScorePerType;
    }
    return isDxMode ? this.props.dxAchvPerType : this.props.playerScorePerType;
  }
}
