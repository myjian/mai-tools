import React, {useCallback} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    showPlayed: 'Show played charts',
    showNotPlayed: 'Show not yet played charts',
  },
  [Language.zh_TW]: {
    showPlayed: '顯示已玩過的譜面',
    showNotPlayed: '顯示未玩過的譜面',
  },
  [Language.ko_KR]: {
    showPlayed: '플레이한 채보 보기',
    showNotPlayed: '플레이 한 적 없는 채보 보기',
  },
};

interface Props {
  name: string; // e.g. old / new
  showPlayed: boolean;
  toggleShowPlayed: (showPlayed: boolean) => void;
}

export const CandidatesPlayedToggle = ({name, showPlayed, toggleShowPlayed}: Props) => {
  const handleRadioChange = useCallback(
    (evt: React.SyntheticEvent<HTMLInputElement>) => {
      toggleShowPlayed(evt.currentTarget.value === '1');
    },
    [toggleShowPlayed]
  );
  const messages = MessagesByLang[useLanguage()];

  return (
    <div className="w90">
      <form className="playedToggleForm">
        <label className="radioLabel">
          <input
            className="radioInput"
            name={`showPlayed-${name}`}
            value="1"
            type="radio"
            checked={showPlayed}
            onChange={handleRadioChange}
          />
          {messages.showPlayed}
        </label>
        <label className="radioLabel">
          <input
            className="radioInput"
            name={`showPlayed-${name}`}
            value="0"
            type="radio"
            checked={!showPlayed}
            onChange={handleRadioChange}
          />
          {messages.showNotPlayed}
        </label>
      </form>
    </div>
  );
};
