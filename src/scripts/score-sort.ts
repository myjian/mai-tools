import {DIFFICULTIES} from '../common/constants';
import {getChartDifficulty, getChartType, getSongName} from '../common/fetch-score-util';
import {SELF_SCORE_URLS} from '../common/fetch-self-score';
import {LANG} from '../common/lang';
import {getDefaultLevel} from '../common/level-helper';
import {iWantSomeMagic} from '../common/magic';
import {getSongIdx, isNicoNicoLink} from '../common/song-name-helper';
import {
  buildSongPropsMap,
  ChartType,
  getSongProperties,
  SongProperties,
} from '../common/song-props';
import {fetchGameVersion, fetchPage} from '../common/util';

enum SortBy {
  None = "None",
  RankDes = "RankDes",
  RankAsc = "RankAsc",
  ApFcDes = "ApFcDes",
  ApFcAsc = "ApFcAsc",
  SyncDes = "SyncDes",
  SyncAsc = "SyncAsc",
  VsResultAsc = "VsResultAsc",
  VsResultDes = "VsResultDes",
  LvDes = "LvDes",
  LvAsc = "LvAsc",
  InLvDes = "InLvDes",
  InLvAsc = "InLvAsc",
}

type Cache = {
  songProps?: Map<string, SongProperties[]>;
  nicoLinkIdx?: string;
  originalLinkIdx?: string;
};

