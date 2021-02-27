import {fetchFriendScores, FRIEND_SCORE_URLS} from '../js/common/fetch-friend-score';
import {fetchPlayerGrade, getPlayerName} from '../js/common/fetch-score-util';
import {LANG} from '../js/common/lang';
import {statusText} from '../js/common/score-fetch-progress';
import {BasicSongProps} from '../js/common/song-props';
import {
  ALLOWED_ORIGINS,
  fetchAllSongs,
  fetchGameVersion,
  fetchNewSongs,
  getPostMessageFunc,
  handleError,
} from '../js/common/util';

declare global {
  interface Window {
    // add you custom properties and methods
    ratingCalcMsgListener?: (evt: MessageEvent) => void;
  }
}
type FriendInfo = {
  name: string;
  idx: string;
  elem: HTMLElement;
};

(function (d) {
  // const BASE_URL = "https://myjian.github.io/mai-tools/rating-calculator/?";
  const BASE_URL = "http://localhost:8080/rating-calculator/?";
  // const BASE_URL = "https://cdpn.io/myjian/debug/BajbXQp/ZorBazGeynzM?";
  const UIString = {
    zh: {
      pleaseLogIn: "請登入 maimai NET",
      analyze: "分析 Rating",
    },
    en: {
      pleaseLogIn: "Please log in to maimai DX NET.",
      analyze: "Analyze Rating",
    },
  }[LANG];
  const friends_cache: {[idx: string]: FriendInfo} = {};

  function getFriendIdx(n: HTMLElement) {
    return (n.querySelector("[name=idx]") as HTMLInputElement).value;
  }

  function insertAnalyzeButton(friend: FriendInfo) {
    const container = friend.elem.querySelector(".basic_block > .p_l_10");
    let analyzeLink = friend.elem.querySelector(".analyzeLink") as HTMLAnchorElement;
    if (analyzeLink) {
      analyzeLink.remove();
    }
    analyzeLink = d.createElement("a");
    analyzeLink.className = "analyzeLink f_r f_14";
    analyzeLink.style.color = "#1477e6";
    analyzeLink.target = "friendRating";
    analyzeLink.innerText = UIString.analyze;
    const queryParams = new URLSearchParams();
    queryParams.set("friendIdx", friend.idx);
    queryParams.set("playerName", friend.name);
    analyzeLink.href = BASE_URL + queryParams.toString();
    container.append(analyzeLink);
  }

  async function fetchFriendRecords(
    friend: FriendInfo,
    send: (action: string, payload: string) => void
  ) {
    // Fetch DX version
    const gameVer = await fetchGameVersion(document.body);
    send("gameVersion", gameVer);
    // Fetch player grade
    const playerGrade = fetchPlayerGrade(friend.elem);
    if (playerGrade) {
      send("playerGrade", playerGrade);
    }
    // Fetch all scores
    const scoreList: string[] = [];
    for (const difficulty of FRIEND_SCORE_URLS.keys()) {
      send("appendPlayerScore", statusText(difficulty, false));
      await fetchFriendScores(friend.idx, difficulty, scoreList);
      send("appendPlayerScore", statusText(difficulty, true));
    }
    send("replacePlayerScore", "");
    send("appendPlayerScore", scoreList.join("\n"));
    send("calculateRating", "");
  }

  function main() {
    const host = document.location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      handleError(UIString.pleaseLogIn);
      return;
    }
    const list = Array.from(
      d.querySelectorAll("img.friend_favorite_icon") as NodeListOf<HTMLImageElement>
    ).map((n) => n.parentElement);
    list.forEach((elem) => {
      const idx = getFriendIdx(elem);
      const info = {idx, name: getPlayerName(elem), elem};
      friends_cache[idx] = info;
      insertAnalyzeButton(info);
    });
    if (self.ratingCalcMsgListener) {
      window.removeEventListener("message", self.ratingCalcMsgListener);
    }
    let allSongs: BasicSongProps[];
    self.ratingCalcMsgListener = (evt) => {
      console.log(evt.origin, evt.data);
      if (ALLOWED_ORIGINS.includes(evt.origin)) {
        const send = getPostMessageFunc(evt.source as WindowProxy, evt.origin);
        if (evt.data.action === "getFriendRecords") {
          const friend = friends_cache[evt.data.payload];
          if (friend) {
            fetchFriendRecords(friend, send);
          }
        } else if (evt.data.action === "fetchNewSongs") {
          fetchNewSongs(evt.data.payload).then((songs) => send("newSongs", songs));
        } else if (evt.data.action === "fetchAllSongs") {
          if (allSongs) {
            send("allSongs", allSongs);
          }
          fetchAllSongs().then((songs) => {
            allSongs = songs;
            send("allSongs", songs);
          });
        }
      }
    };
    window.addEventListener("message", self.ratingCalcMsgListener);
  }

  main();
})(document);
