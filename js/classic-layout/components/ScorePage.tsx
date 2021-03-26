import React from 'react';

import {DX_SPLASH_GAME_VERSION} from '../../common/constants';
import {formatFloat} from '../../common/number-helper';
import {getRankDefinitions, getRankIndexByAchievement} from '../../common/rank-functions';
import {DisplayMode} from '../constants';
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
import {AchievementInfo} from './AchievementInfo';
import {DateAndPlace} from './DateAndPlace';
import {JudgementContainer} from './JudgementContainer';
import {SongImg} from './SongImg';
import {SongInfo} from './SongInfo';

const LOSS_PREFIX = "-";

function getNextDisplayMode(m: DisplayMode): DisplayMode {
  switch (m) {
    case DisplayMode.NORMAL:
      return DisplayMode.LOSS;
    case DisplayMode.LOSS:
      return DisplayMode.DETAIL;
    default:
      return DisplayMode.NORMAL;
  }
}

function formatLossNumber(loss: number, digits: number) {
  if (digits) {
    return LOSS_PREFIX + formatFloat(loss, digits) + "%";
  }
  return LOSS_PREFIX + loss.toLocaleString("en");
}

interface ScorePageProps {
  songTitle: string;
  songImgSrc?: string;
  achievement: number;
  apFcImg?: string;
  combo?: string;
  date: string;
  difficulty?: string;
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
  achvLossDetail: {
    dx: Map<FullNoteType, FullJudgementMap>;
    finale: Map<FullNoteType, FullJudgementMap>;
  };
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

  render() {
    const {
      achievement,
      apFcImg,
      rankImg,
      syncImg,
      highScore,
      date,
      songTitle,
      track,
      difficulty,
      songImgSrc,
      noteJudgements,
      combo,
      syncStatus,
      apFcStatus,
      finaleAchievement,
      maxFinaleScore,
      breakDistribution,
      totalJudgements,
      playerScorePerType,
    } = this.props;
    const {isDxMode, displayMode, displayScorePerType, displayNoteJudgements} = this.state;
    return (
      <div className="songScoreContainer">
        <DateAndPlace date={date} isDxMode={isDxMode} toggleDxMode={this.toggleDxMode} />
        <div className="songScoreBody">
          <hr className="trackTopLine" />
          <SongInfo songTitle={songTitle} track={track} difficulty={difficulty} />
          <SongImg imgSrc={songImgSrc} />
          <AchievementInfo
            apFcStatus={apFcStatus}
            apFcImg={apFcImg}
            rankImgMap={rankImg}
            syncStatus={syncStatus}
            syncImg={syncImg}
            isDxMode={isDxMode}
            isHighScore={highScore}
            dxAchv={achievement}
            finaleAchv={finaleAchievement}
            maxFinaleAchv={maxFinaleScore}
            showMaxAchv={displayMode !== DisplayMode.NORMAL}
            toggleDisplayMode={this.toggleDisplayMode}
            fetchRankImage={this.props.fetchRankImage}
          />
          <JudgementContainer
            noteJudgements={displayNoteJudgements || noteJudgements}
            breakDistribution={breakDistribution}
            totalJudgements={
              displayNoteJudgements ? displayNoteJudgements.get("total") : totalJudgements
            }
            scorePerType={displayScorePerType || playerScorePerType}
            nextRank={this.getNextRankEntry(isDxMode)}
            combo={combo}
            isDxMode={isDxMode}
            displayMode={displayMode}
          />
        </div>
      </div>
    );
  }

  private toggleDxMode = () => {
    this.setState((state) => {
      const isDxMode = !state.isDxMode;
      const {displayMode} = state;
      const displayNoteJudgements = this.getNoteJudgementLoss(isDxMode, displayMode);
      const displayScorePerType = this.getDisplayScorePerType(isDxMode, displayMode);
      return {isDxMode, displayNoteJudgements, displayScorePerType};
    });
  };

  private toggleDisplayMode = () => {
    this.setState((state) => {
      const displayMode = getNextDisplayMode(state.displayMode);
      const {isDxMode} = state;
      const displayNoteJudgements = this.getNoteJudgementLoss(isDxMode, displayMode);
      const displayScorePerType = this.getDisplayScorePerType(isDxMode, displayMode);
      return {displayMode, displayNoteJudgements, displayScorePerType};
    });
  };

  private getNextRankEntry(isDxMode: boolean) {
    const achv = isDxMode ? this.props.achievement : this.props.finaleAchievement;
    if (isDxMode) {
      if (achv === 101) {
        return undefined;
      } else if (achv >= 100.5) {
        return {
          title: "AP+",
          diff: 101 - achv,
        };
      }
      // Game version does not matter as we don't use factor here.
      const nextRankDef = getRankDefinitions(DX_SPLASH_GAME_VERSION)[
        getRankIndexByAchievement(achv) - 1
      ];
      return {
        title: nextRankDef.title,
        diff: nextRankDef.minAchv - achv,
      };
    }
    let nextRank: {title: string; diff: number} | undefined;
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
          perfect: formatLossNumber(d.perfect, digits),
          great: formatLossNumber(d.great, digits),
          good: formatLossNumber(d.good, digits),
          miss: formatLossNumber(d.miss, digits),
        });
      });
      return map;
    }
  }

  private getDisplayScorePerType(isDxMode: boolean, displayMode: DisplayMode) {
    const {achvLossDetail} = this.props;
    const lossDetail = isDxMode ? achvLossDetail.dx : achvLossDetail.finale;
    if (displayMode === DisplayMode.LOSS) {
      const digits = isDxMode ? 4 : 0;
      const displayScorePerType = new Map();
      lossDetail.forEach((detail, noteType) => {
        const isMax = detail.total === 0;
        const score = formatLossNumber(detail.total, digits);
        displayScorePerType.set(noteType, {isMax, score});
      });
      return displayScorePerType;
    }
    return isDxMode ? this.props.dxAchvPerType : this.props.playerScorePerType;
  }
}
