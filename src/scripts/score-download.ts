import { Difficulty } from '../common/difficulties';
import { fetchScores, SELF_SCORE_URLS } from '../common/fetch-self-score';
import { getInitialLanguage, Language } from '../common/lang';
import { statusText } from '../common/score-fetch-progress';
import { handleError } from '../common/util';

(function () {
  const LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      pleaseLogIn: "請登入 maimai NET",
      fetch: "下載所有成績",
      copy: "複製成績",
      copied: "已複製到剪貼簿",
      allDone: "✅ 已匯入全部成績到文字框，請按「複製成績」把資料複製到剪貼簿。複製後可於 Excel 或 Google 試算表內貼上。",
    },
    [Language.en_US]: {
      pleaseLogIn: "Please log in to maimai DX NET.",
      fetch: "Load all scores",
      copy: "Copy",
      copied: "Copied to clipboard",
      allDone: '✅ All scores are loaded into text box. Click "Copy" to copy scores to clipboard. You can paste it in Excel or Google Sheets.',
    },
  }[LANG];

  function createOutputArea(container: HTMLElement): HTMLTextAreaElement {
    const dv = document.createElement("div");
    dv.id = "outputArea";
    dv.style.position = "relative";
    dv.style.marginBottom = "16px";

    const tx = document.createElement("textarea");
    tx.className = "f_10";
    tx.id = "outputText";
    dv.append(tx);

    const fetchBtn = document.createElement("button");
    fetchBtn.className = "m_r_5";
    fetchBtn.style.color = "#1477e6";
    fetchBtn.append(UIString.fetch);
    fetchBtn.addEventListener('click', handleStartDownload);

    const copyBtn = document.createElement("button");
    copyBtn.innerText = UIString.copy;
    for (let btn of [fetchBtn, copyBtn]) {
      btn.style.backgroundColor = "#9f51dc";
      btn.style.border = "2px solid black";
      btn.style.borderRadius = "5px";
      btn.style.color = "white";
      btn.style.fontWeight = "700";
      btn.style.padding = "8px 12px";
    }
    dv.append(fetchBtn, copyBtn);

    copyBtn.addEventListener("click", () => {
      tx.select();
      copyBtn.disabled = true;
      copyBtn.style.cursor = "default";
      copyBtn.style.filter = "grayscale(1.0)";
      document.execCommand("copy");
      copyBtn.innerText = UIString.copied;
      setTimeout(() => {
        copyBtn.disabled = false;
        copyBtn.style.cursor = "";
        copyBtn.style.filter = "";
        copyBtn.innerText = UIString.copy;
      }, 3000);
    });


    const res = document.createElement("div");
    res.className = "fetchStatus f_16 m_t_10";
    res.style.fontWeight = "700";
    res.style.color = "white";
    res.style.textShadow = "1px 1px 2px black";
    dv.append(res);

    container.insertAdjacentElement('afterend', dv);
    return tx;
  }

  async function fetchAllScores(onError: (msg: string) => void) {
    const host = location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      onError(UIString.pleaseLogIn);
      return;
    }
    const textarea = document.getElementById("outputText") as HTMLTextAreaElement;
    const scoreList: string[] = [];
    for (const difficulty of Object.keys(SELF_SCORE_URLS)) {
      textarea.value += statusText(LANG, difficulty, false) + "\n";
      await fetchScores(difficulty as Difficulty, scoreList);
    }
    textarea.value = scoreList.join("\n");
    (document.querySelector(".fetchStatus") as HTMLElement).innerText = UIString.allDone;
  }

  function handleStartDownload(evt: Event) {
    evt.preventDefault();
    fetchAllScores(handleError);
  }

  createOutputArea(document.querySelector(".see_through_block"));
})();
