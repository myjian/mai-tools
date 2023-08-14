import {GameRegion} from '../common/game-region';

/**
 * getRemovedSongs returns the list of song names that are removed in the given
 * region (and game version, which was needed but currently not used). It is used to:
 *   1) exclude songs from rating calculation when the song is not available in the given region
 *   2) help player better estimate their rating in the next version by excluding songs that will be removed
 */
export function getRemovedSongs(gameRegion: GameRegion): string[] {
  if (gameRegion === GameRegion.Jp) {
    return ['全世界共通リズム感テスト'];
  } else if (gameRegion === GameRegion.Intl) {
    return [
      // Removed in UNiVERSE
      'コネクト',
      'シュガーソングとビターステップ',
      'Mr. Wonderland',
      'ワンダーラスト',
      'LOSER',
      'U.S.A.',
      '新宝島',
      'アウトサイダー',
      'ジャガーノート',
    ];
  }
  return [];
}
