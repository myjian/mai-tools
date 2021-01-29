import React from 'react';

import {DX_PLUS_GAME_VERSION, DX_SPLASH_GAME_VERSION} from '../../common/constants';
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
const CACHE_KEY_DX_SPLASH_INNER_LEVEL = "dxSplashInnerLv";

function getInternalLvCacheKey(gameVer: number) {
  switch (gameVer) {
    case DX_PLUS_GAME_VERSION:
      return CACHE_KEY_DX_PLUS_INNER_LEVEL;
    case DX_SPLASH_GAME_VERSION:
      return CACHE_KEY_DX_SPLASH_INNER_LEVEL;
    default:
      return CACHE_KEY_DX_INNER_LEVEL;
  }
}

function getDebugText(data: number | string) {
  if (typeof data === "string") {
    return "string of length " + data.length;
  }
  return data;
}

function readSongProperties(
  gameVer: number,
  inputText: string
): Promise<Map<string, SongProperties[]>> {
  return new Promise((resolve) => {
    // Read from user input
    if (inputText.length > 0) {
      resolve(buildSongPropsMap(inputText));
      return;
    }
    // Read from cache
    const cacheKey = getInternalLvCacheKey(gameVer);
    const cachedInternalLv = readFromCache(cacheKey);
    if (cachedInternalLv) {
      resolve(buildSongPropsMap(cachedInternalLv));
      return;
    }
    // Read from Internet
    console.log("Magic happening...");
    iWantSomeMagic(gameVer).then((responseText) => {
      writeToCache(cacheKey, responseText);
      resolve(buildSongPropsMap(responseText));
    });
  });
}

async function readPlayerScoreFromText(text: string) {
  const lines = text.split("\n");
  const playerScores = [];
  for (const line of lines) {
    const scoreRecord = parseScoreLine(line);
    if (scoreRecord) {
      playerScores.push(scoreRecord);
    }
  }
  return playerScores;
}

interface State {
  gameVer: number;
  showMultiplierTable: boolean;
  ratingData?: RatingData;
  playerName: string | null;
  friendIdx: string | null;
  songPropsByName?: Map<string, ReadonlyArray<SongProperties>>;
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
    const gameVer = dxVersionQueryParam ? parseInt(dxVersionQueryParam) : DX_PLUS_GAME_VERSION;
    let showMultiplierTable = queryParams.get("quickLookup") !== "hide";

    const friendIdx = queryParams.get("friendIdx");
    const playerName = queryParams.get("playerName");
    this.state = {
      gameVer,
      showMultiplierTable,
      friendIdx,
      playerName,
    };
    if (window.opener) {
      this.initWindowCommunication();
    }
  }

  render() {
    const {gameVer, showMultiplierTable, playerName, ratingData, songPropsByName} = this.state;
    return (
      <React.Fragment>
        <VersionSelect gameVer={gameVer} handleVersionSelect={this.selectVersion} />
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
            songPropsByName={songPropsByName}
            ratingData={ratingData}
            playerGradeIndex={this.playerGradeIndex}
            playerName={playerName}
          />
        )}
        {showMultiplierTable && <MultiplierTable />}
        <OtherTools />
        <PageFooter />
      </React.Fragment>
    );
  }

  private selectVersion = (gameVer: number) => {
    this.setState({gameVer}, this.analyzeRating);
  };

  private analyzeRating = async (evt?: React.SyntheticEvent) => {
    if (evt) {
      evt.preventDefault();
    }
    const songPropsText = this.lvInput.current ? this.lvInput.current.getInput() : "";
    const scoreText = this.scoreInput.current ? this.scoreInput.current.getInput() : "";
    const {gameVer} = this.state;
    console.log("gameVer", gameVer);
    const songPropsByName = await readSongProperties(gameVer, songPropsText);
    console.log("Song properties:", songPropsByName);
    const playerScores = await readPlayerScoreFromText(scoreText);
    console.log("Player scores:", playerScores);
    if (!playerScores.length) {
      this.setState({ratingData: undefined, showMultiplierTable: true});
      return;
    }
    const ratingData = await analyzePlayerRating(songPropsByName, playerScores, gameVer);
    console.log("Rating Data:", ratingData);
    this.setState({ratingData, showMultiplierTable: true, songPropsByName});
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
            if (payloadAsInt >= DX_PLUS_GAME_VERSION && payloadAsInt <= DX_SPLASH_GAME_VERSION) {
              this.setState({gameVer: payloadAsInt});
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
