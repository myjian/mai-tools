import './recent-play-downloader.css';

import domtoimage from 'dom-to-image';

import {ChartType} from '../common/chart-type';
import {fixTimezone, formatDate} from '../common/date-util';
import {Difficulty, getDifficultyByName, getDifficultyClassName} from '../common/difficulties';
import {calculateDetailedDxStar, getDxStarText} from '../common/dx-star';
import {getGameRegionFromOrigin} from '../common/game-region';
import {getInitialLanguage, Language} from '../common/lang';
import {getDisplayLv} from '../common/level-helper';
import {addLvToSongTitle, fetchGameVersion, removeScrollControl} from '../common/net-helpers';
import {getSongNicknameWithChartType, isNiconicoLinkImg} from '../common/song-name-helper';
import {loadSongDatabase, SongDatabase} from '../common/song-props';

type ScoreRecord = {
  date: Date;
  songName: string;
  songImgSrc: string;
  chartType: ChartType;
  difficulty: Difficulty;
  achievement: number;
  rank: string;
  stamps: string;
  isNewRecord: boolean;
};
type Options = {
  dates?: Set<string>;
  showAll?: boolean;
  olderFirst?: boolean;
};

(function (d) {
  const LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      date: '日期',
      songName: '歌曲',
      difficulty: '難度',
      achievement: '達成率',
      stamps: '成就',
      playDate: '遊玩日期：',
      newRecordToggleHeading: '顯示：',
      sortBy: '排序方式：',
      newRecordsOnly: '只顯示新高分紀錄',
      allRecords: '全部',
      olderFirst: '由舊到新',
      newerFirst: '由新到舊',
      copy: '複製',
      copied: '已複製到剪貼簿',
      downloadAsImage: '存成圖片',
    },
    [Language.en_US]: {
      date: 'Date',
      songName: 'Song',
      difficulty: 'Difficulty',
      achievement: 'Achv',
      stamps: 'Grade',
      playDate: 'Play date:',
      newRecordToggleHeading: 'Display:',
      sortBy: 'Sort by:',
      newRecordsOnly: 'New records only',
      allRecords: 'All',
      olderFirst: 'Older first',
      newerFirst: 'Newer first',
      copy: 'Copy',
      copied: 'Copied to clipboard',
      downloadAsImage: 'Save as image',
    },
    [Language.ko_KR]: {
      date: '날짜',
      songName: '노래',
      difficulty: '난이도',
      achievement: '정확도',
      stamps: '등급',
      playDate: '플레이 일:',
      newRecordToggleHeading: '표시:',
      sortBy: '정렬 순서:',
      newRecordsOnly: '새 기록만',
      allRecords: '전부',
      olderFirst: '옛날 기록부터',
      newerFirst: '최근 기록부터',
      copy: '복사',
      copied: '클립보드에 복사되었습니다',
      downloadAsImage: '이미지로 저장하기',
    },
  }[LANG];

  const AP_FC_IMG_NAME_TO_TEXT = new Map([
    ['fc', 'FC'],
    ['fcplus', 'FC+'],
    ['ap', 'AP'],
    ['applus', 'AP+'],
  ]);

  const SYNC_IMG_NAME_TO_TEXT = new Map([
    ['fs', 'FS'],
    ['fsplus', 'FS+'],
    ['fsd', 'FSD'],
    ['fsdplus', 'FSD+'],
  ]);
  const DATE_CHECKBOX_CLASSNAME = 'dateCheckbox';
  const NEW_RECORD_RADIO_NAME = 'newRecordRadio';
  const SORT_BY_RADIO_NAME = 'sortByRadio';
  const SCORE_RECORD_ROW_CLASSNAME = 'recordRow';
  const SCORE_RECORD_CELL_BASE_CLASSNAME = 'recordCell';
  const SCORE_RECORD_CELL_CLASSNAMES = [
    'dateCell',
    'songTitleCell',
    'achievementCell',
    'stampsCell',
  ];

  const ce = d.createElement.bind(d);

  function getPlayDate(row: HTMLElement) {
    const playDateText = (row.querySelector('.sub_title').children[1] as HTMLElement).innerText;
    const m = playDateText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const japanDt = new Date(
      parseInt(m[1]),
      parseInt(m[2]) - 1,
      parseInt(m[3]),
      parseInt(m[4]),
      parseInt(m[5])
    );
    return fixTimezone(japanDt);
  }

  function getSongName(row: HTMLElement) {
    try {
      return Array.from((row.querySelector('.m_5.p_5.f_13') as HTMLElement).childNodes).find(
        (node) => node instanceof Text
      ).textContent;
    } catch (e) {
      console.log(e);
      console.log(row);
      return '';
    }
  }

  function getSongImgSrc(row: HTMLElement): string {
    const img = row.querySelector('.music_img') as HTMLImageElement;
    return img ? img.src : '';
  }

  function getChartType(row: HTMLElement) {
    const isDxChart = (
      row.querySelector('.playlog_music_kind_icon') as HTMLImageElement
    ).src.endsWith('music_dx.png');
    return isDxChart ? ChartType.DX : ChartType.STANDARD;
  }

  function getDifficulty(row: HTMLElement) {
    const recordBody = row.children[1];
    const cn = recordBody.className;
    let diff = cn.substring(cn.indexOf('_') + 1, cn.lastIndexOf('_'));
    return getDifficultyByName(diff);
  }

  function getAchievement(row: HTMLElement) {
    return parseFloat((row.querySelector('.playlog_achievement_txt') as HTMLElement).innerText);
  }

  function getDxStar(row: HTMLElement): string {
    const dxStarIndex = calculateDetailedDxStar(row);
    return getDxStarText(dxStarIndex);
  }

  function getRank(row: HTMLElement): string {
    const rankImgSrc = (row.querySelector('img.playlog_scorerank') as HTMLImageElement).src.replace(
      /\?ver=.*$/,
      ''
    );
    return rankImgSrc
      .substring(rankImgSrc.lastIndexOf('/') + 1, rankImgSrc.lastIndexOf('.'))
      .replace('plus', '+')
      .toUpperCase();
  }

  function getStamps(row: HTMLElement): string {
    const results = [];

    // FC/AP
    const stampImgs = row.querySelectorAll(
      '.playlog_result_innerblock > img'
    ) as NodeListOf<HTMLImageElement>;
    const fcapSrc = stampImgs[0].src.replace(/\?ver=.*$/, '');
    const fcapImgName = fcapSrc.substring(fcapSrc.lastIndexOf('/') + 1, fcapSrc.lastIndexOf('.'));
    if (AP_FC_IMG_NAME_TO_TEXT.has(fcapImgName)) {
      results.push(AP_FC_IMG_NAME_TO_TEXT.get(fcapImgName));
    }

    // SYNC
    const fullSyncSrc = stampImgs[1].src.replace(/\?ver=.*$/, '');
    const fullSyncImgName = fullSyncSrc.substring(
      fullSyncSrc.lastIndexOf('/') + 1,
      fullSyncSrc.lastIndexOf('.')
    );
    if (SYNC_IMG_NAME_TO_TEXT.has(fullSyncImgName)) {
      results.push(SYNC_IMG_NAME_TO_TEXT.get(fullSyncImgName));
    }

    // DX Star
    const dxStar = getDxStar(row);
    if (dxStar) {
      results.push(dxStar);
    }
    return results.join(' / ');
  }

  function getIsNewRecord(row: HTMLElement) {
    return !!row.querySelector(
      '.playlog_achievement_label_block + img.playlog_achievement_newrecord'
    );
  }

  function _renderScoreRowHelper(
    columnValues: ReadonlyArray<string | DocumentFragment | ReadonlyArray<string>>,
    rowClassnames: ReadonlyArray<string>,
    isHeading: boolean
  ) {
    const tr = ce('tr');
    for (const cn of rowClassnames) {
      tr.classList.add(cn);
    }
    columnValues.forEach((v, index) => {
      const cell = ce(isHeading ? 'th' : 'td');
      if (typeof v === 'string' || v instanceof DocumentFragment) {
        cell.append(v);
      } else {
        if (v[1]) {
          cell.classList.add('songImg');
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
      [UIString.date, UIString.songName, UIString.achievement, UIString.stamps],
      [SCORE_RECORD_ROW_CLASSNAME],
      true
    );
  }

  function renderScoreRow(record: ScoreRecord, songDb: SongDatabase) {
    const genre = isNiconicoLinkImg(record.songImgSrc) ? 'niconico' : '';
    const nickname = songDb.hasDualCharts(record.songName, genre)
      ? getSongNicknameWithChartType(record.songName, genre, record.chartType)
      : record.songName;
    const achvFragment = document.createDocumentFragment();
    const rankSpan = document.createElement('span');
    rankSpan.className = 'd_b';
    rankSpan.append(record.rank);
    achvFragment.append(rankSpan, '\t', record.achievement.toFixed(4) + '%');
    return _renderScoreRowHelper(
      [formatDate(record.date), [nickname, record.songImgSrc], achvFragment, record.stamps],
      [SCORE_RECORD_ROW_CLASSNAME, getDifficultyClassName(record.difficulty)],
      false
    );
  }

  function renderTopScores(
    records: ReadonlyArray<ScoreRecord>,
    songDb: SongDatabase,
    container: HTMLElement,
    thead: HTMLTableSectionElement,
    tbody: HTMLTableSectionElement
  ) {
    thead.innerHTML = '';
    tbody.innerHTML = '';
    thead.append(renderScoreHeadRow());
    records.forEach((r) => {
      tbody.append(renderScoreRow(r, songDb));
    });
    container.style.paddingBottom = Math.floor(records.length / 2) + 2 + 'px';
  }

  function getSelectedDates(): Set<string> {
    const dateOptions = d.querySelectorAll(
      'input.' + DATE_CHECKBOX_CLASSNAME
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
        showAllRecords = r.value === 'allRecords';
      }
    });
    let olderFirst = true;
    const sortByRadios = d.getElementsByName(SORT_BY_RADIO_NAME) as NodeListOf<HTMLInputElement>;
    sortByRadios.forEach((r) => {
      if (r.checked) {
        olderFirst = r.value === 'olderFirst';
      }
    });
    return {dates: selectedDates, showAll: showAllRecords, olderFirst};
  }

  function filterRecords(allRecords: ReadonlyArray<ScoreRecord>, options: Options): ScoreRecord[] {
    let records = allRecords.slice();
    console.log(options);
    if (options.dates) {
      records = records.filter((r) => {
        return options.dates.has(formatDate(r.date).split(' ')[0]);
      });
    }
    if (!options.showAll) {
      records.reverse(); // oldest -> newest. This is necessary for newer new records to overwrite older ones.
      const nameRecordMap = new Map();
      records.forEach((r) => {
        if (r.isNewRecord) {
          const mapKey = r.difficulty + ' ' + r.songName;
          nameRecordMap.delete(mapKey);
          nameRecordMap.set(mapKey, r);
        }
      });
      records = [];
      nameRecordMap.forEach((r) => {
        records.push(r);
      });
      if (!options.olderFirst) {
        records.reverse(); // newest -> oldest
      }
    } else if (options.olderFirst) {
      records.reverse(); // oldest -> newest
    }
    return records;
  }

  function createDateOptions(playDates: Set<string>, onChange: (evt: Event) => void) {
    const div = ce('div');
    div.className = 'm_b_10 dateOptionsContainer';
    const heading = ce('div');
    heading.className = 't_c m_5';
    heading.append(UIString.playDate);
    div.append(heading);
    playDates.forEach((d) => {
      const label = ce('label');
      label.className = 'f_14 dateOptionLabel';
      const checkbox = ce('input');
      checkbox.type = 'checkbox';
      checkbox.className = DATE_CHECKBOX_CLASSNAME;
      checkbox.value = d;
      checkbox.checked = true;
      checkbox.addEventListener('change', onChange);
      label.append(checkbox, d);
      div.append(label);
    });
    return div;
  }

  function createNewRecordToggle(onChange: (evt: Event) => void) {
    const div = ce('div');
    div.className = 'm_b_10 newRecordToggleContainer';
    const heading = ce('div');
    heading.className = 't_c m_5';
    heading.append(UIString.newRecordToggleHeading);
    div.append(heading);
    ['newRecordsOnly', 'allRecords'].forEach((op, idx) => {
      const label = ce('label');
      label.className = 'f_14 newRecordLabel';
      const input = ce('input');
      input.type = 'radio';
      input.name = NEW_RECORD_RADIO_NAME;
      input.className = NEW_RECORD_RADIO_NAME;
      input.value = op;
      input.checked = idx === 0;
      input.addEventListener('change', onChange);
      label.append(input, UIString[op as keyof typeof UIString]);
      div.append(label);
    });
    return div;
  }

  function createSortByRadio(onChange: (evt: Event) => void) {
    const div = ce('div');
    div.className = 'm_b_10 sortByRadioContainer';
    const heading = ce('div');
    heading.className = 't_c m_5';
    heading.append(UIString.sortBy);
    div.append(heading);
    ['newerFirst', 'olderFirst'].forEach((op, idx) => {
      const label = ce('label');
      label.className = 'f_14 sortByLabel';
      const input = ce('input');
      input.type = 'radio';
      input.name = SORT_BY_RADIO_NAME;
      input.className = SORT_BY_RADIO_NAME;
      input.value = op;
      input.checked = idx === 0;
      input.addEventListener('change', onChange);
      label.append(input, UIString[op as keyof typeof UIString]);
      div.append(label);
    });
    return div;
  }

  function createCopyButton(onClick: (evt: Event) => void) {
    const div = ce('div');
    div.className = 'copyBtnContainer';

    const copyTextBtn = ce('button');
    copyTextBtn.className = 'copyBtn';
    copyTextBtn.append(UIString.copy);
    div.append(copyTextBtn);

    let snackbarContainer = d.querySelector('.snackbarContainer') as HTMLDivElement;
    let snackbar = d.querySelector('.snackbar') as HTMLDivElement;
    if (!snackbarContainer) {
      snackbarContainer = ce('div');
      snackbarContainer.className = 'snackbarContainer';
      snackbarContainer.style.display = 'none';
      d.body.append(snackbarContainer);
    }
    if (!snackbar) {
      snackbar = ce('div');
      snackbar.className = 'wrapper snackbar';
      snackbar.innerText = UIString.copied;
      snackbarContainer.append(snackbar);
    }

    copyTextBtn.addEventListener('click', (evt) => {
      onClick(evt);
      d.execCommand('copy');
      snackbarContainer.style.display = 'block';
      snackbar.style.opacity = '1';
      setTimeout(() => {
        snackbar.style.opacity = '0';
        setTimeout(() => {
          snackbarContainer.style.display = 'none';
        }, 500);
      }, 4000);
    });

    const downloadBtn = ce('button');
    downloadBtn.className = 'downloadImgBtn';
    downloadBtn.append(UIString.downloadAsImage);
    downloadBtn.addEventListener('click', () => {
      const elem = d.querySelector('.playRecordContainer');
      domtoimage.toPng(elem).then((dataUrl: string) => {
        const dtStr = Array.from(getSelectedDates()).join(',');
        const filename = 'record_' + dtStr + '.png';
        const a = ce('a');
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

  function createOutputElement(
    allRecords: ReadonlyArray<ScoreRecord>,
    songDb: SongDatabase,
    insertBefore: HTMLElement
  ) {
    const playDates = allRecords.reduce((s, r) => {
      s.add(formatDate(r.date).split(' ')[0]);
      return s;
    }, new Set<string>());

    let dv = d.getElementById('recordSummary');
    if (dv) {
      dv.innerHTML = '';
    } else {
      dv = ce('div');
      dv.id = 'recordSummary';
    }

    const playRecordContainer = ce('div');
    playRecordContainer.className = 'playRecordContainer';
    const table = ce('table'),
      thead = ce('thead'),
      tbody = ce('tbody');
    table.className = 'playRecordTable';
    table.append(thead, tbody);
    playRecordContainer.append(table);

    const handleOptionChange = () => {
      renderTopScores(
        filterRecords(allRecords, getFilterAndOptions()),
        songDb,
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
      songDb,
      playRecordContainer,
      thead,
      tbody
    );
    dv.append(playRecordContainer);
    insertBefore.insertAdjacentElement('beforebegin', dv);
  }

  async function addLvToRow(row: HTMLElement, record: ScoreRecord, songDb: SongDatabase) {
    const genre =
      record.songName === 'Link' && isNiconicoLinkImg(record.songImgSrc) ? 'niconico' : '';
    const props = songDb.getSongProperties(record.songName, genre, record.chartType);
    const lv = props ? getDisplayLv(props.lv[record.difficulty]) : '';
    if (lv) {
      addLvToSongTitle(row, record.difficulty, lv);
    }
  }

  const titleImg = d.querySelector('.main_wrapper > img.title') as HTMLImageElement;
  if (titleImg) {
    (async () => {
      removeScrollControl(d);
      const rows = Array.from(
        d.querySelectorAll('.main_wrapper .p_10.t_l.f_0.v_b')
      ) as HTMLElement[];
      try {
        const records = rows.map((row) => ({
          date: getPlayDate(row),
          songName: getSongName(row),
          songImgSrc: getSongImgSrc(row),
          chartType: getChartType(row),
          difficulty: getDifficulty(row),
          achievement: getAchievement(row),
          rank: getRank(row),
          stamps: getStamps(row),
          isNewRecord: getIsNewRecord(row),
        }));
        const gameVer = await fetchGameVersion(d.body);
        const gameRegion = getGameRegionFromOrigin(d.location.origin);
        const songDb = await loadSongDatabase(gameVer, gameRegion);
        createOutputElement(records, songDb, titleImg);
        rows.forEach((row, idx) => {
          const record = records[idx];
          if (record.difficulty !== Difficulty.UTAGE) {
            addLvToRow(row, record, songDb);
          }
        });
      } catch (e) {
        const footer = d.getElementsByTagName('footer')[0];
        const textarea = ce('textarea');
        footer.append(textarea);
        textarea.value = e instanceof Error ? e.message + '\n' + e.stack : String(e);
      }
    })().then((_) => {});
  }
})(document);
