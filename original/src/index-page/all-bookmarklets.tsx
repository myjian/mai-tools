import {MAIMAI_NET_ORIGINS} from '../common/game-region';
import {Language} from '../common/lang';
import {getMaiToolsBaseUrl} from '../common/script-host';

const ALL_IN_ONE_SCRIPT = getMaiToolsBaseUrl() + '/scripts/all-in-one.js';

export const BOOKMARKLET_LINK = `javascript:(
  function(d) {
    if (${JSON.stringify(MAIMAI_NET_ORIGINS)}.indexOf(d.location.origin) >= 0) {
      vars = d.createElement("script");
      s.src="${ALL_IN_ONE_SCRIPT}?t=" + Math.floor(Date.now() / 60000);
      d.body.append(s);
    }
  }
)(document)`
  .replace(/[\n ]/g, '')
  .replace('vars', 'var s');

export const LinkNameByLang = {
  [Language.zh_TW]: 'maimai 書籤小工具合集 (MMBL)',
  [Language.en_US]: 'maimai bookmarklets (MMBL)',
  [Language.ko_KR]: 'maimai 북마크 (MMBL)',
};

export interface Bookmarklet {
  id: string;
  itemTitleByLang: Record<Language, string>;
  featureByLang: Record<Language, string>;
  howToByLang: Record<Language, string>;
  screenshotUrl: string;
}

export const scoreConverter: Bookmarklet = {
  id: 'convertDxToFinale',
  itemTitleByLang: {
    [Language.zh_TW]: '換算成舊版達成率 & 分析',
    [Language.en_US]: 'Convert DX score to old score system',
    [Language.ko_KR]: 'DX 점수 -> 옛날 점수로 변환',
  },
  featureByLang: {
    [Language.zh_TW]:
      '功能：可轉換 DX 達成率為舊版 (maimai FiNALE) 計分方式，以及分析各指令扣分比例。',
    [Language.en_US]:
      'Feature: Convert DX achievement to old achievement (maimai FiNALE & older), and analyze score penalty by note type.',
    [Language.ko_KR]: '기능: DX정확도를 옛날 정확도로 바꾸고 노트 타입별 점수를 분석합니다.',
  },
  howToByLang: {
    [Language.zh_TW]:
      '使用方式：登入 maimai NET，點選最近遊玩的其中一筆紀錄後執行。執行後會開啟新分頁，顯示舊版成績以及相關數據。點擊地點（Cafe MiLK）可切換計分方式，點擊達成率可切換詳細顯示。',
    [Language.en_US]:
      'Usage: Log in to maimai NET. Open a recent song record and execute the bookmarklet. New tab will open and display score in old achievement system. You can click on "Cafe MiLK" to switch to DX achievement, and click on the achievement % to see how much percentage was lost per note type.',
    [Language.ko_KR]:
      '사용법: maimai NET에 로그인하고 최근 플레이한 노래 목록을 연 뒤 북마크를 실행시킵니다. 그러면 새 탭에서 점수와 정확도가 표시 될 것입니다. "Cafe MiLK"를 클릭하여 DX정확도로 변경할 수 있고, 정확도%를 클릭하여 노트 타입별 손실률을 확인할 수 있습니다.',
  },
  screenshotUrl: './screenshots/convert-to-finale-score-20200718.jpg',
};

