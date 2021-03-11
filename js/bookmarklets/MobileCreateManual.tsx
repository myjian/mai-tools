import React from 'react';

import {LANG} from '../common/lang';

const UIString = {
  zh: {
    title: "在手機上怎麼新增書籤？",
    desc:
      "最簡單的方式，是先在電腦上新增書籤，再同步到手機上。如果不方便用電腦，請依照你使用的瀏覽器參考以下步驟。",
    chrome1: "複製連結網址",
    chrome2: "打開瀏覽器右上角的選單，按星星把此頁加入書籤",
    chrome3: "畫面下方會顯示「已加入書籤」，點右邊「編輯」",
    chrome4: "把網址完全刪除，並貼上剛才複製的連結",
    chrome5:
      "檢查書籤的名稱是否符合這個小工具的功能（例如：你可能會希望書籤的名字是「分析自己 Rating」而不是「maimai 書籤小工具」）",
    chrome6: "返回上一頁，書籤即建立完成",
    chrome7: "重複以上步驟把每一個書籤都建立起來",
    chrome8: "書籤已建立之後可以重複使用，不需要再回到這個網頁複製連結",
  },
  en: {
    title: "How to create bookmarklet on phone?",
    desc:
      "Easiest way is to create the bookmarklet on PC and sync it to the phone. If it does not work, try the following steps for your browser.",
    chrome1: "Copy the bookmarklet link",
    chrome2: "Tap the browser menu and tap the star to add current page to bookmarks.",
    chrome3: 'Screen bottom will show "Bookmarked". Tap the "Edit" link next to it.',
    chrome4: "Replace the URL with what you copied earlier.",
    chrome5:
      'Check the bookmarklet name to see whether it matches the functionality (e.g. you may want to name it "Analyze Self Rating" instead of "maimai Bookmarklets").',
    chrome6: "Go back to previous page and the bookmarklet should be ready to use.",
    chrome7: "Repeat the steps above for every bookmarklet.",
    chrome8:
      "Once you set up the bookmarklets, you can use them repeatedly. You don't need to come back to this page nor copy links.",
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
        <li>{UIString.chrome5}</li>
        <li>{UIString.chrome6}</li>
        <li>{UIString.chrome7}</li>
        <li>{UIString.chrome8}</li>
      </ol>
    </div>
  </React.Fragment>
);
