import {ChartType} from './chart-type';
import {GameRegion} from './game-region';
import {GameVersion, LATEST_VERSION} from './game-version';
import {getRemovedSongs} from './removed-songs';
import {getMaiToolsBaseUrl} from './script-host';
import {getSongNickname} from './song-name-helper';
import {MagicApi} from './infra/magic-api';
import {MaiToolsApi} from './infra/mai-tools-api';

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

type SongPropertiesOverride = BasicSongProps & {
  debut?: number;
  lv?: ReadonlyArray<number>;
};

export class SongDatabase {
  readonly gameVer: GameVersion | null;
  readonly region: GameRegion | null;

  private dxMap = new Map<string, SongProperties>();
  private standardMap = new Map<string, SongProperties>();
  private nameByIco = new Map<string, string>();
  private verbose = true;

  constructor(gameVer: GameVersion = null, region: GameRegion = null, verbose = true) {
    this.gameVer = gameVer;
    this.region = region;
    this.verbose = verbose;
  }

  insertOrUpdateSong(song: SongPropertiesOverride, gameVer: GameVersion) {
    const map = song.dx === ChartType.DX ? this.dxMap : this.standardMap;
    if (this.updateSong(song)) {
      return;
    }
    // If debut is not set, set to current version.
    // This ensure chart level overrides always associate with a game version.
    if (!song.debut && song.debut !== 0) {
      song.debut = gameVer;
    }
    const key = song.name === 'Link' ? song.nickname : song.name;
    if (song.ico) {
      this.nameByIco.set(song.ico, key);
    }
    if (map.has(key)) {
      console.warn(
        `Found existing song properties for ${key} ${song.dx}: ${JSON.stringify(map.get(key))}`
      );
      console.warn(`Will ignore ${song}`);
      return;
    }
    map.set(key, song as SongProperties);
  }

  /**
   * @return true if song prop is successfully updated.
   */
  updateSong(update: Partial<SongProperties>): boolean {
    const map = update.dx === ChartType.DX ? this.dxMap : this.standardMap;
    const key = map.has(update.name) ? update.name : update.nickname;
    const existing = map.get(key);
    if (!existing) {
      return false;
    }

    let levels = existing.lv;
    if (update.lv instanceof Array) {
      levels = existing.lv.map((oldLevel, i) => {
        const newLevel = update.lv[i];
        return !isNaN(newLevel) && newLevel > 0 ? newLevel : oldLevel;
      });
    }
    if (update.ico) {
      this.nameByIco.set(update.ico, key);
    }
    map.set(key, {...existing, ...update, lv: levels});
    return true;
  }

  deleteSong(name: string) {
    this.dxMap.delete(name);
    this.standardMap.delete(name);
  }

  // validation: every song must have debut and lv
  validate() {
    for (const map of [this.dxMap, this.standardMap]) {
      map.forEach((song) => {
        console.assert(song.debut != null);
        console.assert(song.debut >= 0 && song.debut <= LATEST_VERSION);
        console.assert(song.lv.length >= 4);
      });
    }
  }

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
  const songs = await new MagicApi().loadMagic(gameVer);
  const songDatabase = new SongDatabase(gameVer, gameRegion);
  for (const song of songs) {
    songDatabase.insertOrUpdateSong(song, gameVer);
  }

  const maiToolsApi = new MaiToolsApi(getMaiToolsBaseUrl());
  const chartLevelOverrides = await maiToolsApi.fetchChartLevelOverrides(gameVer);
  const regionOverrides = await maiToolsApi.fetchRegionOverrides(gameRegion);

  console.log('chartLevelOverrides', chartLevelOverrides);
  for (const songProps of chartLevelOverrides) {
    songDatabase.insertOrUpdateSong(songProps, gameVer);
  }
  console.log('regionOverrides', regionOverrides);
  for (const songProps of regionOverrides) {
    songDatabase.updateSong(songProps);
  }

  const removedSongs = getRemovedSongs(gameRegion);
  for (const songName of removedSongs) {
    songDatabase.deleteSong(songName);
  }

  songDatabase.validate();
  return songDatabase;
}
