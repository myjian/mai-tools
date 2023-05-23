import {ChartType} from './chart-type';
import {DIFFICULTIES} from './difficulties';
import {GameRegion} from './game-region';
import {DxVersion, LATEST_VERSION} from './game-version';
import {getRemovedSongs} from './removed-songs';
import {getMaiToolsBaseUrl} from './script-host';
import {getSongNickname, normalizeSongName} from './song-name-helper';

export interface BasicSongProps {
  dx: ChartType;
  name: string;
  nickname?: string | null;
}

export interface SongProperties extends BasicSongProps {
  debut: number; // from 0 to latest version number
  lv: ReadonlyArray<number>;
}

type SongPropertiesOverride = BasicSongProps & {
  debut?: number;
  lv?: ReadonlyArray<number>;
};

export const enum MatchMode {
  EQUAL,
  OLDER,
}

const DX_REGEX = /\bdx\s*:\s*([0-9]+)/;
const LV_REGEX = /\blv\s*:\s*(\[.+?\])/;
const VERSION_REGEX = /\bv\s*:\s*(-?[0-9]+)/;
const SONGNAME_REGEX = /\bn\s*:\s*["'](.+?)['"]\s*[,\}]/;
const SONGNICKNAME_REGEX = /\bnn\s*:\s*["'](.+?)['"]\s*[,\}]/;

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

