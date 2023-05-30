import {DIFFICULTIES, Difficulty} from './difficulties';
import {Language} from './lang';

const MessagesByLang = {
  [Language.zh_TW]: {
    start: "匯入成績中…",
    done: "✔",
  },
  [Language.en_US]: {
    start: "Loading scores…",
    done: "✔",
  },
  [Language.ko_KR]: {
    start: "정확도 불러오는 중…",
    done: "✔",
  },
};

/**
 * load multiple score list asynchronously.
 * returns domCache, ChartRecord Array
 *
 * @param lang current user's language
 * @param chartRecordLoader loads chartRecords with given difficulty
 * @param messageReceiver current loading status message receiver
 */
export async function loadChartRecords<T>(
  lang: Language,
  chartRecordLoader: (difficulty: Difficulty) => Promise<T[]>,
  messageReceiver: (message: String) => void = _ => {},
): Promise<[Map<Difficulty, Document>, T[]]> {
  const domCache = new Map<Difficulty, Document>();
  let scoreList: T[][] = [];

  let count = 0;
  messageReceiver(`${loadingText(lang, false)} (${count}/${DIFFICULTIES.length})`);

  await Promise.all(DIFFICULTIES
    .map(difficulty =>
      chartRecordLoader(difficulty)
        .then(it => scoreList.push(it))
        .then(_ => {
          messageReceiver(`${loadingText(lang, false)} (${++count}/${DIFFICULTIES.length})`);
        })
    )
  );

  return [domCache, [].concat(scoreList)];
}

function loadingText(lang: Language, done: boolean = false): string {
  return done ? MessagesByLang[lang].done + "\n" : MessagesByLang[lang].start;
}
