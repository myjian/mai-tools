import React from 'react';

import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';
import {ALL_BOOKMARKLETS} from './all-bookmarklets';
import {BookmarkItem} from './BookmarkItem';
import {MobileCreateManual} from './MobileCreateManual';
import {MobileUseManual} from './MobileUseManual';
import {PCManual} from './PCManual';

const UIMessages = {
  [Language.zh_TW]: {
    title: 'maimai 書籤小工具介紹與設定教學',
    intro1: '如果想在 maimai DX NET 使用以下功能，請參照 ',
    howto: '使用教學',
    intro2: ' 設定書籤小工具。',
    features: '功能介紹',
  },
  [Language.en_US]: {
    title: 'maimai Bookmarklets (Features & How to use)',
    intro1: 'If you want to use the following features, follow ',
    howto: 'Instructions',
    intro2: ' to set up the bookmarklet.',
    features: 'Features',
  },
  [Language.ko_KR]: {
    title: 'maimai 책갈피 (기능 및 사용법)',
    intro1: 'maimai DX NET 에서 해당 기능을 사용하고 싶으면 아래 적힌 ',
    howto: '사용법',
    intro2: '을 따라주세요.',
    features: '기능',
  },
};

export const Bookmarklets = () => {
  const messages = UIMessages[useLanguage()];
  // NOTE: id is used by other pages to link to this section. Do not remove.
  return (
    <div id="bookmarklets">
      <h2>{messages.title}</h2>
      <p>
        {messages.intro1}
        <a href="#howto">{messages.howto}</a>
        {messages.intro2}
      </p>

      <div className="bookmarkletList">
        {ALL_BOOKMARKLETS.map((bookmarklet, idx) => (
          <BookmarkItem key={idx} {...bookmarklet} />
        ))}
        <br />
        <div>
          <h2 id="howto">{messages.howto}</h2>
          <PCManual />
          <MobileCreateManual />
          <MobileUseManual />
        </div>
      </div>
    </div>
  );
};
