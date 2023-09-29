import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';
import {CommonMessages} from '../common-messages';

const MessagesByLang = {
  [Language.en_US]: {
    scoreInputHeading: 'Player Scores',
    scoreInputDescPrefix:
      'Please use "Analyze Self DX Rating" or "Analyze Friend\'s DX Rating" from ',
    bookmarketLinkLabel: 'maimai bookmarklets',
    scoreInputDescSuffix: ' to import scores.',
    example: 'example',
  },
  [Language.zh_TW]: {
    scoreInputHeading: '玩家成績輸入',
    scoreInputDescPrefix: '請用 ',
    bookmarketLinkLabel: 'maimai 書籤小工具',
    scoreInputDescSuffix: ' 中的「分析自己 DX Rating」或「分析好友 DX Rating」帶入資料。',
    example: '範例',
  },
  // TODO: update Korean translation
  [Language.ko_KR]: {
    scoreInputHeading: '플레이 기록',
    scoreInputDescPrefix: '아래 칸은 "',
    bookmarketLinkLabel: 'maimai 북마크',
    scoreInputDescSuffix:
      '의 "내 디럭스 레이팅 분석하기" 또는 "친구 디럭스 레이팅 분석하기"를 사용해서 채워주세요.',
    example: '예',
  },
};

export const ScoreInput = () => {
  const lang = useLanguage();
  const commonMessages = CommonMessages[lang];
  const messages = MessagesByLang[lang];
  const [showInput, setShowInput] = useState(false);
  const handleRadioChange = useCallback((evt: React.FormEvent<HTMLInputElement>) => {
    setShowInput(evt.currentTarget.value === '1');
  }, []);
  return (
    <div className="w90">
      <h2 className="scoreInputHeading">{messages.scoreInputHeading}</h2>
      <form className="scoreInputSelector">
        <label className="radioLabel">
          <input
            className="radioInput"
            name="showScoreInput"
            value="0"
            type="radio"
            checked={!showInput}
            onChange={handleRadioChange}
          />
          {commonMessages.autofill}
        </label>
        <label className="radioLabel">
          <input
            className="radioInput"
            name="showScoreInput"
            value="1"
            type="radio"
            checked={showInput}
            onChange={handleRadioChange}
          />
          {commonMessages.manualInput}
        </label>
      </form>
      <div className={showInput ? 'hidden' : ''}>
        {messages.scoreInputDescPrefix}
        <a href="../#bookmarklets" target="_blank">
          {messages.bookmarketLinkLabel}
        </a>
        {messages.scoreInputDescSuffix}
      </div>
      <div className={showInput ? '' : 'hidden'}>
        <div>
          {messages.scoreInputHeading}:{' '}
          <a href="https://gist.github.com/myjian/a978fda8821beca682ec3a726e17b780">
            {messages.example}
          </a>
        </div>
        <textarea id="playerScoresTextarea"></textarea>
      </div>
    </div>
  );
};
