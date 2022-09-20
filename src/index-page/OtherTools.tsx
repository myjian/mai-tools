import React from 'react';

import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';

const UIMessages = {
  [Language.zh_TW]: {
    otherToolsTitle: "其他工具 (不透過書籤使用的工具)",
    dxAchievement: "轉換舊筐分數為 DX 達成率",
    ratingVisualizer: "單曲 R 值圖表",
  },
  [Language.en_US]: {
    otherToolsTitle: "Other tools (these are not part of bookmarklets)",
    dxAchievement: "Convert FiNALE score to DX achievement",
    ratingVisualizer: "Rating Lookup Table & Visualization",
  },
};

export const OtherTools = () => {
  const messages = UIMessages[useLanguage()];
  return (
    <div className="otherToolsContainer">
      <hr className="sectionSep" />
      <h2 className="otherToolsHeading">{messages.otherToolsTitle}</h2>
      <ul>
        <li className="toolItem">
          <a href="./rating-visualizer/" target="_blank">
            {messages.ratingVisualizer}
          </a>
        </li>
        <li className="toolItem">
          <a href="./dx-achievement/" target="_blank">
            {messages.dxAchievement}
          </a>
        </li>
      </ul>
    </div>
  );
};
