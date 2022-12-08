import {DIFFICULTY_CLASSNAME_MAP} from '../common/difficulties';
import {determineDxStarText} from '../common/dx-star';
import {getInitialLanguage, Language} from '../common/lang';
import {removeScrollControl} from '../common/net-helpers';
import {getScriptHost} from '../common/script-host';

type ScoreRecord = {
  date: Date;
  songName: string;
  songImgSrc: string;
  difficulty: string;
  achievement: number;
  stamps: string;
  isNewRecord: boolean;
};
type Options = {
  dates?: Set<string>;
  showAll?: boolean;
  olderFirst?: boolean;
};
declare var domtoimage: any;
(function (d) {
  const LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      date: "日期",
      songName: "歌曲",
      difficulty: "難度",
      achievement: "達成率",
      stamps: "成就",
      playDate: "遊玩日期：",
      newRecordToggleHeading: "顯示：",
      sortBy: "排序方式：",
      newRecordsOnly: "只顯示新高分紀錄",
      allRecords: "全部",
      olderFirst: "由舊到新",
      newerFirst: "由新到舊",
      copy: "複製",
      copied: "已複製到剪貼簿",
      downloadAsImage: "存成圖片",
    },
    [Language.en_US]: {
      date: "Date",
      songName: "Song",
      difficulty: "Difficulty",
      achievement: "Achv",
      stamps: "Grade",
      playDate: "Play date:",
      newRecordToggleHeading: "Display:",
      sortBy: "Sort by:",
      newRecordsOnly: "New records only",
      allRecords: "All",
      olderFirst: "Older first",
      newerFirst: "Newer first",
      copy: "Copy",
      copied: "Copied to clipboard",
      downloadAsImage: "Save as image",
    },
  }[LANG];

  const AP_FC_IMG_NAME_TO_TEXT = new Map([
    ["fc", "FC"],
    ["fcplus", "FC+"],
    ["ap", "AP"],
    ["applus", "AP+"],
  ]);

  const FS_FDX_IMG_NAME_TO_TEXT = new Map([
    ["fs", "FS"],
    ["fsplus", "FS+"],
    ["fsd", "FSD"],
    ["fsdplus", "FSD+"],
  ]);
  const DATE_CHECKBOX_CLASSNAME = "dateCheckbox";
  const NEW_RECORD_RADIO_NAME = "newRecordRadio";
  const SORT_BY_RADIO_NAME = "sortByRadio";
  const SCORE_RECORD_ROW_CLASSNAME = "recordRow";
  const SCORE_RECORD_CELL_BASE_CLASSNAME = "recordCell";
  const SCORE_RECORD_CELL_CLASSNAMES = [
    "dateCell",
    "songTitleCell",
    "difficultyCell",
    "achievementCell",
    "stampsCell",
  ];
  const SCRIPT_HOST = getScriptHost("recent-play-downloader");

  const ce = d.createElement.bind(d);
  // 540 = 9 * 60 minutes = UTC+9 (Japan Time), 1 minute = 60000 milliseconds
  const timezoneOffset = (540 + new Date().getTimezoneOffset()) * 60000;

  function padNumberWithZeros(n: number, len?: number) {
    len = len || 2;
    return n.toString().padStart(len, "0");
  }

  function getPlayDate(row: HTMLElement) {
    const playDateText = (row.querySelector(".sub_title").children[1] as HTMLElement).innerText;
    const m = playDateText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const japanDt = new Date(
      parseInt(m[1]),
      parseInt(m[2]) - 1,
      parseInt(m[3]),
      parseInt(m[4]),
      parseInt(m[5])
    );
    return new Date(japanDt.valueOf() - timezoneOffset);
  }

  function getSongName(row: HTMLElement) {
    try {
      return (row.querySelector(".m_5.p_5.f_13") as HTMLElement).textContent;
    } catch (e) {
      console.log(e);
      console.log(row);
      return "";
    }
  }

  function getSongImgSrc(row: HTMLElement): string {
    const img = row.querySelector(".music_img") as HTMLImageElement;
    return img ? img.src : "";
  }

  function getDifficulty(row: HTMLElement) {
    const recordBody = row.children[1];
    const cn = recordBody.className;
    let diff = cn.substring(cn.indexOf("_") + 1, cn.lastIndexOf("_"));
    diff = diff === "remaster" ? "Re:MASTER" : diff.toUpperCase();
    const isDxChart = (
      row.querySelector(".playlog_music_kind_icon") as HTMLImageElement
    ).src.endsWith("music_dx.png");
    return isDxChart ? "DX " + diff : diff;
  }

  function getAchievement(row: HTMLElement) {
    return parseFloat((row.querySelector(".playlog_achievement_txt") as HTMLElement).innerText);
  }

  /*
    ✦ - 85%
    ✦✦ - 90%
    ✦✦✦ - 93%
    ✦✦✦✦ - 95%
    ✦✦✦✦✦ - 97%
    ✦6 - 99%
    ✦7 - 100%
  */
  function getDxStar(row: HTMLElement): string {
    const dxScoreBlock = row.querySelector(".playlog_score_block_star");
    if (!dxScoreBlock) {
      return "";
    }
    const [playerDxScore, maxDxScore] = dxScoreBlock.textContent
      .split("/")
      .map((t) => parseInt(t.replace(",", "").trim()));
    return determineDxStarText(playerDxScore / maxDxScore);
  }

  function getStamps(row: HTMLElement): string {
    const rankImgSrc = (row.querySelector("img.playlog_scorerank") as HTMLImageElement).src.replace(
      /\?ver=.*$/,
      ""
    );
    const rank = rankImgSrc
      .substring(rankImgSrc.lastIndexOf("/") + 1, rankImgSrc.lastIndexOf("."))
      .replace("plus", "+")
      .toUpperCase();
    let result = rank;

    // FC/AP
    const stampImgs = row.querySelectorAll(
      ".playlog_result_innerblock > img"
    ) as NodeListOf<HTMLImageElement>;
    const fcapSrc = stampImgs[0].src.replace(/\?ver=.*$/, "");
    const fcapImgName = fcapSrc.substring(fcapSrc.lastIndexOf("/") + 1, fcapSrc.lastIndexOf("."));
    if (AP_FC_IMG_NAME_TO_TEXT.has(fcapImgName)) {
      result += " / " + AP_FC_IMG_NAME_TO_TEXT.get(fcapImgName);
    }

    // SYNC
    const fullSyncSrc = stampImgs[1].src.replace(/\?ver=.*$/, "");
    const fullSyncImgName = fullSyncSrc.substring(
      fullSyncSrc.lastIndexOf("/") + 1,
      fullSyncSrc.lastIndexOf(".")
    );
    if (FS_FDX_IMG_NAME_TO_TEXT.has(fullSyncImgName)) {
      result += " / " + FS_FDX_IMG_NAME_TO_TEXT.get(fullSyncImgName);
    }

    // DX Star
    const dxStar = getDxStar(row);
    if (dxStar) {
      result += " / " + dxStar;
    }
    return result;
  }

  function getIsNewRecord(row: HTMLElement) {
    return !!row.querySelector(
      ".playlog_achievement_label_block + img.playlog_achievement_newrecord"
    );
  }

  async function collectRecentPlays(): Promise<ScoreRecord[]> {
    const scoreList = Array.from(
      d.querySelectorAll(".main_wrapper .p_10.t_l.f_0.v_b")
    ) as HTMLElement[];
    const results: ScoreRecord[] = [];
    for (const row of scoreList) {
      results.push({
        date: getPlayDate(row),
        songName: getSongName(row),
        songImgSrc: getSongImgSrc(row),
        difficulty: getDifficulty(row),
        achievement: getAchievement(row),
        stamps: getStamps(row),
        isNewRecord: getIsNewRecord(row),
      });
    }
    results.reverse();
    return results;
  }

  function formatDate(dt: Date) {
    return (
      dt.getFullYear() +
      "-" +
      padNumberWithZeros(dt.getMonth() + 1) +
      "-" +
      padNumberWithZeros(dt.getDate()) +
      " " +
      padNumberWithZeros(dt.getHours()) +
      ":" +
      padNumberWithZeros(dt.getMinutes())
    );
  }

  function _renderScoreRowHelper(
    columnValues: ReadonlyArray<string | ReadonlyArray<string>>,
    rowClassnames: ReadonlyArray<string>,
    isHeading: boolean
  ) {
    const tr = ce("tr");
    for (const cn of rowClassnames) {
      tr.classList.add(cn);
    }
    columnValues.forEach((v, index) => {
      const cell = ce(isHeading ? "th" : "td");
      if (typeof v === "string") {
        cell.append(v);
      } else {
        if (v[1]) {
          cell.classList.add("songImg");
          cell.style.backgroundImage = `url("${v[1]}")`;
        }
        cell.append(v[0]);
      }
      cell.classList.add(SCORE_RECORD_CELL_BASE_CLASSNAME);
      cell.classList.add(SCORE_RECORD_CELL_CLASSNAMES[index]);
      tr.append(cell);
    });
    return tr;
  }

  function renderScoreHeadRow() {
    return _renderScoreRowHelper(
      [
        UIString.date,
        UIString.songName,
        UIString.difficulty,
        UIString.achievement,
        UIString.stamps,
      ],
      [SCORE_RECORD_ROW_CLASSNAME],
      true
    );
  }

  function renderScoreRow(record: ScoreRecord) {
    const difficultyWithoutDxPrefix = record.difficulty.split(" ").pop();
    return _renderScoreRowHelper(
      [
        formatDate(record.date),
        [record.songName, record.songImgSrc],
        record.difficulty,
        record.achievement.toFixed(4) + "%",
        record.stamps,
      ],
      [SCORE_RECORD_ROW_CLASSNAME, DIFFICULTY_CLASSNAME_MAP.get(difficultyWithoutDxPrefix)],
      false
    );
  }

  function renderTopScores(
    records: ReadonlyArray<ScoreRecord>,
    container: HTMLElement,
    thead: HTMLTableSectionElement,
    tbody: HTMLTableSectionElement
  ) {
    thead.innerHTML = "";
    tbody.innerHTML = "";
    thead.append(renderScoreHeadRow());
    records.forEach((r) => {
      tbody.append(renderScoreRow(r));
    });
    container.style.paddingBottom = Math.floor(records.length / 2) + 2 + "px";
  }

  function getSelectedDates(): Set<string> {
    const dateOptions = d.querySelectorAll(
      "input." + DATE_CHECKBOX_CLASSNAME
    ) as NodeListOf<HTMLInputElement>;
    const selectedDates = new Set<string>();
    dateOptions.forEach((op) => {
      if (op.checked) {
        selectedDates.add(op.value);
      }
    });
    return selectedDates;
  }

  function getFilterAndOptions(): Options {
    const selectedDates = getSelectedDates();
    let showAllRecords = false;
    const newRecordRadios = d.getElementsByName(
      NEW_RECORD_RADIO_NAME
    ) as NodeListOf<HTMLInputElement>;
    newRecordRadios.forEach((r) => {
      if (r.checked) {
        showAllRecords = r.value === "allRecords";
      }
    });
    let olderFirst = true;
    const sortByRadios = d.getElementsByName(SORT_BY_RADIO_NAME) as NodeListOf<HTMLInputElement>;
    sortByRadios.forEach((r) => {
      if (r.checked) {
        olderFirst = r.value === "olderFirst";
      }
    });
    return {dates: selectedDates, showAll: showAllRecords, olderFirst};
  }

  function filterRecords(allRecords: ReadonlyArray<ScoreRecord>, options: Options) {
    let records = [].concat(allRecords);
    console.log(options);
    if (options.dates) {
      records = records.filter((r) => {
        return options.dates.has(formatDate(r.date).split(" ")[0]);
      });
    }
    if (!options.showAll) {
      const nameRecordMap = new Map();
      records.forEach((r) => {
        if (r.isNewRecord) {
          const mapKey = r.difficulty + " " + r.songName;
          nameRecordMap.delete(mapKey);
          nameRecordMap.set(mapKey, r);
        }
      });
      records = [];
      nameRecordMap.forEach((r) => {
        records.push(r);
      });
    }
    if (!options.olderFirst) {
      records.reverse();
    }
    return records;
  }

  function createDateOptions(playDates: Set<string>, onChange: (evt: Event) => void) {
    const div = ce("div");
    div.className = "m_b_10 dateOptionsContainer";
    const heading = ce("div");
    heading.className = "t_c m_5";
    heading.append(UIString.playDate);
    div.append(heading);
    playDates.forEach((d) => {
      const label = ce("label");
      label.className = "f_14 dateOptionLabel";
      const checkbox = ce("input");
      checkbox.type = "checkbox";
      checkbox.className = DATE_CHECKBOX_CLASSNAME;
      checkbox.value = d;
      checkbox.checked = true;
      checkbox.addEventListener("change", onChange);
      label.append(checkbox, d);
      div.append(label);
    });
    return div;
  }

  function createNewRecordToggle(onChange: (evt: Event) => void) {
    const div = ce("div");
    div.className = "m_b_10 newRecordToggleContainer";
    const heading = ce("div");
    heading.className = "t_c m_5";
    heading.append(UIString.newRecordToggleHeading);
    div.append(heading);
    ["newRecordsOnly", "allRecords"].forEach((op, idx) => {
      const label = ce("label");
      label.className = "f_14 newRecordLabel";
      const input = ce("input");
      input.type = "radio";
      input.name = NEW_RECORD_RADIO_NAME;
      input.className = NEW_RECORD_RADIO_NAME;
      input.value = op;
      input.checked = idx === 0;
      input.addEventListener("change", onChange);
      label.append(input, UIString[op as keyof typeof UIString]);
      div.append(label);
    });
    return div;
  }

  function createSortByRadio(onChange: (evt: Event) => void) {
    const div = ce("div");
    div.className = "m_b_10 sortByRadioContainer";
    const heading = ce("div");
    heading.className = "t_c m_5";
    heading.append(UIString.sortBy);
    div.append(heading);
    ["newerFirst", "olderFirst"].forEach((op, idx) => {
      const label = ce("label");
      label.className = "f_14 sortByLabel";
      const input = ce("input");
      input.type = "radio";
      input.name = SORT_BY_RADIO_NAME;
      input.className = SORT_BY_RADIO_NAME;
      input.value = op;
      input.checked = idx === 0;
      input.addEventListener("change", onChange);
      label.append(input, UIString[op as keyof typeof UIString]);
      div.append(label);
    });
    return div;
  }

  function createCopyButton(onClick: (evt: Event) => void) {
    const div = ce("div");
    div.className = "copyBtnContainer";

    const copyTextBtn = ce("button");
    copyTextBtn.className = "copyBtn";
    copyTextBtn.append(UIString.copy);
    div.append(copyTextBtn);

    let snackbarContainer = d.querySelector(".snackbarContainer") as HTMLDivElement;
    let snackbar = d.querySelector(".snackbar") as HTMLDivElement;
    if (!snackbarContainer) {
      snackbarContainer = ce("div");
      snackbarContainer.className = "snackbarContainer";
      snackbarContainer.style.display = "none";
      d.body.append(snackbarContainer);
    }
    if (!snackbar) {
      snackbar = ce("div");
      snackbar.className = "wrapper snackbar";
      snackbar.innerText = UIString.copied;
      snackbarContainer.append(snackbar);
    }

    copyTextBtn.addEventListener("click", (evt) => {
      onClick(evt);
      d.execCommand("copy");
      snackbarContainer.style.display = "block";
      snackbar.style.opacity = "1";
      setTimeout(() => {
        snackbar.style.opacity = "0";
        setTimeout(() => {
          snackbarContainer.style.display = "none";
        }, 500);
      }, 4000);
    });

    const downloadBtn = ce("button");
    downloadBtn.className = "downloadImgBtn";
    downloadBtn.append(UIString.downloadAsImage);
    downloadBtn.addEventListener("click", () => {
      if (!domtoimage) {
        console.warn("domtoimage not available");
        return;
      }
      const elem = d.querySelector(".playRecordContainer");
      domtoimage.toPng(elem).then((dataUrl: string) => {
        const dtStr = Array.from(getSelectedDates()).join(",");
        const filename = "record_" + dtStr + ".png";
        const a = ce("a");
        a.href = dataUrl;
        a.download = filename;
        //console.log(a);
        a.click();
        //a.innerText = filename;
        //a.target = "_blank";
        //a.style.fontSize = "16px";
        //a.style.color = "blue";
        //a.style.display = "block";
        //d.querySelector(".title.m_10").insertAdjacentElement("beforebegin", a);
      });
    });
    div.append(downloadBtn);
    return div;
  }

  function createOutputElement(allRecords: ReadonlyArray<ScoreRecord>, insertBefore: HTMLElement) {
    const playDates = allRecords.reduce((s, r) => {
      s.add(formatDate(r.date).split(" ")[0]);
      return s;
    }, new Set<string>());

    let dv = d.getElementById("recordSummary");
    if (dv) {
      dv.innerHTML = "";
    } else {
      dv = ce("div");
      dv.id = "recordSummary";
    }

    const playRecordContainer = ce("div");
    playRecordContainer.className = "playRecordContainer";
    const table = ce("table"),
      thead = ce("thead"),
      tbody = ce("tbody");
    table.className = "playRecordTable";
    table.append(thead, tbody);
    playRecordContainer.append(table);

    const handleOptionChange = () => {
      renderTopScores(
        filterRecords(allRecords, getFilterAndOptions()),
        playRecordContainer,
        thead,
        tbody
      );
    };
    dv.append(createDateOptions(playDates, handleOptionChange));
    dv.append(createNewRecordToggle(handleOptionChange));
    dv.append(createSortByRadio(handleOptionChange));

    const btn = createCopyButton(() => {
      const selection = window.getSelection();
      const range = d.createRange();
      range.selectNodeContents(tbody);
      selection.removeAllRanges();
      selection.addRange(range);
    });
    dv.append(btn);

    renderTopScores(
      filterRecords(allRecords, {olderFirst: false}),
      playRecordContainer,
      thead,
      tbody
    );
    dv.append(playRecordContainer);
    insertBefore.insertAdjacentElement("beforebegin", dv);
  }

  const titleImg = d.querySelector(".main_wrapper > img.title") as HTMLImageElement;
  if (titleImg) {
    const cssId = "recentPlayStyles";
    if (!d.getElementById(cssId)) {
      const css = ce("link");
      css.id = cssId;
      css.rel = "stylesheet";
      css.href = SCRIPT_HOST + "/scripts/recent-play-downloader.css";
      css.addEventListener("load", () => {
        removeScrollControl(d);
        collectRecentPlays()
          .then((plays) => {
            createOutputElement(plays, titleImg);
          })
          .catch((e: Error) => {
            const footer = d.getElementsByTagName("footer")[0];
            const textarea = ce("textarea");
            footer.append(textarea);
            textarea.value = e.message + "\n" + e.stack;
          });
      });
      d.head.append(css);
    }
    const d2iId = "d2i";
    if (!d.getElementById(d2iId)) {
      const d2i = ce("script");
      d2i.id = d2iId;
      d2i.type = "text/javascript";
      d2i.src = "https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js";
      d.body.append(d2i);
    }
  }
})(document);
