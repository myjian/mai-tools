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
    autoLv: "Automatic"
  },
  zh: {
    innerLvHeading: "譜面定數",
    manualLv: "手動輸入",
    autoLv: "自動代入",
  },
};

export const UIString = UIStringByLang[LANG];