async function fetchChartLevelOverrides(gameVer: DxVersion) {
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

async function fetchDebutVersionOverrides(): Promise<
  Pick<SongProperties, 'name' | 'dx' | 'debut'>[]
> {
  const url = getMaiToolsBaseUrl() + '/data/song-info/intl.json';
  const data = await fetchJson(url);
  const output: Pick<SongProperties, 'name' | 'dx' | 'debut'>[] = [];
  ['standard', 'dx'].forEach((chartType, index) => {
    if (!data[chartType]) {
      return;
    }
    for (const version of Object.keys(data[chartType])) {
      const songList: string[] = data[chartType][version];
      const versionInt = parseInt(version);
      for (const name of songList) {
        output.push({
          name: name,
          dx: index,
          debut: versionInt,
        });
      }
    }
  });
  return output;
}

/**
 * Parse song properties from text.
 *
 * Example text format:
 * {dx:0, v: 2, lv:[4.0, 6.0, 8.8, 10.9, 12.3], n:"Bad Apple!! feat nomico", nn:"Bad Apple!!"},
 * {dx:1, v:13, lv:[3.0, 7.0, 9.2, 11.8, 0], n:"METEOR"},
 */
function parseSongProperties(line: string): SongProperties | undefined {
  const dxMatch = line.match(DX_REGEX);
  const lvMatch = line.match(LV_REGEX);
  const debutVerMatch = line.match(VERSION_REGEX);
  const songNameMatch = line.match(SONGNAME_REGEX);
  const nicknameMatch = line.match(SONGNICKNAME_REGEX);
  if (dxMatch && lvMatch && debutVerMatch && songNameMatch) {
    let lvList = JSON.parse(lvMatch[1]) as number[];
    if (lvList.length > DIFFICULTIES.length) {
      const newReMasterLv = lvList.pop()!;
      lvList[DIFFICULTIES.length - 1] = newReMasterLv;
    }
    return {
      dx: parseInt(dxMatch[1]) as 0 | 1,
      lv: lvList,
      debut: Math.abs(parseInt(debutVerMatch[1])),
      name: normalizeSongName(songNameMatch[1]),
      nickname: nicknameMatch && nicknameMatch[1],
    };
  }
}

function mergeSongProps(p1: SongProperties, p2: Partial<SongProperties>): SongProperties {
  let levels = p1.lv;
  if (p2.lv instanceof Array) {
    levels = p1.lv.map((currentLv, i) => (isNaN(p2.lv[i]) ? currentLv : p2.lv[i]));
  }
  return {...p1, ...p2, lv: levels};
}

/**
 * @return true if song prop is successfully updated.
 */
function updateSongProps(
  map: Map<string, SongProperties[]>,
  props: Partial<SongProperties>
): boolean {
  if (!map.has(props.name)) {
    return false;
  }
  const arr = map.get(props.name)!;
  const match = arr.findIndex((p) => props.dx === p.dx);
  if (match < 0) {
    return false;
  }
  // loose equality is intentional because there can be null != undefined.
  if (arr[match].nickname != props.nickname) {
    return false;
  }
  arr[match] = mergeSongProps(arr[match], props);
  return true;
}

function insertOrUpdateSongProps(
  map: Map<string, SongProperties[]>,
  props: SongPropertiesOverride,
  gameVer: DxVersion
) {
  if (updateSongProps(map, props)) {
    return;
  }
  // If debut is not set, set to current version.
  // This ensure chart level overrides always associate with a game version.
  if (!props.debut && props.debut !== 0) {
    props.debut = gameVer;
  }
  if (!map.has(props.name)) {
    map.set(props.name, []);
  }
  map.get(props.name).push(props as SongProperties);
}

export async function buildSongPropsMap(
  gameVer: DxVersion,
  gameRegion: GameRegion,
  text: string
): Promise<Map<string, SongProperties[]>> {
  const lines = text.split('\n');
  // songPropsByName: song name -> array of song properties
  // most arrays have only 1 entry, but some arrays have more than 1 entries
  // because 1 song can have both DX and Standard charts or 2 songs can have same name.
  const songPropsByName = new Map<string, SongProperties[]>();
  for (const line of lines) {
    const songProps = parseSongProperties(line);
    if (songProps) {
      insertOrUpdateSongProps(songPropsByName, songProps, gameVer);
    }
  }

  const chartLevelOverrides = await fetchChartLevelOverrides(gameVer);
  console.log('chartLevelOverrides', chartLevelOverrides);
  for (const songProps of chartLevelOverrides) {
    insertOrUpdateSongProps(songPropsByName, songProps, gameVer);
  }

  if (gameRegion === GameRegion.Intl) {
    const debutVersionOverrides = await fetchDebutVersionOverrides();
    console.log('debutVersionOverrides', debutVersionOverrides);
    for (const songProps of debutVersionOverrides) {
      updateSongProps(songPropsByName, songProps);
    }
  }

  const removedSongs = getRemovedSongs(gameRegion);
  for (const songName of removedSongs) {
    songPropsByName.delete(songName);
  }

  // validation: every song must have debut and lv
  songPropsByName.forEach((propsArr) => {
    for (const props of propsArr) {
      console.assert(props.debut != null);
      console.assert(props.debut >= 0 && props.debut <= LATEST_VERSION);
      console.assert(props.lv.length >= 4);
    }
  });
  return songPropsByName;
}

export function getSongProperties(
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  songName: string,
  genre: string,
  chartType: ChartType
): SongProperties | undefined {
  let songPropsArray = songPropsByName.get(songName);
  if (songPropsArray && songPropsArray.length > 0) {
    if (songPropsArray.length > 1) {
      // Song has multiple charts
      songPropsArray = songPropsArray.filter((d) => d.dx === chartType);
      if (songPropsArray.length > 1) {
        // Duplicate song names
        const nickname = getSongNickname(songName, genre, chartType);
        songPropsArray = songPropsArray.filter((d) => d.nickname === nickname);
      }
    }
    if (songPropsArray.length) {
      if (songPropsArray.length > 1) {
        console.warn(`Found multiple song properties for ${songName} ${chartType}`);
        console.warn(songPropsArray);
      }
      return songPropsArray[0];
    }
  }
  console.warn(`Could not find song properties for ${songName} ${chartType}`);
  return undefined;
}

export function filterSongsByVersion(
  songs: ReadonlyArray<BasicSongProps>,
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  gameVer: DxVersion,
  matchMode: MatchMode
): SongProperties[] {
  const fullProps: SongProperties[] = [];
  for (const s of songs) {
    const {dx, name, nickname} = s;
    let songPropsArray = songPropsByName.get(name);
    if (songPropsArray && songPropsArray.length > 0) {
      if (songPropsArray.length > 1) {
        // Song has multiple charts
        songPropsArray = songPropsArray.filter((d) => d.dx === dx);
        if (songPropsArray.length > 1) {
          // Duplicate song names
          songPropsArray = songPropsArray.filter((d) => d.nickname === nickname);
        }
      }
      if (songPropsArray.length) {
        if (songPropsArray.length > 1) {
          console.warn(`Found multiple song properties for ${name} ${dx ? '[DX]' : ''}`);
          console.warn(songPropsArray);
        }
        if (
          (matchMode === MatchMode.EQUAL && songPropsArray[0].debut === gameVer) ||
          (matchMode === MatchMode.OLDER && songPropsArray[0].debut < gameVer)
        ) {
          fullProps.push(songPropsArray[0]);
        }
        continue;
      }
    }
    console.warn(`Could not find song properties for ${name} ${dx ? '[DX]' : ''}`);
  }
  return fullProps;
}

export function getSongsByVersion(
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  gameVer: DxVersion
): SongProperties[] {
  const fullProps: SongProperties[] = [];
  songPropsByName.forEach((props) =>
    props.forEach((p) => {
      if (p.debut === gameVer) {
        fullProps.push(p);
      }
    })
  );
  return fullProps;
}
