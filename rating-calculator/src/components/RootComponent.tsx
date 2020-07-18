import React from 'react';

import {readFromCache, writeToCache} from '../cache';
import {getCandidateSongs} from '../candidate-songs';
import {UIString} from '../i18n';
import {parseInnerLevelLine} from '../inner-lv-parser';
import {iWantSomeMagic} from '../magic';
import {parseScoreLine} from '../player-score-parser';
import {
  renderRankDistributionPerDifficulty,
  renderRankDistributionPerLevel,
} from '../rank-distribution-visualizer';
import {analyzePlayerRating} from '../rating-analyzer';
import {renderSongScores} from '../score-record-visualizer';
import {DX_GAME_VERSION, DX_PLUS_GAME_VERSION} from '../shared-constants';
import {RatingData, SongProperties} from '../types';
import {InnerLvInput} from './InnerLvInput';
import {MultiplierTable} from './MultiplierTable';
import {OtherTools} from './OtherTools';
import {PageFooter} from './PageFooter';
import {RatingOverview} from './RatingOverview';
import {ScoreInput} from './ScoreInput';
import {VersionSelect} from './VersionSelect';

const CACHE_KEY_DX_INNER_LEVEL = "dxInnerLv";
const CACHE_KEY_DX_PLUS_INNER_LEVEL = "dxPlusInnerLv";

function readSongProperties(isDxPlus: boolean, inputText: string): Promise<Map<string, SongProperties[]>> {
  const processText = (text: string) => {
    const lines = text.split("\n");
    // songPropsByName: song name -> array of song properties
    // most arrays have only 1 entry, but some arrays have more than 1 entries
    // because song name duplicates or it has both DX and Standard charts.
    const songPropsByName = new Map();
    for (const line of lines) {
      const innerLvData = parseInnerLevelLine(line);
      if (innerLvData) {
        if (!songPropsByName.has(innerLvData.songName)) {
          songPropsByName.set(innerLvData.songName, []);
        }
        songPropsByName.get(innerLvData.songName).push(innerLvData);
      }
    }
    return songPropsByName;
  };
  return new Promise((resolve) => {
    // Read from user input
    if (inputText.length > 0) {
      resolve(processText(inputText));
      return;
    }
    // Read from cache
    const cacheKey = isDxPlus ? CACHE_KEY_DX_PLUS_INNER_LEVEL : CACHE_KEY_DX_INNER_LEVEL;
    const cachedInnerLv = readFromCache(cacheKey);
    if (cachedInnerLv) {
      resolve(processText(cachedInnerLv));
      return;
    }
    // Read from Internet
    console.log("Magic happening...");
    fetch(iWantSomeMagic(isDxPlus))
      .then((response) => response.text())
      .then((responseText) => {
        writeToCache(cacheKey, responseText);
        resolve(processText(responseText));
      });
  });
}

async function readPlayerScoreFromText(text: string, isDxPlus: boolean) {
  const lines = text.split("\n");
  const playerScores = [];
  for (const line of lines) {
    const scoreRecord = parseScoreLine(line, isDxPlus);
    if (scoreRecord) {
      playerScores.push(scoreRecord);
    }
  }
  return playerScores;
}

