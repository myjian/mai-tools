import {DIFFICULTIES} from '../js/common/constants';
import {getChartDifficulty, getChartType, getSongName} from '../js/common/fetch-score-util';
import {getDefaultLevel} from '../js/common/level-helper';
import {iWantSomeMagic} from '../js/common/magic';
import {buildSongPropsMap, getSongProperties, SongProperties} from '../js/common/song-props';
import {getSongIdx, isNicoNicoLink} from '../js/common/song-util';
import {fetchGameVersion} from '../js/common/util';

type SortBy =
  | "none"
  | "level_des"
  | "level_asc"
  | "inlv_des"
  | "inlv_asc"
  | "rank_des"
  | "rank_asc"
  | "apfc_des"
  | "apfc_asc";
type Cache = {
  songProps?: Map<string, SongProperties[]>;
  nicoLinkIdx?: string;
  originalLinkIdx?: string;
};

(function (d) {
  const CHART_LEVELS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "7+",
    "8",
    "8+",
    "9",
    "9+",
    "10",
    "10+",
    "11",
    "11+",
    "12",
    "12+",
    "13",
    "13+",
    "14",
    "14+",
    "15",
  ];
  const RANK_TITLES = [
    "SSS+",
    "SSS",
    "SS+",
    "SS",
    "S+",
    "S",
    "AAA",
    "AA",
    "A",
    "BBB",
    "BB",
    "B",
    null,
  ];
  const AP_FC_TYPES = ["AP+", "AP", "FC+", "FC", null];
  const LV_DELTA = 0.02;

  const cache: Cache = {};

  function addOfficialLvDataset() {
    Array.from(d.getElementsByClassName("music_lv_block") as HTMLCollectionOf<HTMLElement>).forEach(
      (n) => {
        if (!n.dataset["lv"]) n.dataset["lv"] = n.innerText;
      }
    );
  }

  function isEstimateLv(lv: number) {
    const majorLv = Math.floor(lv);
    const minorLv = lv - majorLv;
    return (minorLv > 0.95) ? 1 : (minorLv > 0.65 && minorLv < 0.69) ? 0.7 : 0;
  }

  function getInLvSecTitle(lv: number) {
    const isEstimate = isEstimateLv(lv);
    if (!isEstimate) {
      return "INTERNAL LEVEL " + lv.toFixed(1);
    } else if (isEstimate < 1) {
      return "UNKNOWN LEVEL " + Math.floor(lv) + "+";
    }
    return "UNKNOWN LEVEL " + lv.toFixed(0);
  }

  function createMap(sections: string[], reverse: boolean) {
    const map = new Map();
    if (reverse) {
      sections.reverse();
    }
    for (const sec of sections) {
      map.set(sec, []);
    }
    if (reverse) {
      sections.reverse();
    }
    return map;
  }

  function getSectionTitle(prefix: string, section: string, size: number, totalSize: number) {
    let title = "\u25D6";
    if (prefix && section) {
      title += prefix + " " + section;
    } else if (prefix) {
      title += "NO " + prefix;
    } else if (section) {
      title += section;
    } else {
      title += " --- ";
    }
    return title + "\u25D7\u3000\u3000\u3000" + size + "/" + totalSize;
  }

  function createRowsWithSection(
    map: Map<string, HTMLElement[]>,
    headingPrefix: string,
    totalSize: number
  ) {
    let rows: HTMLElement[] = [];
    map.forEach((subRows, section) => {
      if (subRows.length) {
        const sectionHeading = d.createElement("div");
        sectionHeading.className = "screw_block m_15 f_15";
        sectionHeading.innerText = getSectionTitle(
          headingPrefix,
          section,
          subRows.length,
          totalSize
        );
        rows.push(sectionHeading);
        rows = rows.concat(subRows);
      }
    });
    return rows;
  }

  function getChartLvElem(row: HTMLElement) {
    return row.getElementsByClassName("music_lv_block")[0] as HTMLElement;
  }

  function getChartLv(row: HTMLElement, key: string = "lv"): string {
    return getChartLvElem(row).dataset[key];
  }

  function saveInLv(row: HTMLElement, lv: number) {
    const elem = getChartLvElem(row);
    if (!elem.dataset["inlv"]) {
      const isEstimate = isEstimateLv(lv);
      elem.dataset["inlv"] = lv.toFixed(2);
      const t = (isEstimate ? "*" : "") + lv.toFixed(1);
      if (t.length > 4) {
        elem.classList.remove("f_14");
        elem.classList.add("f_13");
      }
      elem.innerText = t;
    }
  }

  function coalesceInLv(row: HTMLElement, lvIndex: number, props?: SongProperties) {
    let lv = 0;
    if (props) {
      lv = props.lv[lvIndex];
      if (typeof lv !== "number") {
        lv = 0;
      } else if (lv < 0) {
        // console.warn("lv is negative for song " + song, props);
        lv = Math.abs(lv) - LV_DELTA;
      }
    }
    return lv || getDefaultLevel(getChartLv(row)) - LV_DELTA;
  }

  function getChartInLv(row: HTMLElement, songProps: Map<string, SongProperties[]>) {
    const inLvText = getChartLv(row, "inlv");
    if (inLvText) {
      return parseFloat(inLvText);
    }
    const song = getSongName(row);
    const t = getChartType(row);
    const lvIndex = DIFFICULTIES.indexOf(getChartDifficulty(row));
    let props: SongProperties | undefined;
    if (song === "Link") {
      const idx = getSongIdx(row);
      if (cache.nicoLinkIdx === idx) {
        props = getSongProperties(songProps, song, "niconico", t);
      } else if (cache.originalLinkIdx === idx) {
        props = getSongProperties(songProps, song, "", t);
      }
      console.log(props);
    } else {
      props = getSongProperties(songProps, song, "", t);
    }
    return coalesceInLv(row, lvIndex, props);
  }

  function compareInLv(row1: HTMLElement, row2: HTMLElement) {
    const lv1 = getChartInLv(row1, cache.songProps);
    const lv2 = getChartInLv(row2, cache.songProps);
    return lv1 < lv2 ? -1 : lv2 < lv1 ? 1 : 0;
  }

  function sortRowsByLevel(rows: NodeListOf<HTMLElement>, reverse: boolean) {
    const map = createMap(CHART_LEVELS, reverse);
    rows.forEach((row) => {
      const lv = getChartLv(row);
      map.get(lv).push(row);
    });
    if (cache.songProps) {
      map.forEach((subRows) => {
        subRows.sort(compareInLv);
        if (reverse) {
          subRows.reverse();
        }
      });
    }
    return createRowsWithSection(map, "LEVEL", rows.length);
  }

  function getRankTitle(row: HTMLElement) {
    const imgs = row.children[0].querySelectorAll("img");
    if (imgs.length < 5) {
      return null;
    }
    const rankImgSrc = imgs[imgs.length - 1].src;
    const lastUnderscoreIdx = rankImgSrc.lastIndexOf("_");
    const lastDotIdx = rankImgSrc.lastIndexOf(".");
    const lowercaseRank = rankImgSrc.substring(lastUnderscoreIdx + 1, lastDotIdx);
    return lowercaseRank.replace("p", "+").toUpperCase();
  }

  function getAchievement(row: HTMLElement) {
    const elem = row.querySelector(".music_score_block.w_120") as HTMLElement;
    return elem ? parseFloat(elem.innerText) : elem;
  }

  function compareAchievement(row1: HTMLElement, row2: HTMLElement) {
    const ach1 = getAchievement(row1),
      ach2 = getAchievement(row2);
    if (ach1 === null && ach2 === null) {
      return 0;
    } else if (ach2 === null) {
      return -1;
    } else if (ach1 === null) {
      return 1;
    }
    return ach1 > ach2 ? -1 : ach1 < ach2 ? 1 : 0;
  }

  function sortRowsByRank(rows: NodeListOf<HTMLElement>, reverse: boolean) {
    const map = createMap(RANK_TITLES, reverse);
    rows.forEach((row) => {
      const rank = getRankTitle(row);
      map.get(rank).push(row);
    });
    map.forEach((subRows) => {
      subRows.sort(compareAchievement);
      if (reverse) {
        subRows.reverse();
      }
    });
    return createRowsWithSection(map, "RANK", rows.length);
  }

  function getApFcStatus(row: HTMLElement) {
    const imgs = row.children[0].querySelectorAll("img");
    if (imgs.length < 5) {
      return null;
    }
    const statusImgSrc = imgs[imgs.length - 2].src;
    const lastUnderscoreIdx = statusImgSrc.lastIndexOf("_");
    const lastDotIdx = statusImgSrc.lastIndexOf(".");
    const lowercaseStatus = statusImgSrc.substring(lastUnderscoreIdx + 1, lastDotIdx);
    if (lowercaseStatus === "back") {
      return null;
    }
    return lowercaseStatus.replace("ap", "AP").replace("p", "+").toUpperCase();
  }

  function sortRowsByApFc(rows: NodeListOf<HTMLElement>, reverse: boolean) {
    const map = createMap(AP_FC_TYPES, reverse);
    rows.forEach((row) => {
      const rank = getApFcStatus(row);
      map.get(rank).push(row);
    });
    return createRowsWithSection(map, "", rows.length);
  }

  function sortRowsByInLv(rows: NodeListOf<HTMLElement>, reverse: boolean) {
    const inLvSet = new Map<number, boolean>();
    const inLvs: number[] = [];
    for (const row of Array.from(rows)) {
      const lv = getChartInLv(row, cache.songProps);
      inLvSet.set(lv, true);
      inLvs.push(lv);
    }
    const sortedInLv = Array.from(inLvSet.keys()).sort((lv1, lv2) => {
      return lv1 > lv2 ? -1 : lv1 < lv2 ? 1 : 0;
    });
    if (reverse) {
      sortedInLv.reverse();
    }
    const map = new Map<string, HTMLElement[]>();
    sortedInLv.forEach((lv) => {
      map.set(getInLvSecTitle(lv), []);
    });
    Array.from(rows).forEach((row, index) => {
      map.get(getInLvSecTitle(inLvs[index])).push(row);
    });
    return createRowsWithSection(map, "", rows.length);
  }

  function getScoreRows() {
    return d.body.querySelectorAll(".main_wrapper.t_c .w_450.m_15.f_0") as NodeListOf<
      HTMLElement
    >;
  }

  function performSort(sortBy: SortBy) {
    const rows = getScoreRows();
    const screwBlocks = Array.from(
      d.body.querySelectorAll(".main_wrapper.t_c .screw_block") as NodeListOf<HTMLElement>
    );
    let sortedRows = null;
    switch (sortBy) {
      case "level_des":
        sortedRows = sortRowsByLevel(rows, true);
        break;
      case "level_asc":
        sortedRows = sortRowsByLevel(rows, false);
        break;
      case "rank_des":
        sortedRows = sortRowsByRank(rows, false);
        break;
      case "rank_asc":
        sortedRows = sortRowsByRank(rows, true);
        break;
      case "apfc_des":
        sortedRows = sortRowsByApFc(rows, false);
        break;
      case "apfc_asc":
        sortedRows = sortRowsByApFc(rows, true);
        break;
      case "inlv_des":
        sortedRows = sortRowsByInLv(rows, false);
        break;
      case "inlv_asc":
        sortedRows = sortRowsByInLv(rows, true);
        break;
      default:
        return;
    }
    for (let i = 1; i < screwBlocks.length; i++) {
      screwBlocks[i].remove();
    }
    const firstScrewBlock = screwBlocks[0];
    for (let i = sortedRows.length - 1; i >= 1; i--) {
      firstScrewBlock.insertAdjacentElement("afterend", sortedRows[i]);
    }
    firstScrewBlock.innerText = sortedRows[0].innerText;
  }

  function expandDualChartRows() {
    const songRecords = d.querySelectorAll("div.w_450.m_15.p_r.f_0[id]") as NodeListOf<HTMLElement>;
    songRecords.forEach((row) => {
      row.style.removeProperty("display");
      row.style.removeProperty("margin-top");
      if (row.id.includes("sta_")) {
        row.querySelector(".music_kind_icon_dx")?.remove();
      } else {
        row.querySelector(".music_kind_icon_standard")?.remove();
      }
      const chartTypeImg = row.querySelector("img:nth-child(2)") as HTMLImageElement;
      chartTypeImg.onclick = null;
      chartTypeImg.className = "music_kind_icon";
    });
  }

  function createOption(label: string, value: SortBy, hidden?: boolean) {
    let option = d.getElementsByClassName("option_" + value)[0] as HTMLOptionElement;
    if (!option) {
      option = d.createElement("option");
      option.className = "option_" + value;
      option.innerText = label;
      option.value = value;
    }
    if (hidden) {
      option.classList.add("d_n");
    } else {
      option.classList.remove("d_n");
    }
    return option;
  }

  function createSortOptions() {
    const id = "scoreSortContainer";
    let div = d.getElementById(id);
    if (div) {
      return div;
    }
    div = d.createElement("div");
    div.id = id;
    div.className = "w_450 m_15";
    const select = d.createElement("select");
    select.className = "w_300 m_10";
    select.addEventListener("change", (evt: Event) => {
      performSort((evt.target as HTMLSelectElement).value as SortBy);
    });
    select.append(createOption("-- Choose Sort Option --", "none"));
    select.append(createOption("Level (high \u2192 low)", "level_des"));
    select.append(createOption("Level (low \u2192 high)", "level_asc"));
    select.append(createOption("Internal Level (high \u2192 low)", "inlv_des", true));
    select.append(createOption("Internal Level (low \u2192 high)", "inlv_asc", true));
    select.append(createOption("Rank (high \u2192 low)", "rank_des"));
    select.append(createOption("Rank (low \u2192 high)", "rank_asc"));
    select.append(createOption("AP/FC (AP+ \u2192 FC)", "apfc_des"));
    select.append(createOption("AP/FC (FC \u2192 AP+)", "apfc_asc"));
    div.append(select);
    return div;
  }

  async function fetchAndAddInternalLvSort() {
    const gameVer = parseInt(await fetchGameVersion(d.body));
    const songProps = buildSongPropsMap(await iWantSomeMagic(gameVer));
    const rows = Array.from(getScoreRows());
    for (const row of rows) {
      const song = getSongName(row);
      if (song === "Link") {
        const idx = getSongIdx(row);
        const lvIndex = DIFFICULTIES.indexOf(getChartDifficulty(row));
        try {
          const isNico = await isNicoNicoLink(idx);
          let props: SongProperties;
          if (isNico) {
            cache.nicoLinkIdx = idx;
            props = getSongProperties(songProps, song, "niconico", "STANDARD");
          } else {
            cache.originalLinkIdx = idx;
            props = getSongProperties(songProps, song, "", "STANDARD");
          }
          saveInLv(row, coalesceInLv(row, lvIndex, props));
        } catch(e) {
          saveInLv(row, coalesceInLv(row, lvIndex));
        }
      } else {
        const lv = getChartInLv(row, songProps);
        saveInLv(row, lv);
      }
    }
    console.log("enabling internal level sort");
    createOption("Internal Level (high \u2192 low)", "inlv_des", false);
    createOption("Internal Level (low \u2192 high)", "inlv_asc", false);
    cache.songProps = songProps;
  }

  // main
  expandDualChartRows();
  addOfficialLvDataset();
  const firstScrewBlock = d.body.querySelector(".main_wrapper.t_c .screw_block");
  if (firstScrewBlock) {
    firstScrewBlock.insertAdjacentElement("beforebegin", createSortOptions());
    fetchAndAddInternalLvSort();
  }
})(document);
