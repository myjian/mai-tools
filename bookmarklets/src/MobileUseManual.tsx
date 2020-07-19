import React from 'react';

import {LANG} from './i18n';

const UIString = {
  zh: {
    title: "在手機上怎麼使用書籤？",
    step1: "登入 maimai NET 並進入指定的頁面後",
    step2: "點網址欄",
    chrome3: "把原本的網址刪除，再輸入書籤名稱的開頭前幾個字",
    chrome4: "找到剛才新增的書籤（網址開頭應該要是 javascript），點下去",
    fx3: "選「行動書籤」",
    fx4: "找到剛才新增的書籤，點下去。",
  },
  en: {
    title: "How to execute bookmarklet on phone?",
    step1: "Log in to maimai NET and open the specific page for the bookmarklet.",
    step2: "Tap the URL field.",
    chrome3: "Input the first few characters of the bookmarklet name.",
    chrome4:
      'Find and tap the bookmarklet you created earlier. The URL of the bookmarklet should start with "javascript".',
    fx3: 'Tap "BOOKMARKS".',
    fx4: "Find the bookmarklet you created earlier and tap it.",
  },
}[LANG];

export const MobileUseManual: React.FC = () => (
  <React.Fragment>
    <h3>● {UIString.title}</h3>
    <div>
      <p>Chrome:</p>
      <ol>
        <li>{UIString.step1}</li>
        <li>{UIString.step2}</li>
        <li>{UIString.chrome3}</li>
        <li>{UIString.chrome4}</li>
      </ol>

      <p>Firefox:</p>
      <ol>
        <li>{UIString.step1}</li>
        <li>{UIString.step2}</li>
        <li>{UIString.fx3}</li>
        <li>{UIString.fx4}</li>
      </ol>
    </div>
  </React.Fragment>
);
