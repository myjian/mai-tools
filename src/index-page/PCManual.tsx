import React from 'react';

import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';
import {BOOKMARKLET_LINK, LinkNameByLang} from './all-bookmarklets';

const MessagesByLang = {
  [Language.zh_TW]: {
    title: "在電腦上怎麼新增和使用書籤？",
    showBookmarksBar: "顯示瀏覽器的書籤列。",
    create: "把下方連結拖曳到書籤列，書籤小工具就建立完成了。",
    use: "使用時，先登入 maimai NET 並進入要使用書籤的頁面後，再點擊書籤。",
  },
  [Language.en_US]: {
    title: "How to create and execute bookmarklets on PC?",
    showBookmarksBar: "Show bookmarks bar (or favorites bar) in browser.",
    create:
      "Drag the link into the bookmarks bar to save the bookmarklet. (MMBL stands for MaiMai BookmarkLets)",
    use: "To use the bookmarklet, log in to maimai DX NET and open the page you want to use the bookmarklet on, and then click the bookmarklet in bookmarks bar.",
  },
};

export const PCManual = () => {
  const lang = useLanguage();
  const messages = MessagesByLang[lang];
  return (
    <React.Fragment>
      <h3>● {messages.title}</h3>
      <div>
        <p>{messages.showBookmarksBar}</p>
        <p>
          {messages.create}
          <br />
          <a className="bookmarkletCopy" href={BOOKMARKLET_LINK}>
            {LinkNameByLang[lang]}
          </a>
        </p>
        <p>{messages.use}</p>
      </div>
    </React.Fragment>
  );
};
