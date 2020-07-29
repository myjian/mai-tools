import React from 'react';

import {DX_GAME_VERSION, DX_PLUS_GAME_VERSION} from '../../common/constants';
import {iWantSomeMagic} from '../../common/magic';
import {buildSongPropsMap, SongProperties} from '../../common/song-props';
import {readFromCache, writeToCache} from '../cache';
import {UIString} from '../i18n';
import {parseScoreLine} from '../player-score-parser';
import {analyzePlayerRating} from '../rating-analyzer';
import {RatingData} from '../types';
import {InternalLvInput} from './InternalLvInput';
import {MultiplierTable} from './MultiplierTable';
import {OtherTools} from './OtherTools';
import {PageFooter} from './PageFooter';
import {RatingOutput} from './RatingOutput';
import {ScoreInput} from './ScoreInput';
import {VersionSelect} from './VersionSelect';

const CACHE_KEY_DX_INNER_LEVEL = "dxInnerLv";
const CACHE_KEY_DX_PLUS_INNER_LEVEL = "dxPlusInnerLv";

function getInternalLvCacheKey(isDxPlus: boolean) {
  return isDxPlus ? CACHE_KEY_DX_PLUS_INNER_LEVEL : CACHE_KEY_DX_INNER_LEVEL;
}

function getDebugText(data: number | string) {
  if (typeof data === "string") {
    return "string of length " + data.length;
  }
  return data;
}

function readSongProperties(
  isDxPlus: boolean,
  inputText: string
): Promise<Map<string, SongProperties[]>> {
  return new Promise((resolve) => {
    // Read from user input
    if (inputText.length > 0) {
      resolve(buildSongPropsMap(inputText));
      return;
    }
    // Read from cache
    const cacheKey = getInternalLvCacheKey(isDxPlus);
    const cachedInternalLv = readFromCache(cacheKey);
    if (cachedInternalLv) {
      resolve(buildSongPropsMap(cachedInternalLv));
      return;
    }
    // Read from Internet
    console.log("Magic happening...");
    iWantSomeMagic(isDxPlus).then((responseText) => {
      writeToCache(cacheKey, responseText);
      resolve(buildSongPropsMap(responseText));
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

interface State {
  isDxPlus: boolean;
  showMultiplierTable: boolean;
  ratingData?: RatingData;
  playerName: string | null;
  friendIdx: string | null;
}
export class RootComponent extends React.PureComponent<{}, State> {
  private playerGradeIndex = 0;
  private lvInput = React.createRef<InternalLvInput>();
  private scoreInput = React.createRef<ScoreInput>();
  private referrer = document.referrer && new URL(document.referrer).origin;

  constructor(props: {}) {
    super(props);
    const queryParams = new URLSearchParams(document.location.search);
    const dxVersionQueryParam = queryParams.get("gameVersion");
    let isDxPlus = dxVersionQueryParam === DX_PLUS_GAME_VERSION.toString();
    let showMultiplierTable = queryParams.get("quickLookup") !== "hide";

    const friendIdx = queryParams.get("friendIdx");
    const playerName = queryParams.get("playerName");
    this.state = {
      isDxPlus,
      showMultiplierTable,
      friendIdx,
      playerName,
    };
    if (window.opener) {
      this.initWindowCommunication();
    }
  }

  render() {
    const {isDxPlus, showMultiplierTable, playerName, ratingData} = this.state;
    return (
      <React.Fragment>
        <VersionSelect isDxPlus={isDxPlus} handleVersionSelect={this.selectVersion} />
        <InternalLvInput ref={this.lvInput} />
        <ScoreInput ref={this.scoreInput} />
        <div className="actionArea">
          <button className="analyzeRatingBtn" onClick={this.analyzeRating}>
            {UIString.computeRating}
          </button>
        </div>
        <hr className="sectionSep" />
        {ratingData && (
          <RatingOutput
            isDxPlus={isDxPlus}
            ratingData={ratingData}
            playerGradeIndex={this.playerGradeIndex}
            playerName={playerName}
          />
        )}
        {showMultiplierTable && <MultiplierTable isDxPlus={isDxPlus} />}
        <OtherTools />
        <PageFooter />
      </React.Fragment>
    );
  }

  private selectVersion = (ver: number) => {
    this.setState({isDxPlus: ver === DX_PLUS_GAME_VERSION}, this.analyzeRating);
  };

  private analyzeRating = async (evt?: React.SyntheticEvent) => {
    if (evt) {
      evt.preventDefault();
    }
    const songPropsText = this.lvInput.current ? this.lvInput.current.getInput() : "";
    const scoreText = this.scoreInput.current ? this.scoreInput.current.getInput() : "";
    const {isDxPlus} = this.state;
    console.log("isDxPlus", isDxPlus);
    const songPropsByName = await readSongProperties(isDxPlus, songPropsText);
    console.log("Song properties:", songPropsByName);
    const playerScores = await readPlayerScoreFromText(scoreText, isDxPlus);
    console.log("Player scores:", playerScores);
    if (!playerScores.length) {
      this.setState({ratingData: undefined, showMultiplierTable: true});
      return;
    }
    const gameVersion = isDxPlus ? DX_PLUS_GAME_VERSION : DX_GAME_VERSION;
    const ratingData = await analyzePlayerRating(songPropsByName, playerScores, gameVersion);
    console.log("Rating Data:", ratingData);
    this.setState({ratingData, showMultiplierTable: true});
  };

  private postMessageToOpener(data: string | {[key: string]: string}) {
    if (window.opener) {
      if (this.referrer) {
        window.opener.postMessage(data, this.referrer);
      } else {
        window.opener.postMessage("ready", "https://maimaidx-eng.com");
        window.opener.postMessage("ready", "https://maimaidx.jp");
      }
    }
  }

  private initWindowCommunication() {
    window.addEventListener("message", (evt) => {
      console.log(evt.origin, evt.data.action, getDebugText(evt.data.payload));
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
            this.analyzeRating();
            break;
        }
      }
    });
    const {friendIdx} = this.state;
    if (friendIdx) {
      // Analyze friend rating
      this.postMessageToOpener({action: "getFriendRecords", idx: friendIdx});
    } else {
      // Analyze self rating
      this.postMessageToOpener("ready");
    }
  }
}
