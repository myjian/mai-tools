import {GameRegion} from '../common/game-region';
import {GameVersion} from './game-version';

/**
 * getRemovedSongs returns the names of removed songs. We use this list to:
 *   1) exclude songs from rating calculation when the song is not available in the given region
 *   2) help player better estimate their rating in the next version by excluding songs that will be removed
 */
export function getRemovedSongs(gameRegion: GameRegion, gameVersion: GameVersion): string[] {
  if (gameRegion === GameRegion.Jp) {
    if (gameVersion > GameVersion.BUDDiES) {
      return [
        '全世界共通リズム感テスト',
        '君の知らない物語',
        'Our Fighting',
        'おじゃま虫',
        'はじめまして地球人さん',
        'ヒビカセ',
        'アンチクロックワイズ',
      ];
    }
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
