import {fetchPage} from './util';

export function getSongIdx(row: HTMLElement) {
  return (row.getElementsByTagName("form")[0].elements.namedItem("idx") as HTMLInputElement).value;
}

export function getSongNickname(name: string, genre: string, isDxChart?: boolean) {
  if (name === "Link") {
    name = genre.includes("niconico") ? "Link(nico)" : "Link(org)";
  }
  return isDxChart ? name + "[dx]" : name;
}

let cachedLinkIdx: {nico?: string; original?: string} = {};

export async function isNicoNicoLink(idx: string) {
  if (cachedLinkIdx.nico === idx) {
    return true;
  }
  if (cachedLinkIdx.original === idx) {
    return false;
  }
  const dom = await fetchPage(
    "/maimai-mobile/record/musicDetail/?" + new URLSearchParams([["idx", idx]]).toString()
  );
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
