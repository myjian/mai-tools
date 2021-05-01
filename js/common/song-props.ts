import {DxVersion} from './constants';
import {getSongNickname} from './song-util';

export const enum ChartType {
  STANDARD,
  DX,
}

export interface BasicSongProps {
  dx: ChartType;
  name: string;
  nickname?: string;
}

export interface SongProperties extends BasicSongProps {
  debut: DxVersion;
  lv: ReadonlyArray<number>;
}

export const enum MatchMode {
  EQUAL,
  OLDER,
}

const DX_REGEX = /\bdx\s*:\s*([0-9]+)/;
const LV_REGEX = /\blv\s*:\s*(\[.+?\])/;
const VERSION_REGEX = /\bv\s*:\s*([0-9]+)/;
const SONGNAME_REGEX = /\bn\s*:\s*["'](.+?)['"]\s*[,\}]/;
const SONGNICKNAME_REGEX = /\bnn\s*:\s*["'](.+?)['"]\s*[,\}]/;

const INTL_VER_SONG_PROPS: ReadonlyArray<SongProperties> = [
  {
    name: "BREaK! BREaK! BREaK!",
    lv: [-6, -8, 12.8, 14.7, 0],
    debut: DxVersion.SPLASH,
    dx: 1,
  },
];

function fixMismatchSongName(name: string) {
  if (name === "D✪N’T  ST✪P  R✪CKIN’") {
    return "D✪N’T ST✪P R✪CKIN’";
  }
  return name.replace(/" \+ '/g, "").replace(/' \+ "/g, "");
}

/**
 * Parse song properties from text.
 *
 * Example text format:
 * {dx:0, v: 2, lv:[4.0, 6.0, 8.8, 10.9, 12.3], n:"Bad Apple!! feat nomico", nn:"Bad Apple!!"},
 * {dx:1, v:13, lv:[3.0, 7.0, 9.2, 11.8, 0], n:"METEOR"},
 */
function parseSongProperties(line: string): SongProperties {
  const dxMatch = line.match(DX_REGEX);
  const lvMatch = line.match(LV_REGEX);
  const debutVerMatch = line.match(VERSION_REGEX);
  const songNameMatch = line.match(SONGNAME_REGEX);
  const nicknameMatch = line.match(SONGNICKNAME_REGEX);
  if (dxMatch && lvMatch && debutVerMatch && songNameMatch) {
    return {
      dx: parseInt(dxMatch[1]) as 0 | 1,
      lv: JSON.parse(lvMatch[1]),
      debut: parseInt(debutVerMatch[1]),
      name: fixMismatchSongName(songNameMatch[1]),
      nickname: nicknameMatch && nicknameMatch[1],
    };
  }
}

function insertOrUpdateSongProps(map: Map<string, SongProperties[]>, props: SongProperties) {
  if (!map.has(props.name)) {
    map.set(props.name, []);
  }
  const arr = map.get(props.name);
  arr.push(props);
}

export function buildSongPropsMap(text: string): Map<string, SongProperties[]> {
  const lines = text.split("\n");
  // songPropsByName: song name -> array of song properties
  // most arrays have only 1 entry, but some arrays have more than 1 entries
  // because song name duplicates or it has both DX and Standard charts.
  const songPropsByName = new Map<string, SongProperties[]>();
  for (const line of lines) {
    const songProps = parseSongProperties(line);
    if (songProps) {
      insertOrUpdateSongProps(songPropsByName, songProps);
    }
  }
  for (const songProps of INTL_VER_SONG_PROPS) {
    insertOrUpdateSongProps(songPropsByName, songProps);
  }
  return songPropsByName;
}

export function getSongProperties(
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  songName: string,
  genre: string,
  chartType: ChartType
) {
  let songPropsArray = songPropsByName.get(songName);
  if (songPropsArray && songPropsArray.length > 0) {
    if (songPropsArray.length > 1) {
      // Song has multiple charts
      songPropsArray = songPropsArray.filter((d) => d.dx === chartType);
      if (songPropsArray.length > 1) {
        // Duplicate song names
        const nickname = getSongNickname(songName, genre);
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
  return null;
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
          console.warn(`Found multiple song properties for ${name} ${dx ? "[DX]" : ""}`);
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
    console.warn(`Could not find song properties for ${name} ${dx ? "[DX]" : ""}`);
  }
  return fullProps;
}
