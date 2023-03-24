import {ChartType} from './chart-type';
import {fetchSongDetailPage} from './util';

export const DX_SONG_NAME_SUFFIX = " [DX]";
export const RATING_TARGET_SONG_NAME_PREFIX = "▶ ";

export function normalizeSongName(name: string) {
  if (name === "D✪N’T  ST✪P  R✪CKIN’") {
    return "D✪N’T ST✪P R✪CKIN’";
  }
  return name.replace(/" \+ '/g, "").replace(/' \+ "/g, "");
}

export function getSongIdx(row: HTMLElement) {
  return (row.getElementsByTagName("form")[0].elements.namedItem("idx") as HTMLInputElement).value;
}

export function getSongNickname(name: string, genre: string, chartType: ChartType) {
  if (name === "Link") {
    name = genre.includes("niconico") ? "Link(nico)" : "Link(org)";
  }
  return chartType === ChartType.DX ? name + DX_SONG_NAME_SUFFIX : name;
}

let cachedLinkIdx: {nico?: string; original?: string} = {};

export async function isNicoNicoLink(idx: string): Promise<boolean> {
  if (cachedLinkIdx.nico === idx) {
    return true;
  }
  if (cachedLinkIdx.original === idx) {
    return false;
  }
  const dom = await fetchSongDetailPage(idx);
  const isNico = (dom.body.querySelector(".m_10.m_t_5.t_r.f_12") as HTMLElement).innerText.includes(
    "niconico"
  );
  console.log("Link (idx: " + idx + ") " + (isNico ? "is niconico" : "is original"));
  if (isNico) {
    cachedLinkIdx.nico = idx;
  } else {
    cachedLinkIdx.original = idx;
  }
  return isNico;
}

export function isNiconicoLinkImg(imgSrc: string): boolean {
  return imgSrc.includes("e90f79d9dcff84df");
}
