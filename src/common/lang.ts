export const enum Language {
  en_US = "en_US",
  zh_TW = "zh_TW",
}

export const SUPPORTED_LANGUAGES = [Language.en_US, Language.zh_TW];

const LANG_STORAGE_NAME = "MaiToolsLang";

function loadLanguage(): Language {
  const raw = window.localStorage.getItem(LANG_STORAGE_NAME);
  switch (raw) {
    case Language.en_US:
      return Language.en_US;
    case Language.zh_TW:
      return Language.zh_TW;
  }
  return null;
}

export function saveLanguage(lang: Language) {
  window.localStorage.setItem(LANG_STORAGE_NAME, lang);
}

export function getInitialLanguage(): Language {
  const queryParams = new URLSearchParams(location.search);
  // LocalStorage
  const langPreference = loadLanguage();
  if (langPreference) {
    return langPreference;
  }
  // URL query parameter
  if (queryParams.get("hl")) {
    return queryParams.get("hl").startsWith("zh") ? Language.zh_TW : Language.en_US;
  }
  // Browser
  if (navigator.language.startsWith("zh")) {
    return Language.zh_TW;
  }
  return Language.en_US;
}
