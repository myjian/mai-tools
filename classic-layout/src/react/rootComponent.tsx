import React from 'react';

import {parseJudgements} from '../parser';
import {NoteType, StrictJudgementMap} from '../types';
import {ScorePageContainer} from './scorePageContainer';

type MessageType = {
  action: string,
  payload?: string,
  img?: Blob,
  imgSrc?: string,
}

interface RootComponentState {
  songTitle: string;
  achievement: number;
  noteJudgements: Map<NoteType, StrictJudgementMap>;
  difficulty: string;
  track: string;
  date: string;
  highScore: boolean;
  combo: string;
  syncStatus: string;
  songImg?: string;
  rankImg: Map<string, string>;
  apFcImg?: string;
  syncImg?: string;
}
export class RootComponent extends React.PureComponent<{}, RootComponentState> {
  private openerOrigin: string | undefined;
  constructor(props: {}) {
    super(props);
    if (window.opener && document.referrer) {
      this.openerOrigin = new URL(document.referrer).origin;
    }

    const defaultState = {
      date: "2018/09/04 14:04",
      track: "TRACK 1",
      difficulty: "MASTER",
      songTitle: "分からない",
      achievement: "95.3035%", // finale: "94.87%",
      highScore: "1",
      combo: "234/953",
      noteDetails: "654-96-31-28\n25-0-0-0\n78-0-0-1\n\n37-2-1-0",
      syncStatus: "",
    };
    this.state = {
      ...this.parseQueryParams(defaultState),
      rankImg: new Map(),
    };
  }
  
  componentDidMount() {
    document.title = this.state.songTitle + " - maimai classic score layout";
    window.addEventListener("message", this.handleWindowMessage);
    this.sendMessageToOpener({action: "ready"});
  }
  
  render() {
    const {
      achievement, combo, date, difficulty,
      highScore, noteJudgements, songTitle, track,
      songImg, apFcImg, rankImg, syncImg, syncStatus,
    } = this.state;
    return (
      <div className="widthLimit">
        <div className="container">
          <ScorePageContainer
            achievement={achievement}
            combo={combo}
            date={date}
            difficulty={difficulty}
            highScore={highScore}
            noteJudgements={noteJudgements}
            songTitle={songTitle}
            track={track}
            syncStatus={syncStatus}
            songImgSrc={songImg}
            apFcImg={apFcImg}
            rankImg={rankImg}
            syncImg={syncImg}
            fetchRankImage={this.fetchRankImage}
          />
        </div>
      </div>
    );
  }
  
  private parseQueryParams(dft: {[k: string]: string}) {
    const qp = new URLSearchParams(document.location.search);
    const date = qp.get("dt") || dft.date;
    const track = qp.get("tk") || dft.track;
    const difficulty = qp.get("df") || dft.difficulty;
    const songTitle = qp.get("st") || dft.songTitle;
    const achievement = qp.get("ac") || dft.achievement;
    const highScore = qp.get("hs") || dft.highScore;
    const combo = qp.get("cb") || dft.combo;
    const noteDetails = qp.get("nd") || dft.noteDetails;
    const syncStatus = qp.get("sc") || dft.syncStatus;
    return {
      date,
      track,
      songTitle,
      difficulty,
      syncStatus,
      noteJudgements: parseJudgements(noteDetails),
      combo: combo.replace("/", " / "),
      highScore: highScore === "1",
      achievement: parseFloat(achievement),
    };
  }
  
  private sendMessageToOpener(data: MessageType) {
    if (this.openerOrigin) {
      console.log("sending message to opener", data);
      window.opener.postMessage(data, this.openerOrigin);
    }    
  }

  private fetchRankImage = (title: string) => {
    this.state.rankImg.set(title, null);
    this.sendMessageToOpener({action: "getRankImage", payload: title});
  };

  private handleWindowMessage = (evt: MessageEvent) => {
    if (evt.origin === "https://maimaidx-eng.com" || evt.origin === "https://maimaidx.jp") {
      switch (evt.data.action) {
        case "songImage":
          this.setState({songImg: evt.data.imgSrc});
          break;
        case "apFcImage":
          this.setState({apFcImg: URL.createObjectURL(evt.data.img)});
          break;
        case "syncImage":
          this.setState({syncImg: URL.createObjectURL(evt.data.img)});
          break;
        case "rankImage":
          this.setState(state => {
            const existingUrl = state.rankImg.get(evt.data.title);
            if (existingUrl) {
              URL.revokeObjectURL(existingUrl);
            }
            const map = new Map(state.rankImg);
            map.set(evt.data.title, URL.createObjectURL(evt.data.img));
            return {rankImg: map};
          });
          break;
        default:
          console.log(evt.data);
          break;
      }
    }
  };
}
