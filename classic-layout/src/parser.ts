import {NoteType, StrictJudgementMap} from './types';

const ZERO_JUDGEMENT: StrictJudgementMap = {
  cp: 0, perfect: 0, great: 0, good: 0, miss: 0,
};

function parseNumArrayFromText(line: string, fallback: StrictJudgementMap): StrictJudgementMap {
  const textArr = line.match(/\d+/g);
  if (!textArr) {
    return fallback;
  }
  const numArr = textArr.map((num) => parseInt(num, 10));
  if (numArr.length > 4) {
    return {cp: numArr[0], perfect: numArr[1], great: numArr[2], good: numArr[3], miss: numArr[4]};
  }
  return {perfect: numArr[0], great: numArr[1], good: numArr[2], miss: numArr[3]};
}

export function parseJudgements(text: string): Map<NoteType, StrictJudgementMap> {
  const jTextLines = text.split("\n");
  const judgementsPerType = new Map();
  const breakJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);
  judgementsPerType.set("break", breakJ);
  const touchJ = parseNumArrayFromText(jTextLines.pop(), undefined);
  if (touchJ) {
    judgementsPerType.set("touch", touchJ);
  }
  const slideJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);
  judgementsPerType.set("slide", slideJ);
  const holdJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);
  judgementsPerType.set("hold", holdJ);
  const tapJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);
  judgementsPerType.set("tap", tapJ);
  return judgementsPerType; 
}
