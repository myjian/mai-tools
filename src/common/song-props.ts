import {DIFFICULTIES} from "./difficulties";
import {DxVersion} from "./game-version";
import {getSongNickname, normalizeSongName} from "./song-name-helper";

export const enum ChartType {
  STANDARD = 0,
  DX = 1,
}

export interface BasicSongProps {
  dx: ChartType;
  name: string;
  nickname?: string | null;
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
const VERSION_REGEX = /\bv\s*:\s*(-?[0-9]+)/;
const SONGNAME_REGEX = /\bn\s*:\s*["'](.+?)['"]\s*[,\}]/;
const SONGNICKNAME_REGEX = /\bnn\s*:\s*["'](.+?)['"]\s*[,\}]/;

const INTL_VER_SONG_PROPS: ReadonlyArray<SongProperties> = [
  {dx: 1, debut: 16, lv: [5, 8.2, 12.2, 14.4, 0], name: "宿星審判"},
];

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

function insertOrUpdateSongProps(map: Map<string, SongProperties[]>, props: SongProperties) {
  if (!map.has(props.name)) {
    map.set(props.name, []);
  }
  const arr = map.get(props.name)!;
  const match = arr.findIndex((p) => props.dx === p.dx);
  if (match >= 0) {
    // replace same chart type
    arr[match] = props;
  } else {
    arr.push(props);
  }
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
