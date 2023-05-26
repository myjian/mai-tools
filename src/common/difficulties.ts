export const enum Difficulty {
  BASIC = 0,
  ADVANCED = 1,
  EXPERT = 2,
  MASTER = 3,
  ReMASTER = 4,
}

export const DIFFICULTIES = ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'Re:MASTER'];

export const DIFFICULTY_CLASSNAME_MAP = new Map([
  ['Re:MASTER', 'remaster'],
  ['MASTER', 'master'],
  ['EXPERT', 'expert'],
  ['ADVANCED', 'advanced'],
  ['BASIC', 'basic'],
]);

export function getDifficultyName(diff: Difficulty): string {
  return DIFFICULTIES[diff];
}

export function getDifficultyForRecord(row: HTMLElement): Difficulty {
  const diffImg = row.querySelector('.playlog_top_container img.playlog_diff') as HTMLImageElement;
  const src = diffImg.src;
  const d = src.substring(src.lastIndexOf('_') + 1, src.lastIndexOf('.'));
  const diff = DIFFICULTIES.indexOf(d.toUpperCase());
  return diff < 0 ? Difficulty.ReMASTER : diff;
}

export function getDifficultyTextColor(diff: Difficulty): string {
  return [
    '#45c124', // basic
    '#ffba01', // advanced
    '#ff7b7b', // expert
    '#9f51dc', // master
    '#dbaaff', // remaster
  ][diff];
}
