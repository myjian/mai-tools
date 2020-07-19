import {fetchPage, fetchScores, handleError, LANG, SCORE_URLS, statusText} from './shared/util';

(function () {
  const UIString = {
    zh: {
      pleaseLogIn: "請登入 maimai NET",
    },
    en: {
      pleaseLogIn: "Please log in to maimai DX NET.",
    },
  }[LANG];

  function postMessageToTab(tab: WindowProxy, action: string, text: string) {
    const obj = {action: action, payload: text};
    tab.postMessage(obj, "https://myjian.github.io");
  }

  async function fetchGameVersion(dom: Document | HTMLElement): Promise<string> {
    const gameVer = dom.querySelector(
      "select[name=version] option:last-of-type"
    ) as HTMLOptionElement;
    if (gameVer) {
      return gameVer.value;
    }
    dom = await fetchPage("/maimai-mobile/record/musicVersion/");
    return fetchGameVersion(dom);
  }

  function fetchPlayerGrade(dom: Document | HTMLElement) {
    const gradeImg = dom.querySelector(".user_data_block_line ~ img.h_25") as HTMLImageElement;
    if (gradeImg) {
      const gradeIdx = gradeImg.src.lastIndexOf("grade_");
      return gradeImg.src.substring(gradeIdx + 6, gradeIdx + 8);
    }
    return null;
  }

  async function fetchRatingInput(tab: WindowProxy, onError: (msg: string) => void) {
    const host = document.location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      onError(UIString.pleaseLogIn);
      return;
    }
    // Fetch DX version
    const gameVer = await fetchGameVersion(document.body);
    postMessageToTab(tab, "gameVersion", gameVer);
    // Fetch player grade
    const playerGrade = fetchPlayerGrade(document.body);
    if (playerGrade) {
      postMessageToTab(tab, "playerGrade", playerGrade);
    }
    // Fetch all scores
    const scoreList: string[] = [];
    for (const [difficulty, url] of SCORE_URLS) {
      postMessageToTab(tab, "appendPlayerScore", statusText(difficulty, false));
      await fetchScores(url, scoreList);
      postMessageToTab(tab, "appendPlayerScore", statusText(difficulty, true));
    }
    postMessageToTab(tab, "replacePlayerScore", "");
    for (let i = 0; i < scoreList.length; i += 50) {
      postMessageToTab(tab, "appendPlayerScore", scoreList.slice(i, i + 50).join("\n"));
    }
    postMessageToTab(tab, "calculateRating", "");
  }

  const newtab = window.open("https://myjian.github.io/mai-tools/rating-calculator/", "ratingcalc");
  window.addEventListener("message", (evt) => {
    console.log(evt.origin, evt.data);
    if (evt.origin === "https://myjian.github.io") {
      if (evt.data === "ready") {
        fetchRatingInput(newtab, handleError);
      }
    }
  });
})();
