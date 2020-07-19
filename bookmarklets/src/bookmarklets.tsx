import React from 'react';

import {LANG} from './i18n';

export interface Bookmarklet {
  itemTitle: string;
  feature: string;
  howTo: string | (() => JSX.Element);
  screenshotUrl: string;
  scriptUrl: string;
}

function getBookmarkletLink(scriptUrl: string, path?: string, strictPathMatch?: boolean) {
  const pathCheck = path
    ? strictPathMatch
      ? " && d.location.pathname==='" + path + "'"
      : " && d.location.pathname.indexOf('" + path + "')>=0"
    : "";
  let js = `javascript:void (function(d){if (
['maimaidx-eng.com','maimaidx.jp'].indexOf(d.location.host)>=0
${pathCheck}
){var s=d.createElement('script');
s.src='${scriptUrl}?t='+Math.floor(Date.now()/60000);
d.body.append(s);
}})(document)`;
  return js;
}

export const scoreConverter: Bookmarklet = {
  itemTitle: {
    zh: "新舊版分數轉換 & 分析",
    en: "Convert DX score to old score system",
  }[LANG],
  feature: {
    zh: "功能：可轉換 DX 達成率為舊版計分方式，以及分析各指令扣分比例。",
    en: "Feature: Convert DX achievement to old achievement (maimai FiNALE & older), and analyze score penalty by note type.",
  }[LANG],
  howTo: {
    zh: "使用方式：登入 maimai NET，點選最近遊玩的其中一筆紀錄後執行。執行後會開啟新分頁，顯示舊版成績以及相關數據。",
    en: "Usage: Log in to maimai NET. Open a recent song record and execute the bookmarklet."
  }[LANG],
  scriptUrl: getBookmarkletLink(
    "https://myjian.github.io/mai-tools/scripts/score-converter.js",
    "/maimai-mobile/record/playlogDetail/"
  ),
  screenshotUrl: "./screenshots/convert-to-finale-score-20200718.jpg",
};

export const scoreSorter: Bookmarklet = {
  itemTitle: {
    zh: "排序成績",
    en: "Sort scores"
  }[LANG],
  feature: {
    zh: "功能：可依照等級、Rank、AP/FC 狀態排序成績。",
    en: "Feature: Sort scores by level, rank, or AP/FC status.",
  }[LANG],
  howTo: {
    zh: "使用方式：於分類查詢成績頁執行。執行完後畫面上會出現選單，可按自己喜歡的方式排序。",
    en: "Usage: Open historical scores (by genre, level, song title, version, etc.) and execute the bookmarklet.",
  }[LANG],
  scriptUrl: getBookmarkletLink(
    "https://myjian.github.io/mai-tools/scripts/score-sort.js",
    "/maimai-mobile/record/music"
  ),
  screenshotUrl: "./screenshots/score-sort-20200630.png",
};

export const recentPlaySummary: Bookmarklet = {
  itemTitle: {
    zh: "整理最近遊玩紀錄",
    en: "Recent play summary",
  }[LANG],
  feature: {
    zh: "功能：以表格方式整理最近的遊玩紀錄，並將遊戲時間修正為當地時間。",
    en: "Feature: Organize recent game records into a condensed table."
  }[LANG],
  howTo: {
    zh: "使用方式：於最近成績列表執行。執行後會在頁面中產生表格，可以選取日期和排序。",
    en: "Usage: Open the recent game records list and execute the bookmarklet.",
  }[LANG],
  scriptUrl: getBookmarkletLink(
    "https://myjian.github.io/mai-tools/scripts/recent-play-downloader.js",
    "/maimai-mobile/record/",
    true
  ),
  screenshotUrl: "./screenshots/recent-play-summary-20200704.png",
};

export const ratingAnalyzer: Bookmarklet = {
  itemTitle: {
    zh: "分析 DX Rating",
    en: "Analyze DX Rating",
  }[LANG],
  feature: {
    zh: "功能：可分析玩家的 DX Rating 組成。",
    en: "Feature: Analyze player's DX Rating composition."
  }[LANG],
  howTo: {
    zh: "使用方式：於 maimai NET 首頁或個人檔案頁面執行。執行時會開新分頁，載入成績並進行分析。",
    en: "Usage: Execute the bookmarklet on maimai NET home page or player data page.",
  }[LANG],
  scriptUrl: getBookmarkletLink(
    "https://myjian.github.io/mai-tools/scripts/analyze-rating-in-newtab.js"
  ),
  screenshotUrl: "./screenshots/rating-analyzer-20200702.png",
};

const scoreDownloaderUsageText = {
  en: {
    part1: 'Usage: Execute the bookmarklet on maimai NET home page. After several seconds, a "Copy" button will appear on screen. Click the Copy button to copy scores. You can paste them in Excel, Google Sheets, or ',
    ratingAnalyzer: "Rating Analyzer",
    part2: ".",
  },
  zh: {
    part1: "使用方式：於 maimai NET 首頁執行。執行完後點下畫面上的「複製」按鈕就能複製所有成績。複製後可貼到 Excel、Google 試算表，或是 ",
    ratingAnalyzer: "R 值分析工具",
    part2: "。",
  },
}[LANG];

export const scoreDownloader: Bookmarklet = {
  itemTitle: {
    zh: "下載所有歌曲成績",
    en: "Download all scores",
  }[LANG],
  feature: {
    zh: "功能：下載所有白譜、紫譜、紅譜、黃譜的成績。可用於個人紀錄或是 R 值分析。",
    en: "Feature: Download all ADVANCED, EXPERT, MASTER, and Re:MASTER scores.",
  }[LANG],
  howTo: () => (
    <React.Fragment>
      {scoreDownloaderUsageText.part1}
      <a href="/mai-tools/rating-calculator/" target="_blank">
        {scoreDownloaderUsageText.ratingAnalyzer}
      </a>
      {scoreDownloaderUsageText.part2}
    </React.Fragment>
  ),
  scriptUrl: getBookmarkletLink("https://myjian.github.io/mai-tools/scripts/score-download.js"),
  screenshotUrl: "./screenshots/score-download-20200630.png",
};
