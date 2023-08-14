import React, {useState} from 'react';

import {GameVersion, validateGameVersion} from '../../common/game-version';
import {formatFloat} from '../../common/number-helper';
import {QueryParam} from '../../common/query-params';
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

const LOSS_PREFIX = '-';

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
    return LOSS_PREFIX + formatFloat(loss, digits) + '%';
  }
  return LOSS_PREFIX + loss.toLocaleString('en');
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

export const ScorePage = (props: ScorePageProps) => {
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
  } = props;
  const gameVerStr = new URLSearchParams(window.location.search).get(QueryParam.GameVersion);
  const gameVer = validateGameVersion(gameVerStr, 0);
  const [isDxMode, setIsDxMode] = useState(gameVer >= GameVersion.DX);
  const [displayMode, setDisplayMode] = useState(DisplayMode.LOSS);
  const displayNoteJudgements = getNoteJudgementLoss(isDxMode, displayMode, props.achvLossDetail);
  const displayScorePerType = getDisplayScorePerType(isDxMode, displayMode, props);

  const toggleDxMode = () => {
    setIsDxMode(!isDxMode);
  };

  const toggleDisplayMode = () => {
    setDisplayMode(getNextDisplayMode(displayMode));
  };

  return (
    <div className="songScoreContainer">
      <DateAndPlace date={date} isDxMode={isDxMode} toggleDxMode={toggleDxMode} />
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
          toggleDisplayMode={toggleDisplayMode}
          fetchRankImage={props.fetchRankImage}
        />
        <JudgementContainer
          noteJudgements={displayNoteJudgements || noteJudgements}
          breakDistribution={breakDistribution}
          totalJudgements={
            displayNoteJudgements ? displayNoteJudgements.get('total') : totalJudgements
          }
          scorePerType={displayScorePerType || playerScorePerType}
          nextRank={getNextRankEntry(isDxMode, props)}
          combo={combo}
          isDxMode={isDxMode}
          displayMode={displayMode}
        />
      </div>
    </div>
  );
};

function getNextRankEntry(
  isDxMode: boolean,
  props: Pick<ScorePageProps, 'achievement' | 'finaleAchievement' | 'finaleBorder'>
) {
  const achv = isDxMode ? props.achievement : props.finaleAchievement;
  if (isDxMode) {
    if (achv === 101) {
      return undefined;
    } else if (achv >= 100.5) {
      return {
        title: 'AP+',
        diff: 101 - achv,
      };
    }
    const nextRankDef = getRankDefinitions()[getRankIndexByAchievement(achv) - 1];
    return {
      title: nextRankDef.title,
      diff: nextRankDef.minAchv - achv,
    };
  }
  let nextRank: {title: string; diff: number} | undefined;
  props.finaleBorder.forEach((diff, title) => {
    if (diff > 0 && !nextRank) {
      nextRank = {title, diff};
    }
  });
  return nextRank;
}

function getNoteJudgementLoss(
  isDxMode: boolean,
  displayMode: DisplayMode,
  achvLossDetail: ScorePageProps['achvLossDetail']
) {
  if (displayMode === DisplayMode.LOSS) {
    const lossDetail = isDxMode ? achvLossDetail.dx : achvLossDetail.finale;
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

function getDisplayScorePerType(
  isDxMode: boolean,
  displayMode: DisplayMode,
  props: Pick<ScorePageProps, 'achvLossDetail' | 'dxAchvPerType' | 'playerScorePerType'>
) {
  const lossDetail = isDxMode ? props.achvLossDetail.dx : props.achvLossDetail.finale;
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
  return isDxMode ? props.dxAchvPerType : props.playerScorePerType;
}
