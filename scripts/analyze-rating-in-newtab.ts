import {fetchPlayerGrade, getPlayerName} from '../js/common/fetch-score-util';
import {fetchScores, SELF_SCORE_URLS} from '../js/common/fetch-self-score';
import {LANG} from '../js/common/lang';
import {statusText} from '../js/common/score-fetch-progress';
import {
  ALLOWED_ORIGINS,
  fetchGameVersion,
  getPostMessageFunc,
  handleError,
} from '../js/common/util';

(function () {
  const BASE_URL = "https://myjian.github.io/mai-tools/rating-calculator/";
  // const BASE_URL = "https://cdpn.io/myjian/debug/BajbXQp/yoMZEOmaRZbk";
  const UIString = {
    zh: {pleaseLogIn: "請登入 maimai NET"},
    en: {pleaseLogIn: "Please log in to maimai DX NET."},
  }[LANG];

  async function fetchSelfRecords(send: (action: string, payload: string) => void) {
    // Fetch DX version
    const gameVer = await fetchGameVersion(document.body);
    send("gameVersion", gameVer);
    // Fetch player grade
    const playerGrade = fetchPlayerGrade(document.body);
    if (playerGrade) {
      send("playerGrade", playerGrade);
    }
    // Fetch all scores
    const scoreList: string[] = [];
    for (const difficulty of SELF_SCORE_URLS.keys()) {
      send("appendPlayerScore", statusText(difficulty, false));
      await fetchScores(difficulty, scoreList);
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
    let url = BASE_URL;
    const queryParams = new URLSearchParams();
    const playerName = getPlayerName(document.body);
    if (playerName) {
      queryParams.set("playerName", playerName);
    }
    const query = queryParams.toString()
    if (query) {
      url += "?" + query;
    }
    window.open(url, "selfRating");
    window.addEventListener("message", (evt) => {
      console.log(evt.origin, evt.data);
      if (ALLOWED_ORIGINS.includes(evt.origin)) {
        if (evt.data === "ready") {
          fetchSelfRecords(getPostMessageFunc(evt.source as WindowProxy, evt.origin));
        }
      }
    });
  }

  main();
})();
