import {ChartType} from '../chart-type';
import {GameRegion} from '../game-region';
import {GameVersion, LATEST_VERSION} from '../game-version';
import {getRemovedSongs} from '../removed-songs';
import {SongDatabase, SongProperties} from '../song-props';
import {MagicApi} from './magic-api';
import {MaiToolsApi} from './mai-tools-api';

export class SongDatabaseFactory {
  constructor(private readonly maiToolsApi: MaiToolsApi, private readonly magicApi: MagicApi) {}

  async create(gameVer: GameVersion, gameRegion: GameRegion): Promise<SongDatabase> {
    const dxMap = new Map<string, SongProperties>();
    const standardMap = new Map<string, SongProperties>();
    const nameByIco = new Map<string, string>();

    const songs = await this.magicApi.loadMagic(gameVer);
    for (const song of songs) {
      this.insertOrUpdateSong(dxMap, standardMap, nameByIco, song);
    }

    const chartLevelOverrides = await this.maiToolsApi.fetchChartLevelOverrides(gameVer);
    // console.log('chartLevelOverrides', chartLevelOverrides);
    for (const songProps of chartLevelOverrides) {
      this.insertOrUpdateSong(dxMap, standardMap, nameByIco, songProps);
    }

    const regionOverrides = await this.maiToolsApi.fetchRegionOverrides(gameRegion);
    // console.log('regionOverrides', regionOverrides);
    for (const songProps of regionOverrides) {
      this.updateSong(dxMap, standardMap, nameByIco, songProps);
    }

    const removedSongs = getRemovedSongs(gameRegion, gameVer);
    for (const songName of removedSongs) {
      this.deleteSong(dxMap, standardMap, songName);
    }

    this.validate(dxMap, standardMap);
    return new SongDatabase(gameVer, gameRegion, true, dxMap, standardMap, nameByIco);
  }

  private insertOrUpdateSong(
    dxMap: Map<string, SongProperties>,
    standardMap: Map<string, SongProperties>,
    nameByIco: Map<string, string>,
    song: SongProperties
  ) {
    const map = song.dx === ChartType.DX ? dxMap : standardMap;
    if (this.updateSong(dxMap, standardMap, nameByIco, song)) {
      return;
    }
    const key = song.name === 'Link' ? song.nickname : song.name;
    if (song.ico) {
      nameByIco.set(song.ico, key);
    }
    if (map.has(key)) {
      console.warn(
        `Found existing song properties for ${key} ${song.dx}: ${JSON.stringify(map.get(key))}`
      );
      console.warn(`Will ignore ${song}`);
      return;
    }
    map.set(key, song);
  }

  /**
   * @return true if song prop is successfully updated.
   */
  private updateSong(
    dxMap: Map<string, SongProperties>,
    standardMap: Map<string, SongProperties>,
    nameByIco: Map<string, string>,
    update: Partial<SongProperties>
  ): boolean {
    const map = update.dx === ChartType.DX ? dxMap : standardMap;
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
      nameByIco.set(update.ico, key);
    }
    map.set(key, {...existing, ...update, lv: levels});
    return true;
  }

  private deleteSong(
    dxMap: Map<string, SongProperties>,
    standardMap: Map<string, SongProperties>,
    name: string
  ) {
    dxMap.delete(name);
    standardMap.delete(name);
  }

  // validation: every song must have debut and lv
  private validate(dxMap: Map<string, SongProperties>, standardMap: Map<string, SongProperties>) {
    for (const map of [dxMap, standardMap]) {
      map.forEach((song) => {
        console.assert(song.debut != null);
        console.assert(song.debut >= 0 && song.debut <= LATEST_VERSION);
        console.assert(song.lv.length >= 4);
      });
    }
  }
}
