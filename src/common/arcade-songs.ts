import {GameRegion} from './game-region';
import {GameVersion, getVersionName, LATEST_VERSION} from './game-version';

export const MAIMAI_SONGS_HOME = 'https://arcade-songs.zetaraku.dev/maimai/';

export function getMaimaiSongsLink(
  level: string,
  useInternalLevel: boolean,
  gameRegion?: GameRegion,
  minGameVer?: number,
  maxGameVer: GameVersion = LATEST_VERSION
) {
  const q = new URLSearchParams();

  level = level.replace('+', '.7');
  q.set('maxLevelValue', level);
  q.set('minLevelValue', level);
  if (useInternalLevel) {
    q.set('useInternalLevel', 'true');
  }

  if (gameRegion) {
    q.set('region', gameRegion);
  }

  if (minGameVer != null && minGameVer >= 0) {
    const versions: string[] = [];
    while (minGameVer <= maxGameVer) {
      versions.push(getVersionName(minGameVer));
      minGameVer++;
    }
    q.set('versions', versions.join('|'));
  }

  return MAIMAI_SONGS_HOME + '?' + q;
}
