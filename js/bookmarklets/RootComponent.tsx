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
    intro1:
      "以下各標題的連結都是書籤小工具，必須在 maimai NET 上打開才有效果。如果沒使用過書籤小工具，請先閱讀 ",
    faq: "常見問題",
    intro2: "。",
  },
  en: {
    intro1:
      "The link for each section title is a bookmarklet. Bookmarklet works only when they are opened on maimai NET. If you never used bookmarklets before, read ",
    faq: "FAQ",
    intro2: " first.",
  },
}[LANG];

export const RootComponent: React.FC = () => (
  <React.Fragment>
    <h2>{PAGE_TITLE}</h2>
    <p>
      {IntroText.intro1}
      <a href="#faq">{IntroText.faq}</a>
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
        <h2 id="faq">{IntroText.faq}</h2>
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
