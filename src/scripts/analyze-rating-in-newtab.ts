import {getPlayerGrade, getPlayerName} from "../common/fetch-score-util";
import {fetchScores, SELF_SCORE_URLS} from "../common/fetch-self-score";
import {DxVersion} from "../common/game-version";
import {LANG} from "../common/lang";
import {statusText} from "../common/score-fetch-progress";
import {getScriptHost} from "../common/script-host";
import {
  ALLOWED_ORIGINS,
  fetchAllSongs,
  fetchGameVersion,
  fetchNewSongs,
  getPostMessageFunc,
  handleError,
} from "../common/util";

declare global {
  interface Window {
    ratingCalcMsgListener?: (evt: MessageEvent) => void;
  }
}

(function () {
  const BASE_URL = getScriptHost("analyze-rating-in-newtab") + "/rating-calculator/";
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

  const isOnFriendPage = location.pathname.includes("friend");

  async function fetchSelfRecords(send: (action: string, payload: any) => void): Promise<Document> {
    let allSongsDom: Document;
    // Fetch player grade
    const playerGrade = isOnFriendPage ? null : getPlayerGrade(document.body);
    if (playerGrade) {
      send("playerGrade", playerGrade);
    }
    // Fetch all scores
    const scoreList: string[] = [];
    for (const difficulty of SELF_SCORE_URLS.keys()) {
      send("appendPlayerScore", statusText(difficulty, false));
      const dom = await fetchScores(difficulty, scoreList);
      if (difficulty === "MASTER") {
        allSongsDom = dom;
      }
      send("appendPlayerScore", statusText(difficulty, true));
    }
    send("replacePlayerScore", "");
    send("appendPlayerScore", scoreList.join("\n"));
    send("calculateRating", "");
    return allSongsDom;
  }

  function insertAnalyzeButton(url: string) {
    const profileBlock = document.body.querySelector(".basic_block.p_10.f_0");
    if (!profileBlock) {
      return;
    }
    let analyzeLink = document.querySelector(".analyzeLink") as HTMLAnchorElement;
    if (analyzeLink) {
      analyzeLink.remove();
    }
    analyzeLink = document.createElement("a");
    analyzeLink.className = "analyzeLink f_14";
    analyzeLink.style.color = "#1477e6";
    analyzeLink.target = "selfRating";
    analyzeLink.append(UIString.analyze, document.createElement("br"));
    analyzeLink.href = url;
    if (location.pathname.indexOf("/maimai-mobile/playerData/") >= 0) {
      analyzeLink.className += " f_l";
      document
        .querySelector(".m_5.m_t_10.t_r.f_12")
        .insertAdjacentElement("afterbegin", analyzeLink);
    } else if (location.pathname.indexOf("/maimai-mobile/home/") >= 0) {
      analyzeLink.className += " d_b";
      document
        .querySelector(".comment_block.f_l.f_12")
        .insertAdjacentElement("afterbegin", analyzeLink);
    } else {
      profileBlock.querySelector(".name_block").parentElement.append(analyzeLink);
    }
  }

  function main() {
    const host = location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      handleError(UIString.pleaseLogIn);
      return;
    }
    const playerName = isOnFriendPage ? null : getPlayerName(document.body);
    const url = playerName
      ? BASE_URL + "?" + new URLSearchParams({playerName: playerName})
      : BASE_URL;
    if (navigator.userAgent.startsWith("Mozilla/5.0 (iP")) {
      // iOS does not allow pop-up window
      insertAnalyzeButton(url);
    } else {
      window.open(url, "selfRating");
    }
    const gameVerPromise = fetchGameVersion(document.body);
    let allSongsDom: Promise<Document>;
    if (window.ratingCalcMsgListener) {
      window.removeEventListener("message", window.ratingCalcMsgListener);
    }
    window.ratingCalcMsgListener = async (evt) => {
      console.log(evt.origin, evt.data);
      if (ALLOWED_ORIGINS.includes(evt.origin)) {
        const send = getPostMessageFunc(evt.source as WindowProxy, evt.origin);
        if (evt.data === "ready") {
          // Fetch DX version
          send("gameVersion", await gameVerPromise);
          allSongsDom = fetchSelfRecords(send);
        } else if (evt.data.action === "fetchNewSongs") {
          const gameVer = await gameVerPromise;
          const ver = evt.data.payload as DxVersion;
          if (gameVer < ver) {
            // Current gameVer is older than the requested version.
            send("newSongs", []);
          } else {
            fetchNewSongs(ver).then((songs) => send("newSongs", songs));
          }
        } else if (evt.data.action === "fetchAllSongs") {
          allSongsDom.then((dom) => fetchAllSongs(dom).then((songs) => send("allSongs", songs)));
        }
      }
    };
    window.addEventListener("message", window.ratingCalcMsgListener);
  }

  main();
})();
