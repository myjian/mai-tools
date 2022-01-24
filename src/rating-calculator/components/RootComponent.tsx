import React from "react";

import {DxVersion, validateGameVersion} from "../../common/game-version";
import {iWantSomeMagic} from "../../common/magic";
import {
  buildSongPropsMap,
  filterSongsByVersion,
  getSongsByVersion,
  MatchMode,
  SongProperties,
} from "../../common/song-props";
import {readFromCache, writeToCache} from "../cache";
import {UIString} from "../i18n";
import {parseScoreLine} from "../player-score-parser";
import {analyzePlayerRating} from "../rating-analyzer";
import {GameRegion, RatingData} from "../types";
import {InternalLvInput} from "./InternalLvInput";
import {OtherTools} from "./OtherTools";
import {PageFooter} from "./PageFooter";
import {RatingOutput} from "./RatingOutput";
import {ScoreInput} from "./ScoreInput";
import {VersionSelect} from "./VersionSelect";

function getDebugText({action, payload}: {action: string; payload: number | string}) {
  if (action === "appendPlayerScore") {
    return "string of length " + (payload as string).length;
  }
  return payload;
}

function readSongProperties(
  gameVer: DxVersion,
  inputText: string
): Promise<Map<string, SongProperties[]>> {
  return new Promise((resolve) => {
    // Read from user input
    if (inputText.length > 0) {
      resolve(buildSongPropsMap(inputText));
      return;
    }
    // Read from cache
    const cachedGameData = readFromCache(gameVer);
    if (cachedGameData) {
      resolve(buildSongPropsMap(cachedGameData));
      return;
    }
    // Read from Internet
    console.log("Magic happening...");
    iWantSomeMagic(gameVer).then((responseText) => {
      writeToCache(gameVer, responseText);
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
  gameRegion: GameRegion;
  gameVer: DxVersion;
  ratingData?: RatingData;
  playerName: string | null;
  friendIdx: string | null;
  songPropsByName?: Map<string, ReadonlyArray<SongProperties>>;
  oldSongs?: ReadonlyArray<SongProperties>;
  newSongs?: ReadonlyArray<SongProperties>;
}

export class RootComponent extends React.PureComponent<{}, State> {
  private playerGradeIndex = 0;
  private lvInput = React.createRef<InternalLvInput>();
  private scoreInput = React.createRef<ScoreInput>();
  private referrer = document.referrer && new URL(document.referrer).origin;

  constructor(props: {}) {
    super(props);
    const queryParams = new URLSearchParams(location.search);
    const dxVersionQueryParam = queryParams.get("gameVersion");
    const gameVer = validateGameVersion(dxVersionQueryParam, DxVersion.SPLASH_PLUS);

    const friendIdx = queryParams.get("friendIdx");
    const playerName = queryParams.get("playerName");
    this.state = {
      gameRegion: GameRegion.Jp,
      gameVer,
      friendIdx,
      playerName,
    };
    if (window.opener) {
      this.initWindowCommunication();
    }
  }

  componentDidUpdate(_prevProps: {}, prevState: State) {
    if (
      this.state.songPropsByName &&
      ((!this.state.oldSongs && !this.state.newSongs) || prevState.gameVer !== this.state.gameVer)
    ) {
      this.loadSongLists(this.state.gameVer);
    }
  }

  render() {
    const {gameRegion, gameVer, playerName, ratingData, songPropsByName, oldSongs, newSongs} =
      this.state;
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
            gameRegion={gameRegion}
            gameVer={gameVer}
            songPropsByName={songPropsByName}
            ratingData={ratingData}
            playerGradeIndex={this.playerGradeIndex}
            playerName={playerName}
            oldSongs={oldSongs}
            newSongs={newSongs}
          />
        )}
        <PageFooter />
        <OtherTools gameVer={gameVer} />
      </React.Fragment>
    );
  }

  private selectVersion = (gameVer: DxVersion) => {
    this.setState({gameVer}, this.analyzeRating);
  };

  private analyzeRating = async (evt?: React.SyntheticEvent) => {
    if (evt) {
      evt.preventDefault();
    }
    const songPropsText = this.lvInput.current ? this.lvInput.current.getInput() : "";
    const scoreText = this.scoreInput.current ? this.scoreInput.current.getInput() : "";
    const {gameVer, gameRegion} = this.state;
    console.log("gameVer", gameVer);
    const songPropsByName = await readSongProperties(gameVer, songPropsText);
    console.log("Song properties:", songPropsByName);
    const playerScores = await readPlayerScoreFromText(scoreText);
    console.log("Player scores:", playerScores);
    if (!playerScores.length) {
      this.setState({ratingData: undefined});
      return;
    }
    const ratingData = await analyzePlayerRating(
      songPropsByName,
      playerScores,
      gameVer,
      gameRegion
    );
    console.log("Rating Data:", ratingData);
    this.setState({ratingData, songPropsByName});
  };

  private postMessageToOpener(data: string | {action: string; payload?: string | number}) {
    if (window.opener) {
      if (this.referrer) {
        window.opener.postMessage(data, this.referrer);
      } else {
        window.opener.postMessage(data, "https://maimaidx-eng.com");
        window.opener.postMessage(data, "https://maimaidx.jp");
      }
    }
  }

  private initWindowCommunication() {
    window.addEventListener("message", (evt) => {
      if (evt.origin === "https://maimaidx-eng.com" || evt.origin === "https://maimaidx.jp") {
        console.log(evt.origin, evt.data.action, getDebugText(evt.data));
        let payloadAsInt;
        switch (evt.data.action) {
          case "gameVersion":
            this.setState({
              gameRegion: evt.origin === "https://maimaidx.jp" ? GameRegion.Jp : GameRegion.Intl,
              gameVer: validateGameVersion(evt.data.payload),
            });
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
          case "allSongs":
            this.setState({
              oldSongs: filterSongsByVersion(
                evt.data.payload,
                this.state.songPropsByName,
                this.state.gameVer,
                MatchMode.OLDER
              ),
            });
            break;
          case "newSongs":
            if (evt.data.payload.length) {
              this.setState({
                newSongs: filterSongsByVersion(
                  evt.data.payload,
                  this.state.songPropsByName,
                  this.state.gameVer,
                  MatchMode.EQUAL
                ),
              });
            } else {
              this.setState({
                newSongs: getSongsByVersion(this.state.songPropsByName, this.state.gameVer),
              });
            }
            break;
        }
      }
    });
    const {friendIdx} = this.state;
    if (friendIdx) {
      // Analyze friend rating
      this.postMessageToOpener({action: "getFriendRecords", payload: friendIdx});
    } else {
      // Analyze self rating
      this.postMessageToOpener("ready");
    }
  }

  private loadSongLists(gameVer: DxVersion) {
    this.postMessageToOpener({action: "fetchAllSongs"});
    this.postMessageToOpener({action: "fetchNewSongs", payload: gameVer});
  }
}
