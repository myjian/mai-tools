import {GameVersion} from '../game-version';
import {GameRegion} from '../game-region';
import {SongProperties} from '../song-props';

export class MaiToolsApi {
  constructor(
    private readonly maiToolsBaseUrl: string,
  ) {
  }

  async fetchChartLevelOverrides(gameVer: GameVersion): Promise<SongProperties[]> {
    const data = await fetchJson(`${this.maiToolsBaseUrl}/data/chart-levels/version${gameVer}.json`);
    const output: SongProperties[] = [];
    ['standard', 'dx'].forEach((chartType, index) => {
      if (!data[chartType]) {
        return;
      }
      for (const name of Object.keys(data[chartType])) {
        output.push({
          name: name,
          dx: index,
          debut: gameVer,
          lv: data[chartType][name],
        });
      }
    });
    return output;
  }

  async fetchRegionOverrides(
    region: GameRegion
  ): Promise<Pick<SongProperties, 'name' | 'dx' | 'debut'>[]> {
    const data = await fetchJson(`${this.maiToolsBaseUrl}/data/song-info/${region}.json`);
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
          ({
            name: song,
            dx: index,
            debut: versionInt,
            ico: icoList.at(i),
          })
        );
      });
    });
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
