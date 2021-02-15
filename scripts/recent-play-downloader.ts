import {DIFFICULTY_CLASSNAME_MAP} from '../js/common/constants';
import {LANG} from '../js/common/lang';

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
(function () {
  const UIString = {
    zh: {
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
    en: {
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
    ["fs", "FULL SYNC"],
    ["fsplus", "FULL SYNC+"],
    ["fsd", "FULL SYNC DX"],
    ["fsdplus", "FULL SYNC DX+"],
  ]);
  const IMG_HW = 90; // height and width
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

  const ce = document.createElement.bind(document);
  // 540 = 9 * 60 minutes = UTC+9 (Japan Time), 1 minute = 60000 milliseconds
  const timezoneOffset = (540 - new Date().getTimezoneOffset()) * 60000;

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
    return (row.querySelector(".m_5.p_5.f_13").childNodes[1] as Text).wholeText;
  }

  async function getSongImgSrc(
    row: HTMLElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ): Promise<string> {
    context.drawImage(
      row.querySelector(".music_img") as HTMLImageElement,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return new Promise((resolve) => {
      resolve(canvas.toDataURL());
      //canvas.toBlob((blob) => {
      //  resolve(URL.createObjectURL(blob));
      //}, 'image/jpeg', 1.0);
    });
  }

  function getDifficulty(row: HTMLElement) {
    const recordBody = row.children[1];
    const cn = recordBody.className;
    let diff = cn.substring(cn.indexOf("_") + 1, cn.lastIndexOf("_"));
    diff = diff === "remaster" ? "Re:MASTER" : diff.toUpperCase();
    const isDxChart = (row.querySelector(
      ".playlog_music_kind_icon"
    ) as HTMLImageElement).src.endsWith("music_dx.png");
    return isDxChart ? "DX " + diff : diff;
  }

  function getAchievement(row: HTMLElement) {
    return parseFloat((row.querySelector(".playlog_achievement_txt") as HTMLElement).innerText);
  }

  function getStamps(row: HTMLElement) {
    const rankImgSrc = (row.querySelector("img.playlog_scorerank") as HTMLImageElement).src.replace(/\?ver=.*$/, "");
    const rank = rankImgSrc
      .substring(rankImgSrc.lastIndexOf("/") + 1, rankImgSrc.lastIndexOf("."))
      .replace("plus", "+")
      .toUpperCase();
    const stampImgs = row.querySelectorAll(".playlog_result_innerblock > img") as NodeListOf<
      HTMLImageElement
    >;
    const fcapSrc = stampImgs[0].src.replace(/\?ver=.*$/, "");
    const fcapImgName = fcapSrc.substring(fcapSrc.lastIndexOf("/") + 1, fcapSrc.lastIndexOf("."));
    const fullSyncSrc = stampImgs[1].src.replace(/\?ver=.*$/, "");
    const fullSyncImgName = fullSyncSrc.substring(
      fullSyncSrc.lastIndexOf("/") + 1,
      fullSyncSrc.lastIndexOf(".")
    );
    let result = rank;
    if (AP_FC_IMG_NAME_TO_TEXT.has(fcapImgName)) {
      result += " / " + AP_FC_IMG_NAME_TO_TEXT.get(fcapImgName);
    }
    if (FS_FDX_IMG_NAME_TO_TEXT.has(fullSyncImgName)) {
      result += " / " + FS_FDX_IMG_NAME_TO_TEXT.get(fullSyncImgName);
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
      document.querySelectorAll(".main_wrapper .p_10.t_l.f_0.v_b")
    ) as HTMLElement[];
    const results: ScoreRecord[] = [];
    const canvas = document.createElement("canvas");
    canvas.width = IMG_HW;
    canvas.height = IMG_HW;
    const context = canvas.getContext("2d");
    for (const row of scoreList) {
      results.push({
        date: getPlayDate(row),
        songName: getSongName(row),
        songImgSrc: await getSongImgSrc(row, canvas, context),
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
        cell.classList.add("songImg");
        cell.style.backgroundImage = 'url("' + v[1] + '")';
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

  function getFilterAndOptions(): Options {
    const dateOptions = document.querySelectorAll("input." + DATE_CHECKBOX_CLASSNAME) as NodeListOf<
      HTMLInputElement
    >;
    const selectedDates = new Set<string>();
    dateOptions.forEach((op) => {
      if (op.checked) {
        selectedDates.add(op.value);
      }
    });
    let showAllRecords = false;
    const newRecordRadios = document.getElementsByName(NEW_RECORD_RADIO_NAME) as NodeListOf<
      HTMLInputElement
    >;
    newRecordRadios.forEach((r) => {
      if (r.checked) {
        showAllRecords = r.value === "allRecords";
      }
    });
    let olderFirst = true;
    const sortByRadios = document.getElementsByName(SORT_BY_RADIO_NAME) as NodeListOf<
      HTMLInputElement
    >;
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

    let snackbarContainer = document.querySelector(".snackbarContainer") as HTMLDivElement;
    let snackbar = document.querySelector(".snackbar") as HTMLDivElement;
    if (!snackbarContainer) {
      snackbarContainer = ce("div");
      snackbarContainer.className = "snackbarContainer";
      snackbarContainer.style.display = "none";
      document.body.append(snackbarContainer);
    }
    if (!snackbar) {
      snackbar = ce("div");
      snackbar.className = "wrapper snackbar";
      snackbar.innerText = UIString.copied;
      snackbarContainer.append(snackbar);
    }

    copyTextBtn.addEventListener("click", (evt) => {
      onClick(evt);
      document.execCommand("copy");
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
      const elem = document.querySelector(".playRecordContainer");
      domtoimage.toPng(elem).then((dataUrl: string) => {
        const dtStr = formatDate(new Date()).replace(" ", "_").replace(":", "-");
        const filename = "record_" + dtStr + ".png";
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;
        //console.log(a);
        a.click();
        //a.innerText = filename;
        //a.target = "_blank";
        //a.style.fontSize = "16px";
        //a.style.color = "blue";
        //a.style.display = "block";
        //document.querySelector(".title.m_10").insertAdjacentElement("beforebegin", a);
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

    let dv = document.getElementById("recordSummary");
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
      const range = document.createRange();
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

  const titleImg = document.querySelector(".main_wrapper > img.title") as HTMLImageElement;
  if (titleImg) {
    const cssId = "recentPlayStyles";
    if (!document.getElementById(cssId)) {
      const css = ce("link");
      css.id = cssId;
      css.rel = "stylesheet";
      css.href = "https://myjian.github.io/mai-tools/scripts/recent-play-downloader.css";
      css.addEventListener("load", () => {
        collectRecentPlays().then((plays) => {
          createOutputElement(plays, titleImg);
        }).catch((e: Error) => {
          const footer = document.getElementsByTagName("footer")[0];
          const textarea = document.createElement("textarea");
          footer.append(textarea);
          textarea.value = e.message + "\n" + e.stack;
        });
      });
      document.head.append(css);
    }
    const d2iId = "d2i";
    if (!document.getElementById(d2iId)) {
      const d2i = document.createElement("script");
      d2i.id = d2iId;
      d2i.type = "text/javascript";
      d2i.src = "https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js";
      document.body.append(d2i);
    }
  }
})();
