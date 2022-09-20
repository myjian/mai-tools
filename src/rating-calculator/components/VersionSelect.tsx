import React, {useCallback} from 'react';

import {
  DxVersion,
  getVersionName,
  RATING_CALCULATOR_SUPPORTED_VERSIONS,
} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    gameVer: "Game version:",
  },
  [Language.zh_TW]: {
    gameVer: "遊戲版本：",
  },
};

interface Props {
  handleVersionSelect: (ver: DxVersion) => void;
  gameVer: DxVersion;
}

export const VersionSelect = ({gameVer, handleVersionSelect}: Props) => {
  const handleChange = useCallback(
    (evt: React.FormEvent<HTMLSelectElement>) => {
      handleVersionSelect(parseInt(evt.currentTarget.value));
    },
    [handleVersionSelect]
  );
  const messages = MessagesByLang[useLanguage()];
  return (
    <label>
      {messages.gameVer}
      <select className="gameVersion" onChange={handleChange} value={gameVer}>
        {RATING_CALCULATOR_SUPPORTED_VERSIONS.map((ver) => {
          const verStr = ver.toFixed(0);
          return (
            <option key={verStr} value={verStr}>
              {getVersionName(ver)}
            </option>
          );
        })}
      </select>
    </label>
  );
};