(function (d) {
  const SortLabels: Record<SortBy, string> = {
    en: {
      [SortBy.None]: "-- Choose Sort Option --",
      [SortBy.RankAsc]: "Rank (low \u2192 high)",
      [SortBy.RankDes]: "Rank (high \u2192 low)",
      [SortBy.ApFcAsc]: "AP/FC (FC \u2192 AP+)",
      [SortBy.ApFcDes]: "AP/FC (AP+ \u2192 FC)",
      [SortBy.SyncAsc]: "Sync (FS \u2192 FDX+)",
      [SortBy.SyncDes]: "Sync (FDX+ \u2192 FS)",
      [SortBy.VsResultAsc]: "VS Result (Lose \u2192 Win)",
      [SortBy.VsResultDes]: "VS Result (Win \u2192 Lose)",
      [SortBy.LvAsc]: "Level (low \u2192 high)",
      [SortBy.LvDes]: "Level (high \u2192 low)",
      [SortBy.InLvAsc]: "Internal Level (low \u2192 high)",
      [SortBy.InLvDes]: "Internal Level (high \u2192 low)",
    },
    zh: {
      [SortBy.None]: "-- 選擇排序方式 --",
      [SortBy.RankAsc]: "達成率 (由低至高)",
      [SortBy.RankDes]: "達成率 (由高至低)",
      [SortBy.ApFcAsc]: "AP/FC (由 FC 到 AP+)",
      [SortBy.ApFcDes]: "AP/FC (由 AP+ 到 FC)",
      [SortBy.SyncAsc]: "Sync (由 FS 到 FDX+)",
      [SortBy.SyncDes]: "Sync (由 FDX+ 到 FS)",
      [SortBy.VsResultAsc]: "對戰結果 (由敗北到勝利)",
      [SortBy.VsResultDes]: "對戰結果 (由勝利到敗北)",
      [SortBy.LvAsc]: "譜面等級 (由低至高)",
      [SortBy.LvDes]: "譜面等級 (由高至低)",
      [SortBy.InLvAsc]: "內部譜面等級 (由低至高)",
      [SortBy.InLvDes]: "內部譜面等級 (由高至低)",
    },
  }[LANG];
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
    "C",
    "D",
    null,
  ];
  const AP_FC_TYPES = ["AP+", "AP", "FC+", "FC", null];
  const SYNC_TYPES = ["FDX+", "FDX", "FS+", "FS", null];
  const VS_RESULTS = ["WIN", "DRAW", "LOSE"];
  const LV_DELTA = 0.02;
  const isFriendScore = location.pathname.includes("battleStart");
  const isDxScoreVs = location.search.includes("scoreType=1");

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
    return minorLv > 0.95 ? 1 : minorLv > 0.65 && minorLv < 0.69 ? 0.7 : 0;
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
    const map = new Map<string, HTMLElement[]>();
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
      const idx = isFriendScore ? null : getSongIdx(row);
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
    const rankImg = isFriendScore
      ? row.querySelector("tr:last-child td:last-child img:last-child")
      : row.children[0].querySelector("img.f_r:not(.music_kind_icon):last-of-type");
    if (!rankImg) {
      return null;
    }
    const rankImgPath = new URL((rankImg as HTMLImageElement).src).pathname;
    const lowercaseRank = rankImgPath.substring(
      rankImgPath.lastIndexOf("_") + 1,
      rankImgPath.lastIndexOf(".")
    );
    if (lowercaseRank === "back") {
      return null;
    }
    return lowercaseRank.replace("p", "+").toUpperCase();
  }

  function getAchievement(row: HTMLElement) {
    const elem = isFriendScore
      ? row.querySelector("tr:first-child td:last-child")
      : row.querySelector(".music_score_block.w_120");
    return elem ? parseFloat((elem as HTMLElement).innerText) : elem;
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
      try {
        map.get(rank).push(row);
      } catch (e) {
        console.warn(rank);
        map.get(null).push(row);
      }
    });
    if (!isDxScoreVs) {
      map.forEach((subRows, key) => {
        subRows.sort(compareAchievement);
        if (key !== null && reverse) {
          subRows.reverse();
        }
      });
    }
    return createRowsWithSection(map, "RANK", rows.length);
  }

  function getApFcStatus(row: HTMLElement) {
    const img = isFriendScore
      ? row.querySelector("tr:last-child td:last-child img:nth-child(2)")
      : row.children[0].querySelector("img.f_r:nth-last-of-type(2)");
    if (!img) {
      return null;
    }
    const statusImgSrc = (img as HTMLImageElement).src.replace(/\?ver=.*$/, "");
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
      const status = getApFcStatus(row);
      map.get(status).push(row);
    });
    return createRowsWithSection(map, "", rows.length);
  }

  function getSyncStatus(row: HTMLElement) {
    const img = isFriendScore
      ? row.querySelector("tr:last-child td:last-child img:first-child")
      : row.children[0].querySelector("img.f_r:nth-last-of-type(3)");
    if (!img) {
      return null;
    }
    const statusImgSrc = (img as HTMLImageElement).src.replace(/\?ver=.*$/, "");
    const lastUnderscoreIdx = statusImgSrc.lastIndexOf("_");
    const lastDotIdx = statusImgSrc.lastIndexOf(".");
    const lowercaseStatus = statusImgSrc.substring(lastUnderscoreIdx + 1, lastDotIdx);
    if (lowercaseStatus === "back") {
      return null;
    }
    return lowercaseStatus.replace("sd", "DX").replace("p", "+").toUpperCase();
  }

  function sortRowsBySync(rows: NodeListOf<HTMLElement>, reverse: boolean) {
    const map = createMap(SYNC_TYPES, reverse);
    rows.forEach((row) => {
      const sync = getSyncStatus(row);
      map.get(sync).push(row);
    });
    return createRowsWithSection(map, "", rows.length);
  }

  function getVsResult(row: HTMLElement) {
    const img = row.querySelector("tr:first-child td:nth-child(2) img");
    const imgSrc = (img as HTMLImageElement).src.replace(/\?ver=.*$/, "");
    const lastUnderscoreIdx = imgSrc.lastIndexOf("_");
    const lastDotIdx = imgSrc.lastIndexOf(".");
    return imgSrc.substring(lastUnderscoreIdx + 1, lastDotIdx).toUpperCase();
  }

  function sortRowsByVsResult(rows: NodeListOf<HTMLElement>, reverse: boolean) {
    const map = createMap(VS_RESULTS, reverse);
    rows.forEach((row) => {
      const res = getVsResult(row);
      map.get(res).push(row);
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
    return d.body.querySelectorAll(".main_wrapper.t_c .w_450.m_15.f_0") as NodeListOf<HTMLElement>;
  }

  function performSort(sortBy: SortBy) {
    const rows = getScoreRows();
    const screwBlocks = Array.from(
      d.body.querySelectorAll(".main_wrapper.t_c .screw_block") as NodeListOf<HTMLElement>
    );
    let sortedRows = null;
    switch (sortBy) {
      case SortBy.RankDes:
        sortedRows = sortRowsByRank(rows, false);
        break;
      case SortBy.RankAsc:
        sortedRows = sortRowsByRank(rows, true);
        break;
      case SortBy.ApFcDes:
        sortedRows = sortRowsByApFc(rows, false);
        break;
      case SortBy.ApFcAsc:
        sortedRows = sortRowsByApFc(rows, true);
        break;
      case SortBy.SyncDes:
        sortedRows = sortRowsBySync(rows, false);
        break;
      case SortBy.SyncAsc:
        sortedRows = sortRowsBySync(rows, true);
        break;
      case SortBy.VsResultAsc:
        sortedRows = sortRowsByVsResult(rows, true);
        break;
      case SortBy.VsResultDes:
        sortedRows = sortRowsByVsResult(rows, false);
        break;
      case SortBy.LvDes:
        sortedRows = sortRowsByLevel(rows, true);
        break;
      case SortBy.LvAsc:
        sortedRows = sortRowsByLevel(rows, false);
        break;
      case SortBy.InLvDes:
        sortedRows = sortRowsByInLv(rows, false);
        break;
      case SortBy.InLvAsc:
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

  async function addSummaryBlock() {
    const scorePage = await fetchPage(SELF_SCORE_URLS.get("Re:MASTER"));
    const summaryTable = scorePage.querySelector(".music_scorelist_table").parentElement;
    summaryTable.querySelector("tr:last-child").remove();
    const rows = getScoreRows();
    const total = rows.length;
    const apfcCount: Record<string, number> = {};
    const syncCount: Record<string, number> = {};
    const rankCount: Record<string, number> = {};
    for (let i = 0; i < AP_FC_TYPES.length; i++) {
      apfcCount[AP_FC_TYPES[i]] = 0;
      syncCount[SYNC_TYPES[i]] = 0;
    }
    for (let i = 0; i < RANK_TITLES.length; i++) {
      rankCount[RANK_TITLES[i]] = 0;
    }
    rows.forEach((row) => {
      apfcCount[getApFcStatus(row)]++;
      syncCount[getSyncStatus(row)]++;
      rankCount[getRankTitle(row)]++;
    });

    // 9 is the index of A in RANK_TITLES
    for (let i = 1; i < 9; i++) {
      rankCount[RANK_TITLES[i]] += rankCount[RANK_TITLES[i - 1]];
    }
    // 4 is the index of null
    for (let i = 1; i < 4; i++) {
      apfcCount[AP_FC_TYPES[i]] += apfcCount[AP_FC_TYPES[i - 1]];
      syncCount[SYNC_TYPES[i]] += syncCount[SYNC_TYPES[i - 1]];
    }

    // populate summaryTable with the counts we just collected
    let columns = summaryTable.querySelectorAll("tr:first-child .f_11");
    columns[0].innerHTML = `${rankCount["A"]}/${total}`;
    columns[1].innerHTML = `${rankCount["S"]}/${total}`;
    columns[2].innerHTML = `${rankCount["S+"]}/${total}`;
    columns[3].innerHTML = `${rankCount["SS"]}/${total}`;
    columns[4].innerHTML = `${rankCount["SS+"]}/${total}`;
    columns[5].innerHTML = `${rankCount["SSS"]}/${total}`;
    columns[6].innerHTML = `${rankCount["SSS+"]}/${total}`;
    columns = summaryTable.querySelectorAll("tr:last-child .f_11");
    columns[0].innerHTML = `${apfcCount["FC"]}/${total}`;
    columns[1].innerHTML = `${apfcCount["FC+"]}/${total}`;
    columns[2].innerHTML = `${apfcCount["AP"]}/${total}`;
    columns[3].innerHTML = `${apfcCount["AP+"]}/${total}`;
    columns[4].innerHTML = `${syncCount["FS"]}/${total}`;
    columns[5].innerHTML = `${syncCount["FS+"]}/${total}`;
    columns[6].innerHTML = `${syncCount["FDX"]}/${total}`;
    columns[7].innerHTML = `${syncCount["FDX+"]}/${total}`;

    const vsResultBlock = d.querySelector(".town_block + .see_through_block");
    vsResultBlock.insertAdjacentElement("afterend", summaryTable);
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

  function createOption(sortBy: SortBy, hidden?: boolean) {
    const label = SortLabels[sortBy];
    let option = d.getElementsByClassName("option_" + sortBy)[0] as HTMLOptionElement;
    if (!option) {
      option = d.createElement("option");
      option.className = "option_" + sortBy;
      option.innerText = label;
      option.value = sortBy;
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
    select.append(createOption(SortBy.None));
    select.append(createOption(SortBy.RankAsc));
    select.append(createOption(SortBy.RankDes));
    select.append(createOption(SortBy.ApFcAsc));
    select.append(createOption(SortBy.ApFcDes));
    select.append(createOption(SortBy.SyncAsc));
    select.append(createOption(SortBy.SyncDes));
    if (isFriendScore) {
      select.append(createOption(SortBy.VsResultAsc));
      select.append(createOption(SortBy.VsResultDes));
    }
    select.append(createOption(SortBy.LvAsc));
    select.append(createOption(SortBy.LvDes));
    select.append(createOption(SortBy.InLvAsc, true));
    select.append(createOption(SortBy.InLvDes, true));
    div.append(select);
    return div;
  }

  async function fetchAndAddInternalLvSort() {
    const gameVer = await fetchGameVersion(d.body);
    const songProps = buildSongPropsMap(await iWantSomeMagic(gameVer));
    const rows = Array.from(getScoreRows());
    for (const row of rows) {
      const song = getSongName(row);
      if (song === "Link") {
        const lvIndex = DIFFICULTIES.indexOf(getChartDifficulty(row));
        try {
          // idx is not available on friend score page and getSongIdx will throw.
          const idx = getSongIdx(row);
          const isNico = await isNicoNicoLink(idx);
          let props: SongProperties;
          if (isNico) {
            cache.nicoLinkIdx = idx;
            props = getSongProperties(songProps, song, "niconico", ChartType.STANDARD);
          } else {
            cache.originalLinkIdx = idx;
            props = getSongProperties(songProps, song, "", ChartType.STANDARD);
          }
          saveInLv(row, coalesceInLv(row, lvIndex, props));
        } catch (e) {
          saveInLv(row, coalesceInLv(row, lvIndex));
        }
      } else {
        const lv = getChartInLv(row, songProps);
        saveInLv(row, lv);
      }
    }
    console.log("enabling internal level sort");
    createOption(SortBy.InLvAsc, false);
    createOption(SortBy.InLvDes, false);
    cache.songProps = songProps;
  }

  // main
  if (isFriendScore) {
    addSummaryBlock();
  } else {
    expandDualChartRows();
  }
  addOfficialLvDataset();
  const firstScrewBlock = d.body.querySelector(".main_wrapper.t_c .screw_block");
  if (firstScrewBlock) {
    firstScrewBlock.insertAdjacentElement("beforebegin", createSortOptions());
    fetchAndAddInternalLvSort();
  }
})(document);
