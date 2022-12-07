import {GameRegion} from "../common/game-region";
import {DxVersion} from "../common/game-version";

export function getRemovedSongsByVersion(gameVer: DxVersion, gameRegion: GameRegion): string[] {
  if (gameRegion === GameRegion.Intl && gameVer === DxVersion.UNIVERSE) {
    return [
      "コネクト",
      "シュガーソングとビターステップ",
      "Mr. Wonderland",
      "ワンダーラスト",
      "LOSER",
      "U.S.A.",
      "新宝島",
      "アウトサイダー",
      "ジャガーノート",
    ];
  }
  return [];
}