export const scoreSorter: Bookmarklet = {
  id: 'scoreSorter',
  itemTitleByLang: {
    [Language.zh_TW]: '排序成績',
    [Language.en_US]: 'Sort scores',
    [Language.ko_KR]: '기록 정렬',
  },
  featureByLang: {
    [Language.zh_TW]: '功能：可依照達成率、AP/FC 成就、Sync 進度或譜面等級，排序自己或好友的成績。',
    [Language.en_US]:
      "Feature: Sort scores by rank, AP/FC status, sync status, or level. You can sort friend's scores too.",
    [Language.ko_KR]:
      '기능: 기록을 정확도, AP/FC, sync, 혹은 난이도별로 정렬할 수 있습니다. 친구의 기록도 정렬할 수 있습니다.',
  },
  howToByLang: {
    [Language.zh_TW]:
      '使用方式：如果要排序自己的成績，請先到於查詢成績頁，先按照自己想要的篩選方式（曲風、等級、遊戲版本等等）列出成績，再執行書籤。如果是要排序朋友的成績，請先使用對戰功能，按照自己想要的篩選方式（曲風、等級）列出對戰結果，再執行書籤。執行完後畫面上會出現選單，可按喜歡的方式排序。',
    [Language.en_US]:
      "Usage: For sorting own scores, open historical scores (by genre, level, song title, version, etc.) and execute the bookmarklet. For sorting friend's scores, use Friend VS feature to list scores (by genre or level), and then execute the bookmarklet.",
    [Language.ko_KR]:
      '사용법: 기록을 정렬하려면 플레이 기록 페이지를 열고 북마크를 실행하세요. 친구의 기록을 정렬하기 위해서는 Friend VS 화면에 들어간 후 북마크를 실행하세요.',
  },
  screenshotUrl: './screenshots/score-sort-20200630.png',
};

export const recentPlaySummary: Bookmarklet = {
  id: 'recentPlaySummary',
  itemTitleByLang: {
    [Language.zh_TW]: '整理最近遊玩紀錄',
    [Language.en_US]: 'Recent play summary',
    [Language.ko_KR]: '최근 플레이 요약',
  },
  featureByLang: {
    [Language.zh_TW]: '功能：以表格方式整理最近的遊玩紀錄，並將遊戲時間修正為當地時間。',
    [Language.en_US]: 'Feature: Organize recent game records into a condensed table.',
    [Language.ko_KR]: '기능: 최근 플레이 기록을 테이블 형태로 요약해줍니다.',
  },
  howToByLang: {
    [Language.zh_TW]:
      '使用方式：於最近成績列表執行。執行後會在頁面中產生表格，可以選取日期和排序。',
    [Language.en_US]: 'Usage: Open the recent game records list and execute the bookmarklet.',
    [Language.ko_KR]: '사용법: 최근 플레이 목록 화면에 들어간 후 북마크를 실행하세요.',
  },
  screenshotUrl: './screenshots/recent-play-summary-20200704.png',
};

export const ratingAnalyzer: Bookmarklet = {
  id: 'analyzeSelfRating',
  itemTitleByLang: {
    [Language.zh_TW]: '分析自己 DX Rating',
    [Language.en_US]: 'Analyze Self DX Rating',
    [Language.ko_KR]: '디럭스 레이팅 분석',
  },
  featureByLang: {
    [Language.zh_TW]: '功能：可分析自己的 DX Rating 組成。',
    [Language.en_US]: 'Feature: Analyze your DX Rating composition.',
    [Language.ko_KR]: '기능: 디럭스 레이팅을 분석합니다.',
  },
  howToByLang: {
    [Language.zh_TW]:
      '使用方式：於 maimai NET 首頁或個人檔案頁面執行。執行時會開新分頁，載入成績並進行分析。',
    [Language.en_US]: 'Usage: Execute the bookmarklet on maimai NET home page or player data page.',
    [Language.ko_KR]: '사용법: maimai NET 메인 화면 혹은 player data 화면에서 북마크를 실행하세요.',
  },
  screenshotUrl: './screenshots/rating-analyzer-20200702.png',
};

