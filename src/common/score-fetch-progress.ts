import {Difficulty} from './difficulties';
import {Language} from './lang';

const MessagesByLang = {
  [Language.zh_TW]: {
    bscStart: "匯入綠譜成績中…",
    bscDone: "✔",
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
    bscStart: "Loading Basic scores…",
    bscDone: "✔",
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

export function statusText(lang: Language, difficulty: Difficulty, end?: boolean): string {
  const UIString = MessagesByLang[lang];
  switch (difficulty) {
    case Difficulty.ReMASTER:
      return end ? UIString.remDone + "\n" : UIString.remStart;
    case Difficulty.MASTER:
      return end ? UIString.masDone + "\n" : UIString.masStart;
    case Difficulty.EXPERT:
      return end ? UIString.expDone + "\n" : UIString.expStart;
    case Difficulty.ADVANCED:
      return end ? UIString.advDone + "\n" : UIString.advStart;
    case Difficulty.BASIC:
      return end ? UIString.bscDone + "\n" : UIString.bscStart;
  }
  return "";
}
