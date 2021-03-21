import React from 'react';

import {LANG} from '../common/lang';

const ALL_IN_ONE_SCRIPT = "https://myjian.github.io/mai-tools/scripts/all-in-one.js";
// const ALL_IN_ONE_SCRIPT = "http://localhost:8080/scripts/all-in-one.js";

export const BOOKMARKLET_LINK = `javascript:void (
  function(d) {
    if (['maimaidx-eng.com','maimaidx.jp'].indexOf(d.location.host) >= 0) {
      vars = d.createElement('script');
      s.src='${ALL_IN_ONE_SCRIPT}?t=' + Math.floor(Date.now() / 60000);
      d.body.append(s);
    }
  }
)(document)`
  .replace(/[\n ]/g, "")
  .replace("vars", "var s");

export const LINK_NAME = {
  zh: "maimai 書籤小工具合集 (MMBL)",
  en: "maimai bookmarklets (MMBL)",
}[LANG];

export interface Bookmarklet {
  itemTitle: string;
  feature: string;
  howTo: string | (() => JSX.Element);
  screenshotUrl: string;
}

export const scoreConverter: Bookmarklet = {
  itemTitle: {
    zh: "換算成舊版達成率 & 分析",
    en: "Convert DX score to old score system",
  }[LANG],
  feature: {
    zh: "功能：可轉換 DX 達成率為舊版 (maimai FiNALE) 計分方式，以及分析各指令扣分比例。",
    en:
      "Feature: Convert DX achievement to old achievement (maimai FiNALE & older), and analyze score penalty by note type.",
  }[LANG],
  howTo: {
    zh:
      "使用方式：登入 maimai NET，點選最近遊玩的其中一筆紀錄後執行。執行後會開啟新分頁，顯示舊版成績以及相關數據。點擊地點（Cafe MiLK）可切換計分方式，點擊達成率可切換詳細顯示。",
    en:
      'Usage: Log in to maimai NET. Open a recent song record and execute the bookmarklet. New tab will open and display score in old achievement system. You can click on "Cafe MiLK" to switch to DX achievement, and click on the achievement % to see how much percentage was lost per note type.',
  }[LANG],
  screenshotUrl: "./screenshots/convert-to-finale-score-20200718.jpg",
};

export const scoreSorter: Bookmarklet = {
  itemTitle: {
    zh: "排序成績",
    en: "Sort scores",
  }[LANG],
  feature: {
    zh: "功能：可依照達成率、AP/FC 成就、Sync 進度或譜面等級，排序自己或好友的成績。",
    en:
      "Feature: Sort scores by rank, AP/FC status, sync status, or level. You can sort friend's scores too.",
  }[LANG],
  howTo: {
    zh:
      "使用方式：如果要排序自己的成績，請先到於查詢成績頁，先按照自己想要的篩選方式（曲風、等級、遊戲版本等等）列出成績，再執行書籤。如果是要排序朋友的成績，請先使用對戰功能，按照自己想要的篩選方式（曲風、等級）列出對戰結果，再執行書籤。執行完後畫面上會出現選單，可按喜歡的方式排序。",
    en:
      "Usage: For sorting own scores, open historical scores (by genre, level, song title, version, etc.) and execute the bookmarklet. For sorting friend's scores, use Friend VS feature to list scores (by genre or level), and then execute the bookmarklet.",
  }[LANG],
  screenshotUrl: "./screenshots/score-sort-20200630.png",
};

export const recentPlaySummary: Bookmarklet = {
  itemTitle: {
    zh: "整理最近遊玩紀錄",
    en: "Recent play summary",
  }[LANG],
  feature: {
    zh: "功能：以表格方式整理最近的遊玩紀錄，並將遊戲時間修正為當地時間。",
    en: "Feature: Organize recent game records into a condensed table.",
  }[LANG],
  howTo: {
    zh: "使用方式：於最近成績列表執行。執行後會在頁面中產生表格，可以選取日期和排序。",
    en: "Usage: Open the recent game records list and execute the bookmarklet.",
  }[LANG],
  screenshotUrl: "./screenshots/recent-play-summary-20200704.png",
};

export const ratingAnalyzer: Bookmarklet = {
  itemTitle: {
    zh: "分析自己 DX Rating",
    en: "Analyze Self DX Rating",
  }[LANG],
  feature: {
    zh: "功能：可分析自己的 DX Rating 組成。",
    en: "Feature: Analyze your DX Rating composition.",
  }[LANG],
  howTo: {
    zh: "使用方式：於 maimai NET 首頁或個人檔案頁面執行。執行時會開新分頁，載入成績並進行分析。",
    en: "Usage: Execute the bookmarklet on maimai NET home page or player data page.",
  }[LANG],
  screenshotUrl: "./screenshots/rating-analyzer-20200702.png",
};

export const analyzeFriendRating: Bookmarklet = {
  itemTitle: {
    zh: "分析好友 DX Rating",
    en: "Analyze Friend's DX Rating",
  }[LANG],
  feature: {
    zh: "功能：可分析朋友的 DX Rating 組成。",
    en: "Feature: Analyze your favorite friend's DX Rating composition.",
  }[LANG],
  howTo: {
    zh:
      "使用方式：於朋友清單頁面，先將想分析的好友加入最愛（ADD to FAVORITE），再執行書籤。設成最愛的好友檔案中會出現「分析 Rating」的連結，點擊後會分析該玩家的 R 值。",
    en:
      'Usage: Open friend list. Add the friend you want to analyze to FAVORITE. Execute the bookmarklet. There will have an "Analyze Rating" link for each favorite friend. Click on one of the links to analyze rating for that player.',
  }[LANG],
  screenshotUrl: "./screenshots/analyze-friend-rating-20200725.png",
};

const scoreDownloaderUsageText = {
  en: {
    part1:
      'Usage: Execute the bookmarklet on maimai NET home page. After several seconds, a "Copy" button will appear on screen. Click the Copy button to copy scores. You can paste them in Excel, Google Sheets, or ',
    ratingAnalyzer: "Rating Analyzer",
    part2: ".",
  },
  zh: {
    part1:
      "使用方式：於 maimai NET 首頁執行。執行完後點下畫面上的「複製」按鈕就能複製所有成績。複製後可貼到 Excel、Google 試算表，或是 ",
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
      <a href="../rating-calculator/" target="_blank">
        {scoreDownloaderUsageText.ratingAnalyzer}
      </a>
      {scoreDownloaderUsageText.part2}
    </React.Fragment>
  ),
  screenshotUrl: "./screenshots/score-download-20200630.png",
};

export const albumDownloadHelper: Bookmarklet = {
  itemTitle: {
    zh: "相簿照片命名",
    en: "Album Download Helper",
  }[LANG],
  feature: {
    zh: '功能：把相簿內的照片以 "日期 曲名 難度.jpg" 方式命名，並且可以直接點擊照片下載。',
    en:
      'Feature: Make photos in the album downloadable with filenames like "Date Songname Difficulty.jpg"',
  }[LANG],
  howTo: {
    zh: "使用方式：進入 PHOTOS 頁面後執行書籤，執行完後點擊想要下載的照片，就能存到手機或電腦上。",
    en:
      "Usage: Open PHOTOS page and execute this bookmarklet. Photos on the page will be clickable and have proper filenames.",
  }[LANG],
  screenshotUrl: "./screenshots/album-download-helper-20210216.png",
};
