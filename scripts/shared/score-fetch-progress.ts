import {LANG} from './i18n';

const UIString = {
  zh: {
    advStart: "🕓 下載黃譜成績中…",
    advDone: "✔ 黃譜成績下載完畢！",
    expStart: "🕓 下載紅譜成績中…",
    expDone: "✔ 紅譜成績下載完畢！",
    masStart: "🕓 下載紫譜成績中…",
    masDone: "✔ 紫譜成績下載完畢！",
    remStart: "🕓 下載白譜成績中…",
    remDone: "✔ 白譜成績下載完畢！",
  },
  en: {
    advStart: "🕓 Downloading Advanced scores…",
    advDone: "✔ Advanced scores downloaded!",
    expStart: "🕓 Downloading Expert scores…",
    expDone: "✔ Expert scores downloaded!",
    masStart: "🕓 Downloading Master scores…",
    masDone: "✔ Master scores downloaded!",
    remStart: "🕓 Downloading Re:Master scores…",
    remDone: "✔ Re:Master scores downloaded!",
  },
}[LANG];

export function statusText(what: string, end?: boolean) {
  switch (what) {
    case "Re:MASTER":
      return end ? UIString.remDone : UIString.remStart;
    case "MASTER":
      return end ? UIString.masDone : UIString.masStart;
    case "EXPERT":
      return end ? UIString.expDone : UIString.expStart;
    case "ADVANCED":
      return end ? UIString.advDone : UIString.advStart;
  }
}
