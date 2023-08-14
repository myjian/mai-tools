export const enum UserPreference {
  Language = 'MaiToolsLang',
  HeightUnit = 'visualizerHeightUnit',
  MinLv = 'visualizerMinLv',
  MinRank = 'visualizerMinRank',
  MaxLv = 'visualizerMaxLv',
  TableDisplay = 'visualizerTableDisplay',
  TargetRating = 'targetRating',
}

export function loadUserPreference(key: UserPreference) {
  return window.localStorage.getItem(key);
}

export function saveUserPreference(key: UserPreference, value: string) {
  window.localStorage.setItem(key, value);
}
