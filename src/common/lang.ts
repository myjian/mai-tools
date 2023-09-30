import {QueryParam} from './query-params';
import {loadUserPreference, saveUserPreference, UserPreference} from './user-preference';

export const enum Language {
  en_US = 'en-US',
  zh_TW = 'zh-TW',
  ko_KR = 'ko-KR',
}

export const SUPPORTED_LANGUAGES = [Language.en_US, Language.zh_TW, Language.ko_KR];

function loadLanguage(): Language {
  const raw = loadUserPreference(UserPreference.Language);
  switch (raw) {
    case Language.en_US:
      return Language.en_US;
    case Language.zh_TW:
      return Language.zh_TW;
    case Language.ko_KR:
      return Language.ko_KR;
  }
  return null;
}

export function saveLanguage(lang: Language) {
  saveUserPreference(UserPreference.Language, lang);
}

export function getInitialLanguage(): Language {
  const queryParamsHl = new URLSearchParams(location.search).get(QueryParam.HostLanguage);
  // URL query parameter
  if (queryParamsHl) {
    return queryParamsHl.startsWith('zh')
      ? Language.zh_TW
      : queryParamsHl.startsWith('ko')
      ? Language.ko_KR
      : Language.en_US;
  }
  // LocalStorage
  const langPreference = loadLanguage();
  if (langPreference) {
    return langPreference;
  }
  // Browser
  if (navigator.language.startsWith('zh')) {
    return Language.zh_TW;
  }
  if (navigator.language.startsWith('ko')) {
    return Language.ko_KR;
  }
  return Language.en_US;
}
