import {Difficulty} from './difficulties';
import {Language} from './lang';

const MessagesByLang = {
  [Language.zh_TW]: {
    bscStart: '讀取綠譜成績中…',
    bscDone: '✔',
    advStart: '讀取黃譜成績中…',
    advDone: '✔',
    expStart: '讀取紅譜成績中…',
    expDone: '✔',
    masStart: '讀取紫譜成績中…',
    masDone: '✔',
    remStart: '讀取白譜成績中…',
    remDone: '✔',
  },
  [Language.en_US]: {
    bscStart: 'Loading Basic scores…',
    bscDone: '✔',
    advStart: 'Loading Advanced scores…',
    advDone: '✔',
    expStart: 'Loading Expert scores…',
    expDone: '✔',
    masStart: 'Loading Master scores…',
    masDone: '✔',
    remStart: 'Loading Re:Master scores…',
    remDone: '✔',
  },
  [Language.ko_KR]: {
    bscStart: 'Basic 정확도 불러오는 중…',
    bscDone: '✔',
    advStart: 'Advanced 정확도 불러오는 중…',
    advDone: '✔',
    expStart: 'Expert 정확도 불러오는 중…',
    expDone: '✔',
    masStart: 'Master 정확도 불러오는 중…',
    masDone: '✔',
    remStart: 'Re:Master 정확도 불러오는 중…',
    remDone: '✔',
  },
};

export function statusText(lang: Language, difficulty: Difficulty, end?: boolean): string {
  const UIString = MessagesByLang[lang];
  switch (difficulty) {
    case Difficulty.ReMASTER:
      return end ? UIString.remDone + '\n' : UIString.remStart;
    case Difficulty.MASTER:
      return end ? UIString.masDone + '\n' : UIString.masStart;
    case Difficulty.EXPERT:
      return end ? UIString.expDone + '\n' : UIString.expStart;
    case Difficulty.ADVANCED:
      return end ? UIString.advDone + '\n' : UIString.advStart;
    case Difficulty.BASIC:
      return end ? UIString.bscDone + '\n' : UIString.bscStart;
  }
  return '';
}
