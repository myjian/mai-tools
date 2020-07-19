import React from 'react';

import {LANG} from './i18n';

const UIString = {
  zh: {
    title: "在電腦上怎麼新增和使用書籤？",
    create: "直接把連結拖曳到書籤列就能新增書籤。",
    use: "使用時，先登入 maimai NET 並進入指定的頁面後，再點擊書籤。",
  },
  en: {
    title: "How to create and execute bookmarklets on PC?",
    create: "Show bookmarks bar (or favorites bar) in browser. Drag the link into the bookmarks bar to save the bookmarklet. ",
    use: "To use the bookmarklet, log in to maimai DX NET and open the specific page for the bookmarklet, and then click the bookmarklet in bookmarks bar.",
  },
}[LANG];

export const PCManual: React.FC = () => (
  <React.Fragment>
    <h3>● {UIString.title}</h3>
    <div>
      <p>{UIString.create}</p>
      <p>{UIString.use}</p>
    </div>
  </React.Fragment>
);
