export const enum Difficulty {
  BASIC = 0,
  ADVANCED = 1,
  EXPERT = 2,
  MASTER = 3,
  ReMASTER = 4,
  UTAGE = 5, // on maimai NET it is 10, but here I use 5 for simplicity
}

export const DIFFICULTIES = [
  Difficulty.BASIC,
  Difficulty.ADVANCED,
  Difficulty.EXPERT,
  Difficulty.MASTER,
  Difficulty.ReMASTER,
];
const DIFFICULTY_TEXT = ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'Re:MASTER', 'UTAGE'];
const DIFFICULTY_SHORT_TEXT = ['BAS', 'ADV', 'EXP', 'MAS', 'ReM', 'UTG'];

export function getDifficultyName(diff: Difficulty): string {
  return DIFFICULTY_TEXT[diff];
}

export function getDifficultyShortName(diff: Difficulty): string {
  return DIFFICULTY_SHORT_TEXT[diff];
}

export function getDifficultyByName(cn: string): Difficulty {
  const diff = DIFFICULTY_TEXT.indexOf(cn.toUpperCase());
  return diff < 0 ? Difficulty.ReMASTER : diff;
}

export function getDifficultyForRecord(row: HTMLElement): Difficulty {
  const diffImg = row.querySelector('.playlog_top_container img.playlog_diff') as HTMLImageElement;
  const src = diffImg.src;
  const d = src.substring(src.lastIndexOf('_') + 1, src.lastIndexOf('.'));
  return getDifficultyByName(d);
}

/** @return class name to be applied on HTML elements */
export function getDifficultyClassName(diff: Difficulty): string {
  return ['basic', 'advanced', 'expert', 'master', 'remaster', 'utage'][diff] || '';
}

export function getDifficultyTextColor(diff: Difficulty): string {
  return (
    [
      '#45c124', // basic
      '#ffba01', // advanced
      '#ff7b7b', // expert
      '#9f51dc', // master
      '#dbaaff', // remaster
      '#f540f3', // utage
    ][diff] || 'black'
  );
}
