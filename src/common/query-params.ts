export const enum QueryParam {
  HostLanguage = 'hl',

  // For classic-layout (DX -> FiNALE score converter)
  Date = 'dt',
  Track = 'tk',
  Difficulty = 'df',
  SongTitle = 'st',
  Achievement = 'ac',
  HighScore = 'hs',
  Combo = 'cb',
  NoteDetails = 'nd',
  SyncStatus = 'sc',

  // For dx-achievement (FiNALE -> DX score converter)
  AchievementOld = 'achv',
  TotalScore = 'ts',
  BreakScore = 'bs',
  BreakJudgement = 'bj',

  // For rating-calculator
  GameRegion = 'region',
  GameVersion = 'gameVersion',
  PlayerName = 'playerName',
  FriendIdx = 'friendIdx',
  ChartType = 'ct',
  SongImage = 'si',
}
