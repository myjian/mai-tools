import {fetchFriendScores, FRIEND_SCORE_URLS} from '../js/common/fetch-friend-score';
import {fetchPlayerGrade, getPlayerName} from '../js/common/fetch-score-util';
import {LANG} from '../js/common/lang';
import {statusText} from '../js/common/score-fetch-progress';
import {getScriptHost} from '../js/common/script-host';
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
    ratingCalcMsgListener?: (evt: MessageEvent) => void;
  }
}

type FriendInfo = {
  name: string;
  idx: string;
  elem: HTMLElement;
  isInVsMode?: boolean;
};

(function (d) {
  const BASE_URL = getScriptHost("analyze-friend-rating-in-new-tab") + "/rating-calculator/?";
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
    let analyzeLink = (friend.isInVsMode ? document : friend.elem).querySelector(
      ".analyzeLink"
    ) as HTMLAnchorElement;
    if (analyzeLink) {
      (friend.isInVsMode ? analyzeLink.parentElement : analyzeLink).remove();
    }
    analyzeLink = d.createElement("a");
    analyzeLink.className = "analyzeLink f_14";
    analyzeLink.style.color = "#1477e6";
    analyzeLink.target = "friendRating";
    analyzeLink.innerText = UIString.analyze;
    const queryParams = new URLSearchParams({friendIdx: friend.idx, playerName: friend.name});
    analyzeLink.href = BASE_URL + queryParams.toString();
    if (friend.isInVsMode) {
      analyzeLink.className += " d_ib friend_comment_block t_c";
      analyzeLink.style.borderRadius = "5px";
      analyzeLink.style.width = "184px";
      analyzeLink.style.marginRight = "15px";
      const div = document.createElement("div");
      div.className = "m_l_10 m_r_10 t_r";
      div.append(analyzeLink);
      friend.elem.parentElement.insertAdjacentElement("afterend", div);
    } else {
      analyzeLink.className += " d_b";
      friend.elem
        .querySelector(".friend_comment_block")
        .insertAdjacentElement("afterbegin", analyzeLink);
    }
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
    const host = location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      handleError(UIString.pleaseLogIn);
      return;
    }
    if (
      location.pathname.includes("/friendLevelVs/") ||
      location.pathname.includes("/friendGenreVs/")
    ) {
      const elem = document.querySelector(".friend_vs_friend_block") as HTMLElement;
      const idx = new URLSearchParams(location.search).get("idx");
      const info = {idx, name: getPlayerName(elem), elem, isInVsMode: true};
      friends_cache[idx] = info;
      insertAnalyzeButton(info);
    } else {
      const list = Array.from(
        d.querySelectorAll("img.friend_favorite_icon") as NodeListOf<HTMLImageElement>
      ).map((n) => n.parentElement);
      list.forEach((elem) => {
        const idx = getFriendIdx(elem);
        const info = {idx, name: getPlayerName(elem), elem};
        friends_cache[idx] = info;
        insertAnalyzeButton(info);
      });
    }
    let allSongs: BasicSongProps[];
    if (window.ratingCalcMsgListener) {
      window.removeEventListener("message", window.ratingCalcMsgListener);
    }
    window.ratingCalcMsgListener = (evt) => {
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
    window.addEventListener("message", window.ratingCalcMsgListener);
  }

  main();
})(document);
