import React from 'react';

import {getFinaleRankTitle, getRankTitle} from '../../common/rank-functions';

const MAX_DX_ACHIEVEMENT = 101;

function calculateRankTitle(
  finaleAchv: number,
  isDxMode: boolean,
  dxAchv: number,
  apFcStatus: string
) {
  if (isDxMode) {
    return getRankTitle(dxAchv);
  }
  if (apFcStatus === 'AP+') {
    return 'SSS+';
  }
  return getFinaleRankTitle(finaleAchv);
}

function getApFcClassName(apFcStatus?: string) {
  const base = 'apfc';
  if (!apFcStatus) {
    return base;
  } else if (apFcStatus === 'FC+') {
    return base + ' fcplus';
  }
  return apFcStatus.includes('AP') ? base + ' ap' : base;
}

function getSyncClassName(isDxMode: boolean) {
  return isDxMode ? 'sync' : 'sync finaleSync';
}

interface Props {
  apFcStatus: string;
  apFcImg?: string;
  rankImgMap: Map<string, string>;
  syncStatus?: string;
  syncImg?: string;
  showMaxAchv: boolean;
  isDxMode: boolean;
  isHighScore?: boolean;
  dxAchv: number;
  finaleAchv: number;
  maxFinaleAchv: number;
  fetchRankImage: (title: string) => void;
  toggleDisplayMode: () => void;
}
interface State {
  rankTitle: string;
}
export class AchievementInfo extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(props: Props) {
    const {dxAchv, apFcStatus, finaleAchv, isDxMode} = props;
    return {rankTitle: calculateRankTitle(finaleAchv, isDxMode, dxAchv, apFcStatus)};
  }

  componentDidMount() {
    this.fetchRankImage();
  }

  componentDidUpdate() {
    this.fetchRankImage();
  }

  render() {
    const {
      apFcStatus,
      apFcImg,
      rankImgMap,
      isHighScore,
      syncStatus,
      syncImg,
      maxFinaleAchv,
      dxAchv,
      finaleAchv,
      isDxMode,
      toggleDisplayMode,
      showMaxAchv,
    } = this.props;
    const {rankTitle} = this.state;
    const rankImg = rankImgMap.get(rankTitle);
    const rankElem = rankImg ? (
      <img className="rankImg" src={rankImg} alt={rankTitle} />
    ) : (
      rankTitle
    );
    const apFcElem = apFcImg ? (
      <img className="apFcImg" src={apFcImg} alt={apFcStatus} />
    ) : (
      apFcStatus
    );
    const syncElem = syncImg ? (
      <img className="syncImg" src={syncImg} alt={syncStatus} />
    ) : (
      this.getSyncStatusText(syncStatus, isDxMode)
    );
    const achvText = isDxMode ? dxAchv.toFixed(4) : finaleAchv.toFixed(2);
    const maxAchvText = isDxMode ? MAX_DX_ACHIEVEMENT.toFixed(4) : maxFinaleAchv.toFixed(2);
    return (
      <div className="achievementInfo">
        <div className="achvInfoSpace"></div>
        <div className="rank">{rankElem}</div>
        <div className={getApFcClassName(apFcStatus)}>{apFcElem}</div>
        <div className={getSyncClassName(isDxMode)}>{syncElem}</div>
        <div className="playerScore">
          <div className="highScore">{isHighScore ? 'HIGH SCORE!!' : ' '}</div>
          <button className="achievement" onClick={toggleDisplayMode}>
            達成率：
            <span className={'achvNum' + (showMaxAchv ? ' hasMaxAchv' : '')}>
              <span className="playerAchv">{achvText}％</span>
              {showMaxAchv && <span className="maxAchv">{maxAchvText}％</span>}
            </span>
          </button>
        </div>
      </div>
    );
  }

  private getSyncStatusText(syncStatus?: string, isDxMode?: boolean) {
    if (syncStatus && !isDxMode) {
      switch (syncStatus) {
        case 'FS':
        case 'FS+':
          return 'MAX FEVER';
        case 'FSD':
        case 'FSD+':
          return '100% SYNC';
      }
    }
    return syncStatus;
  }

  private fetchRankImage() {
    const {rankImgMap, fetchRankImage} = this.props;
    const {rankTitle} = this.state;
    if (!rankImgMap.has(rankTitle)) {
      fetchRankImage(rankTitle);
    }
  }
}
