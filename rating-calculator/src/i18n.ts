type LangType = "zh" | "en";

const queryParams = new URLSearchParams(document.location.search);
let LANG: LangType = "en";
if (queryParams.get("hl")) {
  LANG = queryParams.get("hl").startsWith("zh") ? "zh" : "en";
} else if (navigator.language.startsWith("zh")) {
  LANG = "zh";
}

const UIStringByLang = {
  en: {
    innerLvHeading: "Chart Inner Level Data",
    manualLv: "Manual input",
    autoLv: "Automatic",
    scoreInputHeading: "Player Score",
    scoreInputDescPrefix: 'Please use "Calculate DX Rating" or "Download All Scores" from ',
    bookmarketLinkLabel: "maimai bookmarklets",
    scoreInputDescSuffix: " to fill this field.",
    otherToolsHeading: "Other Tools",
    ratingVisualizer: "Rating Visualizer (Interactive Page)",
    bookmarketList: "Bookmarklets list",
    scoreConverter: "Convert DX score to old score system",
    grade: "Grade",
    column: ":",
    newChartsRating: "New charts rating",
    oldChartsRating: "Old charts rating",
    analysisResult: "Analysis Result",
    subtotal: "Subtotal",
  },
  zh: {
    innerLvHeading: "譜面定數",
    manualLv: "手動輸入",
    autoLv: "自動代入",
    scoreInputHeading: "玩家成績輸入",
    scoreInputDescPrefix: "請用 ",
    bookmarketLinkLabel: "maimai 書籤小工具",
    scoreInputDescSuffix: " 中的「分析 DX Rating」或「下載所有歌曲成績」填入此欄。",
    otherToolsHeading: "其他工具",
    ratingVisualizer: "R 值視覺化互動式網頁",
    bookmarketList: "書籤小工具列表",
    scoreConverter: "DX 分數轉換與分析工具",
    grade: "段位",
    column: "：",
    newChartsRating: "新譜面 Rating",
    oldChartsRating: "舊譜面 Rating",
    analysisResult: "分析結果",
    subtotal: "小計",
  },
};

export const UIString = UIStringByLang[LANG];