async function calculateAndShowRating(
  isDxPlus: boolean,
  innerLvText: string,
  scoreText: string,
): Promise<RatingData | undefined> {
  console.log("isDxPlus", isDxPlus);
  const songPropsByName = await readSongProperties(isDxPlus, innerLvText);
  console.log("Song properties:", songPropsByName);

  const playerScores = await readPlayerScoreFromText(scoreText, isDxPlus);
  console.log("Player scores:", playerScores);

  if (!playerScores.length) {
    return;
  }
  const gameVersion = isDxPlus ? DX_PLUS_GAME_VERSION : DX_GAME_VERSION;
  const ratingData = await analyzePlayerRating(songPropsByName, playerScores, gameVersion);
  console.log("Rating Data:", ratingData);

  const newTopScores = ratingData.newSongScores.slice(0, ratingData.newTopChartsCount);
  const oldTopScores = ratingData.oldSongScores.slice(0, ratingData.oldTopChartsCount);
  const combinedTopScores = [].concat(newTopScores, oldTopScores);
  renderRankDistributionPerLevel(
    combinedTopScores,
    document.getElementById("lrDistThead") as HTMLTableSectionElement,
    document.getElementById("lrDistTbody") as HTMLTableSectionElement
  );
  renderRankDistributionPerDifficulty(
    combinedTopScores,
    document.getElementById("drDistThead") as HTMLTableSectionElement,
    document.getElementById("drDistTbody") as HTMLTableSectionElement
  );

  renderSongScores(
    newTopScores,
    false, // isCandidate
    document.getElementById("newTopSongsThead") as HTMLTableSectionElement,
    document.getElementById("newTopSongsTbody") as HTMLTableSectionElement
  );
  renderSongScores(
    oldTopScores,
    false, // isCandidate
    document.getElementById("oldTopSongsThead") as HTMLTableSectionElement,
    document.getElementById("oldTopSongsTbody") as HTMLTableSectionElement
  );

  const newCandidateScores = getCandidateSongs(
    ratingData.newSongScores,
    ratingData.newTopChartsCount,
    isDxPlus
  );
  const oldCandidateScores = getCandidateSongs(
    ratingData.oldSongScores,
    ratingData.oldTopChartsCount,
    isDxPlus
  );
  renderSongScores(
    newCandidateScores,
    true, // isCandidate
    document.getElementById("newCandidateSongsThead") as HTMLTableSectionElement,
    document.getElementById("newCandidateSongsTbody") as HTMLTableSectionElement
  );
  renderSongScores(
    oldCandidateScores,
    true, // isCandidate
    document.getElementById("oldCandidateSongsThead") as HTMLTableSectionElement,
    document.getElementById("oldCandidateSongsTbody") as HTMLTableSectionElement
  );

  const outputArea = document.querySelector(".outputArea");
  outputArea.classList.remove("hidden");
  outputArea.scrollIntoView({behavior: "smooth"});

  document.querySelector(".quickLookup").classList.remove("hidden");
  return ratingData;
}

interface State {
  isDxPlus: boolean;
  showMultiplierTable: boolean;
  ratingData?: RatingData;
}
export class RootComponent extends React.PureComponent<{}, State> {
  private playerGradeIndex = 0;
  private lvInput = React.createRef<InnerLvInput>();
  private scoreInput = React.createRef<ScoreInput>();

  constructor(props: {}) {
    super(props);
    const queryParams = new URLSearchParams(document.location.search);
    const dxVersionQueryParam = queryParams.get("gameVersion");
    let isDxPlus = dxVersionQueryParam === DX_PLUS_GAME_VERSION.toString();
    let showMultiplierTable = queryParams.get("quickLookup") !== "hide";
    this.state = {isDxPlus, showMultiplierTable};
    this.initWindowCommunication();
  }

