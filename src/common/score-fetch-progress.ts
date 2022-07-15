import {Language} from './lang';

const MessagesByLang = {
  [Language.zh_TW]: {
    advStart: "匯入黃譜成績中…",
    advDone: "✔",
    expStart: "匯入紅譜成績中…",
    expDone: "✔",
    masStart: "匯入紫譜成績中…",
    masDone: "✔",
    remStart: "匯入白譜成績中…",
    remDone: "✔",
  },
  [Language.en_US]: {
    advStart: "Loading Advanced scores…",
    advDone: "✔",
    expStart: "Loading Expert scores…",
    expDone: "✔",
    masStart: "Loading Master scores…",
    masDone: "✔",
    remStart: "Loading Re:Master scores…",
    remDone: "✔",
  },
};

export function statusText(lang: Language, what: string, end?: boolean): string {
  const UIString = MessagesByLang[lang];
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
