import React, {useCallback, useRef} from 'react';

import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';
import {BOOKMARKLET_LINK, LinkNameByLang} from './bookmarklets';

const MessagesByLang = {
  [Language.zh_TW]: {
    title: "在手機上怎麼新增書籤？",
    desc: "最簡單的方式，是先在電腦上新增書籤，再同步到手機上。如果不方便用電腦，請使用 Google Chrome 瀏覽器並執行以下步驟。",
    chrome1: "複製連結 (點我！)",
    chrome2: "打開瀏覽器右上角的選單，按星星把此頁加入書籤",
    chrome3: "畫面下方會顯示「已加入書籤」，點右邊「編輯」",
    chrome4: "把網址完全刪除，並貼上剛才複製的連結",
    chrome5: `把書籤的名稱設成「${
      LinkNameByLang[Language.zh_TW]
    }」（MMBL 是 MaiMai BookmarkLets 的縮寫，我們接下來會用到）`,
    chrome6: "返回上一頁，書籤即建立完成",
    chrome7: "書籤建立之後可以重複使用，不需要再回到這個網頁複製連結",
  },
  [Language.en_US]: {
    title: "How to create bookmarklet on phone?",
    desc: "Easiest way is to create the bookmarklet on PC and sync it to the phone. If it does not work, try the following steps for your browser.",
    chrome1: "Copy the bookmarklet link (click me!)",
    chrome2: "Tap the browser menu and tap the star to add current page to bookmarks.",
    chrome3: 'Screen bottom will show "Bookmarked". Tap the "Edit" link next to it.',
    chrome4: "Replace the URL with what you copied earlier.",
    chrome5: `Set the bookmarklet name to "${LinkNameByLang[Language.en_US]}".`,
    chrome6: "Go back to previous page and the bookmarklet should be ready to use.",
    chrome7:
      "Once you set up the bookmarklet, you can use them repeatedly. You don't need to come back to this page to copy links.",
  },
};

export const MobileCreateManual = () => {
  const inputRef = useRef<HTMLInputElement>();
  const lang = useLanguage();

  const setPageTitle = useCallback(() => {
    document.title = LinkNameByLang[lang];
  }, []);

  const copyLink = useCallback((evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (inputRef.current) {
      setPageTitle();
      const t = inputRef.current;
      t.select();
      document.execCommand("copy");
    }
  }, []);

  const messages = MessagesByLang[lang];
  return (
    <React.Fragment>
      <h3>● {messages.title}</h3>
      <div>
        <p>{messages.desc}</p>
        <ol>
          <li>
            <a
              href="javascript:void(0)"
              onClick={copyLink}
              onTouchStart={setPageTitle}
              onContextMenu={setPageTitle}
            >
              {messages.chrome1}
            </a>
            <input className="bookmarkletScript" ref={inputRef} value={BOOKMARKLET_LINK} readOnly />
          </li>
          <li>{messages.chrome2}</li>
          <li>{messages.chrome3}</li>
          <li>{messages.chrome4}</li>
          <li>{messages.chrome5}</li>
          <li>{messages.chrome6}</li>
          <li>{messages.chrome7}</li>
        </ol>
      </div>
    </React.Fragment>
  );
};
