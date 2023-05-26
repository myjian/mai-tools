import React, {useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    scoreInputHeading: 'Player Scores',
    scoreInputDescPrefix:
      'Please use "Analyze Self DX Rating" or "Analyze Friend\'s DX Rating" from ',
    bookmarketLinkLabel: 'maimai bookmarklets',
    scoreInputDescSuffix: ' to import scores.',
  },
  [Language.zh_TW]: {
    scoreInputHeading: '玩家成績輸入',
    scoreInputDescPrefix: '請用 ',
    bookmarketLinkLabel: 'maimai 書籤小工具',
    scoreInputDescSuffix: ' 中的「分析自己 DX Rating」或「分析好友 DX Rating」帶入資料。',
  },
  // TODO: update Korean translation
  [Language.ko_KR]: {
    scoreInputHeading: '플레이 기록',
    scoreInputDescPrefix: '아래 칸은 "',
    bookmarketLinkLabel: 'maimai 북마크',
    scoreInputDescSuffix:
      '의 "내 디럭스 레이팅 분석하기" 또는 "친구 디럭스 레이팅 분석하기"를 사용해서 채워주세요.',
  },
};

export const ScoreInput = () => {
  const messages = MessagesByLang[useLanguage()];
  const [isHidden, setHidden] = useState(false);
  const toggleHidden = () => {
    setHidden(!isHidden);
  };
  return (
    <div className="w90">
      <h2 className="scoreInputHeading" tabIndex={-1} onClick={toggleHidden}>
        {messages.scoreInputHeading}
      </h2>
      <div className={isHidden ? 'hidden' : ''}>
        {messages.scoreInputDescPrefix}
        <a href="../#bookmarklets" target="_blank">
          {messages.bookmarketLinkLabel}
        </a>
        {messages.scoreInputDescSuffix}
      </div>
    </div>
  );
};
