import React, {useCallback, useState} from 'react';

import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    internalLvHeading: "Chart Internal Level Data",
    manualLv: "Manual input",
    autoLv: "Automatic",
  },
  [Language.zh_TW]: {
    internalLvHeading: "譜面定數",
    manualLv: "手動輸入",
    autoLv: "自動代入",
  },
  [Language.ko_KR]: {
    internalLvHeading: "채보 상수 데이터",
    manualLv: "직접입력",
    autoLv: "자동입력",
  },
};

export const InternalLvInput = React.forwardRef<HTMLTextAreaElement>((_, textareaRef) => {
  const [showTextarea, setShowTextarea] = useState(false);

  const handleRadioChange = useCallback((evt: React.FormEvent<HTMLInputElement>) => {
    setShowTextarea(evt.currentTarget.value === "1");
  }, []);

  const messages = MessagesByLang[useLanguage()];
  return (
    <div className="w90">
      <h2 className="lvInputHeading">{messages.internalLvHeading}</h2>
      <form>
        <label className="radioLabel">
          <input
            className="radioInput"
            name="showLvInput"
            value="0"
            type="radio"
            checked={!showTextarea}
            onChange={handleRadioChange}
          />
          {messages.autoLv}
        </label>
        <label className="radioLabel">
          <input
            className="radioInput"
            name="showLvInput"
            value="1"
            type="radio"
            checked={showTextarea}
            onChange={handleRadioChange}
          />
          {messages.manualLv}
        </label>
      </form>
      {showTextarea && <textarea className="lvInput" ref={textareaRef} />}
    </div>
  );
});
