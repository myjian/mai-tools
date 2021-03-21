import React from 'react';

import {LANG} from '../common/lang';
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
import {PAGE_TITLE} from './i18n';
import {MobileCreateManual} from './MobileCreateManual';
import {MobileUseManual} from './MobileUseManual';
import {PCManual} from './PCManual';

const IntroText = {
  zh: {
    intro1: "如果想在 maimai DX NET 使用以下功能，請參照 ",
    howto: "使用教學",
    intro2: " 設定書籤小工具。",
    features: "功能介紹",
  },
  en: {
    intro1: "If you want to use the following features, follow ",
    howto: "Instructions",
    intro2: " to set up the bookmarklet.",
    features: "Features",
  },
}[LANG];

export const RootComponent: React.FC = () => (
  <React.Fragment>
    <h2>{PAGE_TITLE}</h2>
    <p>
      {IntroText.intro1}
      <a href="#howto">{IntroText.howto}</a>
      {IntroText.intro2}
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
        <h2 id="howto">{IntroText.howto}</h2>
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
  </React.Fragment>
);
