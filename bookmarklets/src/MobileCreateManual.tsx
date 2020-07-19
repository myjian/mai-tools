import React from 'react';

import {LANG} from './i18n';

const UIString = {
  zh: {
    title: "在手機上怎麼新增書籤？",
    desc:
      "最簡單的方式，是先在電腦上新增書籤，再同步到手機上。如果不方便用電腦，請依照你使用的瀏覽器參考以下步驟。",
    chrome1: "長按並複製連結網址",
    chrome2: "打開瀏覽器右上角的選單，按星星把此頁加入書籤",
    chrome3: "畫面下方會顯示「已加入書籤」，點右邊「編輯」",
    chrome4: "把網址完全刪除，並貼上剛才複製的連結",
    fx1: "長按連結",
    fx2: "選取「將鏈結加入書籤」",
  },
  en: {
    title: "How to create bookmarklet on phone?",
    desc:
      "Easiest way is to create the bookmarklet on PC and sync it to the phone. If it does not work, try the following steps for your browser.",
    chrome1: "Long press and copy the bookmarklet link",
    chrome2: "Tap the browser menu and tap the star to add current page to bookmarks.",
    chrome3: 'Screen bottom will show "Bookmarked". Tap the "Edit" link next to it.',
    chrome4: "Replace the URL with what you copied earlier.",
    fx1: "Long press the bookmarklet.",
    fx2: 'Select "Bookmark Link"',
  },
}[LANG];

export const MobileCreateManual: React.FC = () => (
  <React.Fragment>
    <h3>● {UIString.title}</h3>
    <div>
      <p>{UIString.desc}</p>
      <p>Chrome:</p>
      <ol>
        <li>{UIString.chrome1}</li>
        <li>{UIString.chrome2}</li>
        <li>{UIString.chrome3}</li>
        <li>{UIString.chrome4}</li>
      </ol>

      <p>Firefox:</p>
      <ol>
        <li>{UIString.fx1}</li>
        <li>{UIString.fx2}</li>
      </ol>
    </div>
  </React.Fragment>
);
