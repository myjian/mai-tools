import {fetchScores, SELF_SCORE_URLS} from '../js/common/fetch-self-score';
import {LANG} from '../js/common/lang';
import {statusText} from '../js/common/score-fetch-progress';
import {handleError} from '../js/common/util';

(function () {
  const UIString = {
    zh: {
      pleaseLogIn: "請登入 maimai NET",
      copy: "複製成績",
      copied: "已複製到剪貼簿",
      allDone: "✅ 全部成績下載完畢，請按網頁上的「複製成績」把資料複製到剪貼簿。",
    },
    en: {
      pleaseLogIn: "Please log in to maimai DX NET.",
      copy: "Copy",
      copied: "Copied to clipboard",
      allDone: '✅ All scores are downloaded. Click the "Copy" buton on the page to copy scores.',
    },
  }[LANG];
  function createOutputArea(container: HTMLElement) {
    const dv = document.createElement("div");
    dv.id = "outputArea";
    dv.style.position = "relative";
    dv.style.marginBottom = "16px";

    const tx = document.createElement("textarea");
    tx.id = "outputText";
    dv.append(tx);

    const btn = document.createElement("button");
    btn.innerText = UIString.copy;
    btn.style.backgroundColor = "#9f51dc";
    btn.style.border = "2px solid black";
    btn.style.borderRadius = "5px";
    btn.style.color = "white";
    btn.style.fontWeight = "700";
    btn.style.padding = "8px 12px";
    dv.append(btn);

    const res = document.createElement("span");
    res.className = "f_16";
    res.style.position = "absolute";
    res.style.left = "300px";
    res.style.bottom = "10px";
    res.style.fontWeight = "700";
    res.style.color = "#fff000";
    dv.append(res);

    btn.addEventListener("click", () => {
      tx.select();
      document.execCommand("copy");
      res.innerText = UIString.copied;
      setTimeout(() => {
        res.innerText = "";
      }, 5000);
    });

    container.append(dv);
    return tx;
  }

  async function fetchAllScores(onError: (msg: string) => void, onLog: (msg: string) => void) {
    const host = document.location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      onError(UIString.pleaseLogIn);
      return;
    }
    const scoreList: string[] = [];
    for (const difficulty of SELF_SCORE_URLS.keys()) {
      onLog(statusText(difficulty, false));
      await fetchScores(difficulty, scoreList);
      onLog(statusText(difficulty, true));
    }
    let textarea = document.getElementById("outputText") as HTMLTextAreaElement;
    if (!textarea) {
      textarea = createOutputArea(document.querySelector(".main_wrapper header"));
    }
    textarea.value = scoreList.join("\n");
    onLog(UIString.allDone);
  }

  function handleOutput(msg: string) {
    const comment = document.querySelector(".comment_block") as HTMLElement;
    if (comment) {
      comment.innerText = comment.innerText + msg + "\n";
    } else {
      console.log(msg);
    }
  }

  fetchAllScores(handleError, handleOutput);
})();
