import React from 'react';

import {MAIMAI_SONGS_HOME} from '../../common/arcade-songs';
import {GameVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    otherToolsHeading: 'Other Tools',
    ratingVisualizer: 'Rating Lookup Table & Visualization',
    bookmarketList: 'maimai Bookmarklets (Features & How to use)',
    arcadeSongs: 'arcade-songs (Song searching tool) by Raku Zeta',
    otohime: 'Otohime (Personal score tracking) by KOINU',
    mapDistanceCalc:
      'Map Distance Calculator (How many credits to a character/collection item) by 魚丸◎蕾娜',
  },
  [Language.zh_TW]: {
    otherToolsHeading: '其他工具',
    ratingVisualizer: '單曲 R 值圖表',
    bookmarketList: '書籤小工具介紹與設定教學',
    arcadeSongs: '音樂遊戲歌曲搜尋工具 arcade-songs (由 Raku Zeta 製作)',
    otohime: 'Otohime - 音 Game 成績單網站 (由 KOINU 製作)',
    mapDistanceCalc: 'ちほー道數計算器 (旅伴 & 收藏品) (由 魚丸◎蕾娜 製作)',
  },
  [Language.ko_KR]: {
    otherToolsHeading: '다른 도구',
    ratingVisualizer: '레이팅 상수 표 & 시각화',
    bookmarketList: 'maimai 북마크 (기능 & 사용법)',
    arcadeSongs: 'arcade-songs (노래 검색기) by Raku Zeta',
    otohime: 'Otohime - (개인 레이팅 추적기) by KOINU',
    mapDistanceCalc:
      '지방 거리 계산기 (특정 캐릭터, 아이템 소장을 위해서 몇 코인 더 부어야 하는지) by 魚丸◎蕾娜',
  },
};

interface Props {
  gameVer: GameVersion;
}

export const OtherTools = ({gameVer}: Props) => {
  const messages = MessagesByLang[useLanguage()];
  const visualizerLink = `../rating-visualizer/?gameVer=${gameVer}`;
  return (
    <div className="otherToolsContainer">
      <hr className="sectionSep" />
      <h2 className="otherToolsHeading">{messages.otherToolsHeading}</h2>
      <ul>
        <li className="toolItem">
          <a href={visualizerLink} target="_blank">
            {messages.ratingVisualizer}
          </a>
        </li>
        <li className="toolItem">
          <a href=".." target="_blank">
            {messages.bookmarketList}
          </a>
        </li>
        <li className="toolItem">
          <a href={MAIMAI_SONGS_HOME} target="_blank">
            {messages.arcadeSongs}
          </a>
        </li>
        <li className="toolItem">
          <a href="https://otohi.me/" target="_blank">
            {messages.otohime}
          </a>
        </li>
        <li className="toolItem">
          <a
            href="https://renawevin.weebly.com/rw-maimaidxsplash-chiho-calculate.html"
            target="_blank"
          >
            {messages.mapDistanceCalc}
          </a>
        </li>
      </ul>
    </div>
  );
};
