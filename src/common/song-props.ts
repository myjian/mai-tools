import {ChartType} from './chart-type';
import {GameRegion} from './game-region';
import {GameVersion} from './game-version';
import {MagicApi} from './infra/magic-api';
import {MaiToolsApi} from './infra/mai-tools-api';
import {SongDatabaseFactory} from './infra/song-database-factory';
import {getMaiToolsBaseUrl} from './script-host';
import {getSongNickname} from './song-name-helper';

export interface BasicSongProps {
  dx: ChartType;
  name: string;
  nickname?: string | null;
  ico?: string;
}

export interface SongProperties extends BasicSongProps {
  debut: number; // from 0 to latest version number
  lv: ReadonlyArray<number>;
}

export class SongDatabase {
  constructor(
    readonly gameVer: GameVersion = null,
    readonly region: GameRegion = null,
    private readonly verbose = true,
    private dxMap: Map<string, SongProperties> = new Map(),
    private standardMap: Map<string, SongProperties> = new Map(),
    private nameByIco: Map<string, string> = new Map()
  ) {}

  hasDualCharts(songName: string, genre: string): boolean {
    if (songName === 'Link') return true;
    if (this.dxMap.has(songName) && this.standardMap.has(songName)) {
      return true;
    }
    const nickname = getSongNickname(songName, genre);
    if (nickname) {
      return this.dxMap.has(nickname) && this.standardMap.has(nickname);
    }
    return false;
  }

  getSongPropsByIco(ico: string, chartType: ChartType) {
    const name = this.nameByIco.get(ico);
    return this.getSongProperties(name, '', chartType);
  }

  getSongProperties(
    songName: string,
    genre: string,
    chartType: ChartType = ChartType.STANDARD
  ): SongProperties | undefined {
    if (songName == null) {
      return;
    }
    const map = chartType === ChartType.DX ? this.dxMap : this.standardMap;
    let songProps = map.get(songName);
    if (songProps) {
      return songProps;
    }
    const nickname = getSongNickname(songName, genre);
    songProps = map.get(nickname);
    if (songProps) {
      return songProps;
    }
    if (this.verbose) {
      console.warn(`Could not find song properties for ${songName} ${chartType}`);
    }
  }

  getAllProps(): SongProperties[] {
    return Array.from(this.dxMap.values()).concat(Array.from(this.standardMap.values()));
  }

  getPropsForSongs(songs: ReadonlyArray<BasicSongProps>): SongProperties[] {
    return songs
      .map((s) => {
        const props =
          this.getSongProperties(s.nickname, '', s.dx) || this.getSongProperties(s.name, '', s.dx);
        if (!props) {
          console.warn('Could not find song properties for', s);
        }
        return props;
      })
      .filter((props) => !!props);
  }

  toString(): string {
    return String({dxMap: this.dxMap, standardMap: this.standardMap});
  }
}

// TODO: accept overrides from rating calculator
export async function loadSongDatabase(
  gameVer: GameVersion,
  gameRegion: GameRegion
): Promise<SongDatabase> {
  const factory = new SongDatabaseFactory(new MaiToolsApi(getMaiToolsBaseUrl()), new MagicApi());

  return factory.create(gameVer, gameRegion);
}
