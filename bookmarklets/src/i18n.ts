const queryParams = new URLSearchParams(document.location.search);
let lang: "en" | "zh" = "en";
if (queryParams.get("hl")) {
  lang = queryParams.get("hl").startsWith("zh") ? "zh" : "en";
} else if (navigator.language.startsWith("zh")) {
  lang = "zh";
}

export const LANG = lang;

export const PAGE_TITLE = {
  en: "maimai Bookmarklets",
  zh: "maimai 書籤小工具",
}[LANG];
