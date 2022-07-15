import React, {useEffect} from 'react';

import {getInitialLanguage, Language} from '../common/lang';
import {LangContext} from '../common/lang-react';
import {BookmarkItem} from './BookmarkItem';
import {
  albumDownloadHelper,
  analyzeFriendRating,
  ratingAnalyzer,
  recentPlaySummary,
  scoreConverter,
  scoreDownloader,
  scoreSorter,
} from './bookmarklets';
import {MobileCreateManual} from './MobileCreateManual';
import {MobileUseManual} from './MobileUseManual';
import {PCManual} from './PCManual';

const UIMessages = {
  [Language.zh_TW]: {
    pageTitle: "maimai 書籤小工具介紹與設定教學",
    intro1: "如果想在 maimai DX NET 使用以下功能，請參照 ",
    howto: "使用教學",
    intro2: " 設定書籤小工具。",
    features: "功能介紹",
  },
  [Language.en_US]: {
    pageTitle: "maimai Bookmarklets (Features & How to use)",
    intro1: "If you want to use the following features, follow ",
    howto: "Instructions",
    intro2: " to set up the bookmarklet.",
    features: "Features",
  },
};

export const RootComponent = () => {
  const lang = getInitialLanguage();
  const messages = UIMessages[lang];
  useEffect(() => {
    document.title = messages.pageTitle;
  }, [lang]);

  return (
    <LangContext.Provider value={lang}>
      <h2>{messages.pageTitle}</h2>
      <p>
        {messages.intro1}
        <a href="#howto">{messages.howto}</a>
        {messages.intro2}
      </p>

      <div className="bookmarkletList">
        <BookmarkItem {...recentPlaySummary} />
        <BookmarkItem {...albumDownloadHelper} />
        <BookmarkItem {...ratingAnalyzer} />
        <BookmarkItem {...analyzeFriendRating} />
        <BookmarkItem {...scoreSorter} />
        <BookmarkItem {...scoreConverter} />
        <BookmarkItem {...scoreDownloader} />
        <br />
        <div>
          <h2 id="howto">{messages.howto}</h2>
          <PCManual />
          <MobileCreateManual />
          <MobileUseManual />
        </div>
      </div>
      <div className="footer credit">
        <hr />
        Made by{" "}
        <a href="https://github.com/myjian" target="_blank">
          myjian
        </a>
        .
      </div>
    </LangContext.Provider>
  );
};
