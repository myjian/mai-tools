import React from 'react';

import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';

const MessagesByLang = {
  [Language.zh_TW]: {
    title: "在手機上怎麼使用書籤？",
    step1: "打開 Chrome，登入 maimai NET",
    step2: "進入想要使用書籤的頁面（例如：想要使用「分析自己 DX Rating」，就打開個人檔案的頁面）",
    step3: "點網址欄",
    chrome4: "把原本的網址刪除，再輸入「MMBL」",
    chrome5: "找到剛才新增的書籤（網址開頭會是 javascript），點下去",
    chrome6: "書籤執行完成後，網頁的內容應該會有小小的改變，也可能會開新分頁（例如 R 值分析）",
  },
  [Language.en_US]: {
    title: "How to execute bookmarklet on mobile?",
    step1: "Open Chrome and log in to maimai DX NET",
    step2:
      "Open the page on which you want to use the bookmarklet (e.g. if you want to analyze self DX Rating, open your Player's Data page)",
    step3: "Tap the URL field",
    chrome4: 'Delete the original URL and input "MMBL" into the URL field',
    chrome5:
      'Find and tap the bookmarklet you created earlier. The URL of the bookmarklet should start with "javascript".',
    chrome6: "You should notice the page has changed or new tab is opened (for rating analysis).",
  },
};

export const MobileUseManual = () => {
  const messages = MessagesByLang[useLanguage()];
  return (
    <React.Fragment>
      <h3>● {messages.title}</h3>
      <div>
        <ol>
          <li>{messages.step1}</li>
          <li>{messages.step2}</li>
          <li>{messages.step3}</li>
          <li>{messages.chrome4}</li>
          <li>{messages.chrome5}</li>
          <li>{messages.chrome6}</li>
        </ol>
      </div>
    </React.Fragment>
  );
};
