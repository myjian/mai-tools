import React from 'react';

import {LANG} from '../common/lang';
import {BOOKMARKLET_LINK, LINK_NAME} from './bookmarklets';

const UIString = {
  zh: {
    title: "在電腦上怎麼新增和使用書籤？",
    showBookmarksBar: "顯示瀏覽器的書籤列。",
    create: "把下方連結拖曳到書籤列，書籤小工具就建立完成了。",
    use: "使用時，先登入 maimai NET 並進入要使用書籤的頁面後，再點擊書籤。",
  },
  en: {
    title: "How to create and execute bookmarklets on PC?",
    showBookmarksBar: "Show bookmarks bar (or favorites bar) in browser.",
    create:
      "Drag the link into the bookmarks bar to save the bookmarklet. (MMBL stands for MaiMai BookmarkLets)",
    use:
      "To use the bookmarklet, log in to maimai DX NET and open the page you want to use the bookmarklet on, and then click the bookmarklet in bookmarks bar.",
  },
}[LANG];

export const PCManual: React.FC = () => {
  return (
    <React.Fragment>
      <h3>● {UIString.title}</h3>
      <div>
        <p>{UIString.showBookmarksBar}</p>
        <p>
          {UIString.create}
          <br />
          <a className="bookmarkletCopy" href={BOOKMARKLET_LINK}>
            {LINK_NAME}
          </a>
        </p>
        <p>{UIString.use}</p>
      </div>
    </React.Fragment>
  );
};
