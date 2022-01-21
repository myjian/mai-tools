import {LANG} from './lang';

const UIString = {
  zh: {
    advStart: "匯入黃譜成績中…",
    advDone: "✔",
    expStart: "匯入紅譜成績中…",
    expDone: "✔",
    masStart: "匯入紫譜成績中…",
    masDone: "✔",
    remStart: "匯入白譜成績中…",
    remDone: "✔",
  },
  en: {
    advStart: "Importing Advanced scores…",
    advDone: "✔",
    expStart: "Importing Expert scores…",
    expDone: "✔",
    masStart: "Importing Master scores…",
    masDone: "✔",
    remStart: "Importing Re:Master scores…",
    remDone: "✔",
  },
}[LANG];

export function statusText(what: string, end?: boolean): string {
  switch (what) {
    case "Re:MASTER":
      return end ? UIString.remDone + "\n" : UIString.remStart;
    case "MASTER":
      return end ? UIString.masDone + "\n" : UIString.masStart;
    case "EXPERT":
      return end ? UIString.expDone + "\n" : UIString.expStart;
    case "ADVANCED":
      return end ? UIString.advDone + "\n" : UIString.advStart;
  }
  return "";
}
