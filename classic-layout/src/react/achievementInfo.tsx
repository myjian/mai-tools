import React from 'react';

interface AchievementInfoProps {
  apFcStatus: string;
  apFcImg?: string;
  rankTitle?: string;
  rankImg?: string;
  syncStatus?: string;
  syncImg?: string;
  showMaxAchv: boolean;
  isDxMode: boolean;
  isHighScore?: boolean;
  achievement: number;
  maxAchv: number;
  toggleDisplayMode: () => void;
}
export class AchievementInfo extends React.PureComponent<AchievementInfoProps> {
  state = {showMaxAchv: false};
  render() {
    const {
      apFcStatus, apFcImg, rankTitle, rankImg, isHighScore,
      syncStatus, syncImg, maxAchv, achievement, isDxMode,
      toggleDisplayMode, showMaxAchv
    } = this.props;
    const rankElem = rankImg ? <img className="rankImg" src={rankImg} alt={rankTitle} /> : rankTitle;
    const apFcElem = apFcImg ? <img className="apFcImg" src={apFcImg} alt={apFcStatus} /> : apFcStatus;
    const syncElem = syncImg ? <img className="syncImg" src={syncImg} alt={syncStatus} /> : this.getSyncStatusText(syncStatus, isDxMode);
    const achvText = isDxMode ? achievement.toFixed(4) : achievement.toFixed(2);
    const maxAchvText = isDxMode ? maxAchv.toFixed(4) : maxAchv.toFixed(2);
    return (
      <div className="achievementInfo">
        <div className="achvInfoSpace"></div>
        <div className="rank">{rankElem}</div>
        <div className="apfc">{apFcElem}</div>
        <div className="sync">{syncElem}</div>
        <div className="playerScore">
          <div className="highScore">{isHighScore ? "HIGH SCORE!!" : " "}</div>
          <div className="achievement" tabIndex={0} onClick={toggleDisplayMode}>
            達成率：
            <div className={"achvNum" + (showMaxAchv ? " hasMaxAchv" : "")}>
              <span className="playerAchv">{achvText}％</span>
              {showMaxAchv && <span className="maxAchv">{maxAchvText}％</span>}
            </div>
          </div>
        </div>  
      </div>
    );
  }
  
  private getSyncStatusText(syncStatus?: string, isDxMode?: boolean) {
    if (syncStatus && !isDxMode) {
      switch (syncStatus) {
        case "FS":
        case "FS+":
          return "MAX FEVER";
        case "FDX":
        case "FDX+":
          return "100% SYNC";
      }
    }
    return syncStatus;
  }
}
