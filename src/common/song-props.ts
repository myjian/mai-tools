import {ChartType} from './chart-type';
import {GameRegion} from './game-region';
import {GameVersion, LATEST_VERSION} from './game-version';
import {loadMagic} from './magic';
import {getRemovedSongs} from './removed-songs';
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

async function fetchJson(url: string) {
  let body = '';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {};
    }
    body = await response.text();
    return JSON.parse(body);
  } catch (e) {
    // Can be network error or parse error
    console.warn(e);
    console.warn('Failed to parse JSON: ' + body);
  }
  return {};
}

async function fetchChartLevelOverrides(gameVer: GameVersion) {
  const url = getMaiToolsBaseUrl() + `/data/chart-levels/version${gameVer}.json`;
  const data = await fetchJson(url);
  const output: Pick<SongProperties, 'name' | 'dx' | 'lv'>[] = [];
  ['standard', 'dx'].forEach((chartType, index) => {
    if (!data[chartType]) {
      return;
    }
    for (const name of Object.keys(data[chartType])) {
      output.push({
        name: name,
        dx: index,
        lv: data[chartType][name],
      });
    }
  });
  return output;
}

async function fetchRegionOverrides(
  region: GameRegion
): Promise<Pick<SongProperties, 'name' | 'dx' | 'debut' | 'dx'>[]> {
  const url = getMaiToolsBaseUrl() + `/data/song-info/${region}.json`;
  const data = await fetchJson(url);
  return ['standard', 'dx'].flatMap((chartType, index) => {
    const songsByVer: Record<string, string[]> = data[chartType];
    if (!songsByVer) {
      return;
    }
    const icosByVer: Record<string, string[]> = data[chartType + 'Ico'] || {};
    return Object.keys(songsByVer).flatMap((version) => {
      const songList = songsByVer[version];
      const icoList = icosByVer[version] || [];
      const versionInt = parseInt(version);
      return songList.map((song, i) =>
        i < icoList.length
          ? {
              name: song,
              dx: index,
              debut: versionInt,
              ico: icoList[i],
            }
          : {
              name: song,
              dx: index,
              debut: versionInt,
            }
      );
    });
  });
}

// TODO: accept overrides from rating calculator
export async function loadSongDatabase(
  gameVer: GameVersion,
  gameRegion: GameRegion
): Promise<SongDatabase> {
  const songs = await loadMagic(gameVer);
  const songDatabase = new SongDatabase(gameVer, gameRegion);
  for (const song of songs) {
    songDatabase.insertOrUpdateSong(song, gameVer);
  }

  const chartLevelOverrides = await fetchChartLevelOverrides(gameVer);
  console.log('chartLevelOverrides', chartLevelOverrides);
  for (const songProps of chartLevelOverrides) {
    songDatabase.insertOrUpdateSong(songProps, gameVer);
  }

  const regionOverrides = await fetchRegionOverrides(gameRegion);
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
