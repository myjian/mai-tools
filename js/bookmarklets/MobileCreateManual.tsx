import React from 'react';

import {LANG} from '../common/lang';
import {BOOKMARKLET_LINK, LINK_NAME} from './bookmarklets';

const UIString = {
  zh: {
    title: "在手機上怎麼新增書籤？",
    desc:
      "最簡單的方式，是先在電腦上新增書籤，再同步到手機上。如果不方便用電腦，請使用 Google Chrome 瀏覽器並執行以下步驟。",
    chrome1: "複製連結 (點我！)",
    chrome2: "打開瀏覽器右上角的選單，按星星把此頁加入書籤",
    chrome3: "畫面下方會顯示「已加入書籤」，點右邊「編輯」",
    chrome4: "把網址完全刪除，並貼上剛才複製的連結",
    chrome5: `把書籤的名稱設成「${LINK_NAME}」（MMBL 是 MaiMai BookmarkLets 的縮寫，我們接下來會用到）`,
    chrome6: "返回上一頁，書籤即建立完成",
    chrome7: "書籤建立之後可以重複使用，不需要再回到這個網頁複製連結",
  },
  en: {
    title: "How to create bookmarklet on phone?",
    desc:
      "Easiest way is to create the bookmarklet on PC and sync it to the phone. If it does not work, try the following steps for your browser.",
    chrome1: "Copy the bookmarklet link (click me!)",
    chrome2: "Tap the browser menu and tap the star to add current page to bookmarks.",
    chrome3: 'Screen bottom will show "Bookmarked". Tap the "Edit" link next to it.',
    chrome4: "Replace the URL with what you copied earlier.",
    chrome5: `Set the bookmarklet name to "${LINK_NAME}".`,
    chrome6: "Go back to previous page and the bookmarklet should be ready to use.",
    chrome7:
      "Once you set up the bookmarklet, you can use them repeatedly. You don't need to come back to this page to copy links.",
  },
}[LANG];

export class MobileCreateManual extends React.PureComponent {
  private inputRef = React.createRef<HTMLInputElement>();

  render() {
    return (
      <React.Fragment>
        <h3>● {UIString.title}</h3>
        <div>
          <p>{UIString.desc}</p>
          <ol>
            <li>
              <a
                href="javascript:void(0)"
                onClick={this.copyLink}
                onTouchStart={this.setPageTitle}
                onContextMenu={this.setPageTitle}
              >
                {UIString.chrome1}
              </a>
              <input
                className="bookmarkletScript"
                ref={this.inputRef}
                value={BOOKMARKLET_LINK}
                readOnly
              />
            </li>
            <li>{UIString.chrome2}</li>
            <li>{UIString.chrome3}</li>
            <li>{UIString.chrome4}</li>
            <li>{UIString.chrome5}</li>
            <li>{UIString.chrome6}</li>
            <li>{UIString.chrome7}</li>
          </ol>
        </div>
      </React.Fragment>
    );
  }

  private copyLink = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (this.inputRef.current) {
      this.setPageTitle();
      const t = this.inputRef.current;
      t.select();
      document.execCommand("copy");
    }
  };

  private setPageTitle() {
    document.title = LINK_NAME;
  }
}
