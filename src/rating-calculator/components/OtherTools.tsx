import React from 'react';

import {DxVersion} from '../../common/game-version';
import {Language} from '../../common/lang';
import {useLanguage} from '../../common/lang-react';

const MessagesByLang = {
  [Language.en_US]: {
    otherToolsHeading: "Other Tools",
    ratingVisualizer: "Rating Lookup Table & Visualization",
    bookmarketList: "maimai Bookmarklets (Features & How to use)",
    otohime: "Otohime (Personal score tracking) by KOINU",
    mapDistanceCalc:
      "Map Distance Calculator (How many credits to a character/collection item) by 魚丸◎蕾娜",
  },
  [Language.zh_TW]: {
    otherToolsHeading: "其他工具",
    ratingVisualizer: "單曲 R 值圖表",
    bookmarketList: "書籤小工具介紹與設定教學",
    otohime: "Otohime - 音 Game 成績單網站 (由 KOINU 製作)",
    mapDistanceCalc: "ちほー道數計算器 (旅伴 & 收藏品) (由 魚丸◎蕾娜 製作)",
  },
};

function getMapDistanceCalcLink() {
  return "https://renawevin.weebly.com/rw-maimaidxsplash-chiho-calculate.html";
}

interface Props {
  gameVer: DxVersion;
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
          <a href="../bookmarklets/" target="_blank">
            {messages.bookmarketList}
          </a>
        </li>
        <li className="toolItem">
          <a href="https://maimai-songs.zetaraku.dev/" target="_blank">
            maimai-songs by Raku Zeta
          </a>
        </li>
        <li className="toolItem">
          <a href="https://otohi.me/" target="_blank">
            {messages.otohime}
          </a>
        </li>
        <li className="toolItem">
          <a href={getMapDistanceCalcLink()} target="_blank">
            {messages.mapDistanceCalc}
          </a>
        </li>
      </ul>
    </div>
  );
};