export const analyzeFriendRating: Bookmarklet = {
  id: 'analyzeFriendRating',
  itemTitleByLang: {
    [Language.zh_TW]: '分析好友 DX Rating',
    [Language.en_US]: "Analyze Friend's DX Rating",
    [Language.ko_KR]: '친구의 디럭스 레이팅을 분석합니다.',
  },
  featureByLang: {
    [Language.zh_TW]: '功能：可分析朋友的 DX Rating 組成。',
    [Language.en_US]: "Feature: Analyze your favorite friend's DX Rating composition.",
    [Language.ko_KR]: '기능: 즐겨찾기 등록된 친구의 디럭스 레이팅을 분석합니다.',
  },
  howToByLang: {
    [Language.zh_TW]:
      '使用方式：於朋友清單頁面，先將想分析的好友加入最愛（ADD to FAVORITE），再執行書籤。設成最愛的好友檔案中會出現「分析 Rating」的連結，點擊後會分析該玩家的 R 值。',
    [Language.en_US]:
      'Usage: Open friend list. Add the friend you want to analyze to FAVORITE. Execute the bookmarklet. There will have an "Analyze Rating" link for each favorite friend. Click on one of the links to analyze rating for that player.',
    [Language.ko_KR]:
      '사용법: 친구 목록 화면에 들어가서 분석하고 싶은 친구를 즐겨찾기에 등록하고 북마크를 실행합니다. 즐겨찾기에 등록된 친구는 "레이팅 분석하기" 링크가 표시 될 것입니다. 해당 링크를 클릭하면 친구의 레이팅을 분석 할 수 있습니다.',
  },
  screenshotUrl: './screenshots/analyze-friend-rating-20200725.png',
};

export const scoreDownloader: Bookmarklet = {
  id: 'scoreDownloader',
  itemTitleByLang: {
    [Language.zh_TW]: '下載所有歌曲成績',
    [Language.en_US]: 'Download all scores',
    [Language.ko_KR]: '모든 기록 다운로드 하기',
  },
  featureByLang: {
    [Language.zh_TW]: '功能：下載所有白譜、紫譜、紅譜、黃譜的成績。可用於個人紀錄或是 R 值分析。',
    [Language.en_US]: 'Feature: Download all ADVANCED, EXPERT, MASTER, and Re:MASTER scores.',
    [Language.ko_KR]:
      '기능: 모든 ADVANCED, EXPERT, MASTER, Re:MASTER 기록을 다운로드 할 수 있습니다.',
  },
  howToByLang: {
    [Language.en_US]:
      'Usage: Execute the bookmarklet on maimai NET home page. After several seconds, a "Copy" button will appear on screen. Click the Copy button to copy scores. You can paste them in Excel or Google Sheets.',

    [Language.zh_TW]:
      '使用方式：於 maimai NET 首頁執行。執行完後點下畫面上的「複製」按鈕就能複製所有成績。複製後可貼到 Excel 或是 Google 試算表。',

    [Language.ko_KR]:
      '사용법: maimai NET 메인 화면에서 북마크를 실행합니다. 몇 초 뒤 "복사" 버튼이 화면에 나타나면 기록을 복사할 수 있습니다. 엑셀 혹은 구글 시트 에 붙여 넣을 수 있습니다.',
  },
  screenshotUrl: './screenshots/score-download-20200630.png',
};

export const albumDownloadHelper: Bookmarklet = {
  id: 'albumDownloadHelper',
  itemTitleByLang: {
    [Language.zh_TW]: '相簿照片命名',
    [Language.en_US]: 'Album Download Helper',
    [Language.ko_KR]: '앨범 다운로더',
  },
  featureByLang: {
    [Language.zh_TW]:
      '功能：把相簿內的照片以 "日期 曲名 難度.jpg" 方式命名，並且可以直接點擊照片下載。',
    [Language.en_US]:
      'Feature: Make photos in the album downloadable with filenames like "Date Songname Difficulty.jpg"',
    [Language.ko_KR]:
      '기능: 앨범의 사진들을 "[날짜] [곡명] [난이도].jpg"와 같은 파일명으로 다운로드 할 수 있게 해줍니다.',
  },
  howToByLang: {
    [Language.zh_TW]:
      '使用方式：進入 PHOTOS 頁面後執行書籤，執行完後點擊想要下載的照片，就能存到手機或電腦上。',
    [Language.en_US]:
      'Usage: Open PHOTOS page and execute this bookmarklet. Photos on the page will be clickable and have proper filenames.',
    [Language.ko_KR]:
      '사용법: PHOTOS 페이지를 열고 북마크를 실행하세요. 해당 페이지의 사진을 클릭하고 다운로드 받을 수 있게 됩니다.',
  },
  screenshotUrl: './screenshots/album-download-helper-20210216.png',
};
