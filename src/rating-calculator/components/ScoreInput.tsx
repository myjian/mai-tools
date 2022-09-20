import React from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    scoreInputHeading: "Player Scores",
    scoreInputDescPrefix:
      'Please use "Analyze Self DX Rating" or "Analyze Friend\'s DX Rating" from ',
    bookmarketLinkLabel: "maimai bookmarklets",
    scoreInputDescSuffix: " to fill in this field.",
  },
  [Language.zh_TW]: {
    scoreInputHeading: "玩家成績輸入",
    scoreInputDescPrefix: "請用 ",
    bookmarketLinkLabel: "maimai 書籤小工具",
    scoreInputDescSuffix: " 中的「分析自己 DX Rating」或「分析好友 DX Rating」填入此欄。",
  },
};

export const ScoreInput = React.forwardRef<HTMLTextAreaElement>((_, textareaRef) => {
  const messages = MessagesByLang[useLanguage()];
  return (
    <div className="w90">
      <h2 className="scoreInputHeading">{messages.scoreInputHeading}</h2>
      <div>
        {messages.scoreInputDescPrefix}
        <a href="../#bookmarklets" target="_blank">
          {messages.bookmarketLinkLabel}
        </a>
        {messages.scoreInputDescSuffix}
      </div>
      <textarea className="scoreInputArea" ref={textareaRef}></textarea>
    </div>
  );
});
