import React, {useCallback} from 'react';

import {GameRegion} from '../../common/game-region';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    gameVer: 'Game region:',
    japan: 'Japan',
    international: 'International',
  },
  [Language.zh_TW]: {
    gameVer: '遊戲區域：',
    japan: '日本',
    international: '國際',
  },
  [Language.ko_KR]: {
    gameVer: '게임 지역：',
    japan: '일본',
    international: '국제',
  },
};

interface Props {
  handleRegionSelect: (ver: GameRegion) => void;
  gameRegion: GameRegion;
}

export const RegionSelect = ({gameRegion, handleRegionSelect}: Props) => {
  const handleChange = useCallback(
    (evt: React.FormEvent<HTMLSelectElement>) => {
      const region = evt.currentTarget.value as GameRegion;
      handleRegionSelect(region);
    },
    [handleRegionSelect]
  );
  const messages = MessagesByLang[useLanguage()];
  return (
    <tr>
      <td>
        <label htmlFor="regionSelect">{messages.gameVer}</label>
      </td>
      <td>
        <select id="regionSelect" onChange={handleChange} value={gameRegion}>
          <option value={GameRegion.Jp}>{messages.japan}</option>
          <option value={GameRegion.Intl}>{messages.international}</option>
        </select>
      </td>
    </tr>
  );
};
