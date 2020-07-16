export type NoteType = "tap" | "hold" | "slide" | "touch" | "break";
export type FullNoteType = "total" | NoteType;
export type BreakScore = 2600 | 2550 | 2500 | 2000 | 1500 | 1250 | 1000 | 0;
export type BreakScoreMap = Map<BreakScore, number>;
export type ScorePerType = Map<FullNoteType, {score: number, isMax: boolean}>;

export type JudgementType = "perfect" | "great" | "good" | "miss";
export type StrictJudgementType = "cp" | JudgementType;
export type JudgementMap = {[j in JudgementType]: number};
export type FullJudgementMap = {[j in JudgementType | 'total']: number};
export type JudgementDisplayMap = {[j in JudgementType]: number|string};
export type StrictJudgementMap = {[j in JudgementType]: number} & {cp?: number};
