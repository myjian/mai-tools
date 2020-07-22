import {getChartDifficulty, getChartLevel, getChartType, getSongName} from './shared/util';

export const INTL_LINK_NICO_ID =
  "023899fc4dbdd98b113f7bebf7df8e9f8ffb4d76676b3b540eb8dd01b497d01755d3af60e627f75573f1240ff5bbda6ca3e6778bcfa44d221ce8299b789735c64DPVQG1451GaSZWDqdbrHlEjQueD+xHaBqqorXqcaHY=";

function getSongIdx(row: HTMLElement) {
  return (row.getElementsByTagName("form")[0].elements.namedItem("idx") as HTMLInputElement).value;
}

function buildSongDb() {
  return Array.from(document.querySelectorAll(".w_450.m_15.p_r.f_0") as NodeListOf<HTMLElement>)
    .map((d) => {
      const id = getSongIdx(d);
      let n = getSongName(d);
      const di = getChartDifficulty(d);
      let lv = getChartLevel(d);
      const c = getChartType(d);
      if (n === "Link") {
        n = id === INTL_LINK_NICO_ID ? "Link(nico)" : "Link(orig)";
      } else if (n === "+♂" || n === "39") {
        n = "'" + n;
      }
      if (c === "DX") {
        n += " [dx]";
      }
      if (!lv.includes("+")) {
        lv = "'" + lv;
      }
      return {n, di, lv};
    })
    .map((d) => [d.n, d.di, d.lv].join("\t"));
}

console.log(buildSongDb());