  render() {
    const {isDxPlus, showMultiplierTable, ratingData} = this.state;
    return (
      <React.Fragment>
        <VersionSelect isDxPlus={isDxPlus} handleVersionSelect={this.selectVersion} />
        <InnerLvInput ref={this.lvInput} />
        <ScoreInput ref={this.scoreInput} />
        <div className="actionArea">
          <button id="calculateRatingBtn" onClick={this.handleButtonClick}>計算 Rating 值</button>
        </div>
        <hr className="sectionSep" />
        <div className="outputArea hidden">
          <h2 id="outputHeading">{UIString.analysisResult}</h2>
          {ratingData && (
          <RatingOverview
            newChartsRating={ratingData.newChartsRating}
            oldChartsRating={ratingData.oldChartsRating}
            isDxPlus={isDxPlus}
            playerGradeIndex={this.playerGradeIndex}
          />
          )}
          <div className="ratingObjectDistribution">
            <h3>Rating 對象曲等級與成績分布</h3>
            <div className="flexRow">
              {/* lrDist = level-rank distribution */}
              <table id="lrDistTable">
                <thead id="lrDistThead"></thead>
                <tbody id="lrDistTbody"></tbody>
              </table>
              {/* drDist = difficulty-rank distribution */}
              <table id="drDistTable">
                <thead id="drDistThead"></thead>
                <tbody id="drDistTbody"></tbody>
              </table>
            </div>
          </div>
          <div className="songRecordsContainer">
            <h3>▶ 新譜面 Rating 對象曲目 (取最佳 15 首)：</h3>
            <table className="songRecordTable topRecordTable">
              <thead id="newTopSongsThead"></thead>
              <tbody id="newTopSongsTbody"></tbody>
            </table>
          </div>
          <div className="songRecordsContainer">
            <h3>▶ 舊譜面 Rating 對象曲目 (取最佳 25 首)：</h3>
            <table className="songRecordTable topRecordTable">
              <thead id="oldTopSongsThead"></thead>
              <tbody id="oldTopSongsTbody"></tbody>
            </table>
          </div>
          {/* TODO: filter by song name from user input */}
          <div className="songRecordsContainer">
            <h3>▷ 新譜面 Rating 候選曲目：</h3>
            <table className="songRecordTable candidateTable">
              <thead id="newCandidateSongsThead"></thead>
              <tbody id="newCandidateSongsTbody"></tbody>
            </table>
          </div>
          <div className="songRecordsContainer">
            <h3>▷ 舊譜面 Rating 候選曲目：</h3>
            <table className="songRecordTable candidateTable">
              <thead id="oldCandidateSongsThead"></thead>
              <tbody id="oldCandidateSongsTbody"></tbody>
            </table>
          </div>
          <hr className="sectionSep" />
        </div>
        {showMultiplierTable && <MultiplierTable isDxPlus={isDxPlus} />}
        <OtherTools />
        <PageFooter />
      </React.Fragment>
    );
  }

  private selectVersion = (ver: number) => {
    this.setState({isDxPlus: ver === DX_PLUS_GAME_VERSION});
  }

  private calculateAndShowRating() {
    const innerLvText = this.lvInput.current ? this.lvInput.current.getInput() : "";
    const scoreText = this.scoreInput.current ? this.scoreInput.current.getInput() : "";
    calculateAndShowRating(
      this.state.isDxPlus,
      innerLvText,
      scoreText,
    ).then(ratingData => {
      this.setState({ratingData});
    });
  }

  private handleButtonClick = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    this.calculateAndShowRating();
  };

  private initWindowCommunication = () => {
    if (window.opener) {
      window.addEventListener("message", (evt) => {
        console.log(evt.origin, evt.data);
        if (evt.origin === "https://maimaidx-eng.com" || evt.origin === "https://maimaidx.jp") {
          let payloadAsInt;
          switch (evt.data.action) {
            case "gameVersion":
              payloadAsInt = parseInt(evt.data.payload);
              if (payloadAsInt >= DX_PLUS_GAME_VERSION) {
                this.setState({isDxPlus: true});
              }
              break;
            case "playerGrade":
              payloadAsInt = parseInt(evt.data.payload);
              if (payloadAsInt) {
                this.playerGradeIndex = payloadAsInt;
              }
              break;
            case "replacePlayerScore":
              this.scoreInput.current.setText(evt.data.payload);
              break;
            case "appendPlayerScore":
              this.scoreInput.current.appendText(evt.data.payload);
              break;
            case "calculateRating":
              this.calculateAndShowRating();
              break;
          }
        }
      });
      const referrer = document.referrer && new URL(document.referrer).origin;
      if (referrer) {
        window.opener.postMessage("ready", referrer);
      } else {
        window.opener.postMessage("ready", "https://maimaidx-eng.com");
        window.opener.postMessage("ready", "https://maimaidx.jp");
      }
    }
  }
}
