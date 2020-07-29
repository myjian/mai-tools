import {
  getChartDifficulty,
  getChartLevel,
  getChartType,
  getSongName,
} from '../js/common/fetch-score-util';
import {getSongIdx, isNicoNicoLink} from '../js/common/song-util';

async function buildSongDb() {
  const rows = Array.from(
    document.querySelectorAll(".w_450.m_15.p_r.f_0") as NodeListOf<HTMLElement>
  );
  const songs = [];
  for (const d of rows) {
    const idx = getSongIdx(d);
    let n = getSongName(d);
    const di = getChartDifficulty(d);
    let lv = getChartLevel(d);
    const c = getChartType(d);
    if (n === "Link") {
      n = (await isNicoNicoLink(idx)) ? "Link(nico)" : "Link(orig)";
    } else if (n === "+♂" || n === "39") {
      n = "'" + n;
    }
    if (c === "DX") {
      n += " [dx]";
    }
    if (!lv.includes("+")) {
      lv = "'" + lv;
    }
    songs.push([n, di, lv].join("\t"));
  }
  return songs;
}

async function main() {
  console.log(await buildSongDb());
}

main();
