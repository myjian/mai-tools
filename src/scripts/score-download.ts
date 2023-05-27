import {FullChartRecord} from '../common/chart-record';
import {getChartTypeName} from '../common/chart-type';
import {getDifficultyName} from '../common/difficulties';
import {fetchScoresFull, SELF_SCORE_URLS} from '../common/fetch-self-score';
import {getGameRegionFromOrigin, isMaimaiNetOrigin} from '../common/game-region';
import {getVersionName} from '../common/game-version';
import {getInitialLanguage, Language} from '../common/lang';
import {getOfficialLevel} from '../common/level-helper';
import {fetchGameVersion} from '../common/net-helpers';
import {getRankByAchievement} from '../common/rank-functions';
import {statusText} from '../common/score-fetch-progress';
import {loadSongDatabase} from '../common/song-props';

(function (d) {
  const LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      achievement: '達成率',
      chartConstant: '定數',
      chartType: '譜面',
      copied: '已複製到剪貼簿',
      copy: '複製成績',
      difficulty: '難度',
      dxScore: 'DX 分數',
      exclude: '不包含',
      fetch: '下載所有成績',
      genre: '分類',
      include: '包含',
      level: '等級',
      rank: 'Rank',
      songName: '歌曲',
      version: '版本',
      allDone:
        '✅ 已匯入全部成績到文字框，請按「複製成績」把資料複製到剪貼簿。複製後可於 Excel 或 Google 試算表內貼上。',
    },
    [Language.en_US]: {
      achievement: 'Achv',
      chartConstant: 'Chart Constant',
      chartType: 'Chart',
      copied: 'Copied to clipboard',
      copy: 'Copy',
      difficulty: 'Difficulty',
      dxScore: 'DX Score',
      exclude: 'Exclude',
      fetch: 'Load all scores',
      genre: 'Genre',
      include: 'Include',
      level: 'Level',
      rank: 'Rank',
      songName: 'Song',
      version: 'Version',
      allDone:
        '✅ All scores are loaded into text box. Click "Copy" to copy scores to clipboard. You can paste it in Excel or Google Sheets.',
    },
    // TODO: verify Korean translation
    [Language.ko_KR]: {
      achievement: '정확도',
      chartConstant: '상수',
      chartType: '사양',
      copied: '클립보드에 복사되었습니다',
      copy: '복사',
      difficulty: '난이도',
      dxScore: 'DX 점수',
      exclude: '제외',
      fetch: '모든 기록 불러오기',
      genre: '장르',
      include: '포함',
      level: '레벨',
      rank: '등급',
      songName: '노래',
      version: '버전',
      allDone:
        '✅ 모든 기록이 로드되었습니다. "복사"를 눌러 클립보드로 복사하고 엑셀이나 구글 시트에 붙여 넣으세요.',
    },
  }[LANG];

  const cache: {div: HTMLElement; scores: FullChartRecord[]} = {
    div: null,
    scores: null,
  };

  const enum Field {
    SongName = 'SongName',
    Genre = 'Genre',
    Version = 'Version',
    ChartType = 'ChartType',
    Difficulty = 'Difficulty',
    Level = 'Level',
    InternalLevel = 'InternalLevel',
    Achievement = 'Achievement',
    Rank = 'Rank',
    FcAp = 'FcAp',
    Sync = 'Sync',
    DxScore = 'DxScore',
    DxRatio = 'DxRatio',
    DxStar = 'DxStar',
  }

  const FIELD_NAME: Record<Field, string> = {
    [Field.SongName]: UIString.songName,
    [Field.Genre]: UIString.genre,
    [Field.Version]: UIString.version,
    [Field.ChartType]: UIString.chartType,
    [Field.Difficulty]: UIString.difficulty,
    [Field.Level]: UIString.level,
    [Field.InternalLevel]: UIString.chartConstant,
    [Field.Achievement]: UIString.achievement,
    [Field.Rank]: UIString.rank,
    [Field.FcAp]: 'FC/AP',
    [Field.Sync]: 'Sync',
    [Field.DxScore]: UIString.dxScore,
    [Field.DxRatio]: 'DX %',
    [Field.DxStar]: 'DX ✦',
  };

  const FIELD_GETTER: Record<Field, (r: FullChartRecord) => string> = {
    [Field.SongName]: (r) => r.songName,
    [Field.Genre]: (r) => r.genre,
    [Field.Version]: (r) => (r.version < 0 ? '?' : getVersionName(r.version)),
    [Field.ChartType]: (r) => getChartTypeName(r.chartType),
    [Field.Difficulty]: (r) => getDifficultyName(r.difficulty),
    [Field.Level]: (r) => getOfficialLevel(Math.abs(r.level)),
    [Field.InternalLevel]: (r) => (r.level > 0 ? r.level.toFixed(1) : '?'),
    [Field.Achievement]: (r) => r.achievement.toFixed(4) + '%',
    [Field.Rank]: (r) => getRankByAchievement(r.achievement).title,
    [Field.FcAp]: (r) => r.fcap || '-',
    [Field.Sync]: (r) => r.sync || '-',
    [Field.DxScore]: (r) => `${r.dxscore.player}/${r.dxscore.max}`,
    [Field.DxRatio]: (r) => (r.dxscore.ratio * 100).toFixed(1) + '%',
    [Field.DxStar]: (r) => r.dxscore.star.toFixed(0),
  };

  // TODO: Save and load included fields set by user
  const EXCLUDED_FIELDS = [Field.DxScore, Field.InternalLevel];
  const INCLUDED_FIELDS = Object.keys(FIELD_NAME).filter(
    (f) => !EXCLUDED_FIELDS.includes(f as Field)
  ) as Field[];

  function createOption(field: Field): HTMLLabelElement {
    const label = d.createElement('label');
    label.className = 'f_14 d_ib p_r p_5 m_5';
    label.style.borderRadius = '4px';
    label.style.border = '1px solid #333';
    const input = d.createElement('input');
    input.name = field;
    // We use checkbox type but we don't care about checked state.
    // Whether a field is included is solely determined by which section it belongs to.
    input.type = 'checkbox';
    input.addEventListener('change', () => {
      if (label.parentElement.classList.contains('excluded')) {
        cache.div.querySelector(`.included`).append(label);
      } else if (label.parentElement.classList.contains('included')) {
        cache.div.querySelector(`.excluded`).append(label);
      }
    });
    label.append(input, FIELD_NAME[field]);
    return label;
  }

  function createOutputArea(container: HTMLElement): HTMLTextAreaElement {
    const div = d.createElement('div');
    div.id = 'outputArea';
    div.style.position = 'relative';
    div.style.marginBottom = '16px';
    cache.div = div;

    const fetchBtn = d.createElement('button');
    fetchBtn.className = 'm_r_5';
    fetchBtn.style.color = '#1477e6';
    fetchBtn.append(UIString.fetch);
    fetchBtn.addEventListener('click', handleStartDownload);
    div.append(fetchBtn);

    const included = d.createElement('div');
    included.className = 'included p_10 m_10';
    included.append(UIString.include);
    included.style.textAlign = 'left';
    included.style.backgroundColor = '#ffdd00';
    included.style.borderRadius = '5px';
    for (const field of INCLUDED_FIELDS) {
      included.append(createOption(field));
    }
    div.append(included);

    const excluded = d.createElement('div');
    excluded.className = 'excluded p_10 m_10';
    excluded.append(UIString.exclude);
    excluded.style.textAlign = 'left';
    excluded.style.backgroundColor = 'gray';
    excluded.style.borderRadius = '5px';
    for (const field of EXCLUDED_FIELDS) {
      excluded.append(createOption(field));
    }
    div.append(excluded);

    const tx = d.createElement('textarea');
    tx.className = 'f_12';
    tx.id = 'outputText';
    tx.style.whiteSpace = 'pre';
    div.append(tx);

    const copyBtn = d.createElement('button');
    copyBtn.innerText = UIString.copy;
    for (let btn of [fetchBtn, copyBtn]) {
      btn.style.backgroundColor = '#9f51dc';
      btn.style.border = '2px solid black';
      btn.style.borderRadius = '5px';
      btn.style.color = 'white';
      btn.style.fontWeight = '700';
      btn.style.padding = '8px 12px';
    }
    div.append(copyBtn);

    copyBtn.addEventListener('click', () => {
      tx.select();
      copyBtn.disabled = true;
      copyBtn.style.cursor = 'default';
      copyBtn.style.filter = 'grayscale(1.0)';
      document.execCommand('copy');
      copyBtn.innerText = UIString.copied;
      setTimeout(() => {
        copyBtn.disabled = false;
        copyBtn.style.cursor = '';
        copyBtn.style.filter = '';
        copyBtn.innerText = UIString.copy;
      }, 3000);
    });

    const res = document.createElement('div');
    res.className = 'fetchStatus f_16 m_t_10';
    res.style.fontWeight = '700';
    res.style.color = 'white';
    res.style.textShadow = '1px 1px 2px black';
    div.append(res);

    container.insertAdjacentElement('afterend', div);
    return tx;
  }

  function getSelectedFields(): Field[] {
    const inputs = cache.div.querySelectorAll(`.included input`);
    return Array.from(inputs)
      .map((input) => (input instanceof HTMLInputElement ? input.name : null))
      .filter((field: string | null) => field != null) as Field[];
  }

  function getTableHead(fields: Field[]): string {
    return fields.map((f) => FIELD_NAME[f]).join('\t');
  }

  function formatRecord(r: FullChartRecord, fields: Field[]): string {
    return fields.map((f) => FIELD_GETTER[f](r)).join('\t');
  }

  async function handleStartDownload(evt: Event) {
    evt.preventDefault();
    const gameVer = await fetchGameVersion(d.body);
    const gameRegion = getGameRegionFromOrigin(d.location.origin);
    const songDb = await loadSongDatabase(gameVer, gameRegion);

    const textarea = document.getElementById('outputText') as HTMLTextAreaElement;
    if (cache.scores == null) {
      textarea.value = '';
      cache.scores = [];
      for (const difficulty of SELF_SCORE_URLS.keys()) {
        textarea.value += statusText(LANG, difficulty, false) + '\n';
        cache.scores = cache.scores.concat(await fetchScoresFull(difficulty, new Map(), songDb));
      }
    }
    const fields = getSelectedFields();
    textarea.value =
      getTableHead(fields) +
      '\n' +
      cache.scores.map((record) => formatRecord(record, fields)).join('\n');
    (document.querySelector('.fetchStatus') as HTMLElement).innerText = UIString.allDone;
  }

  if (!isMaimaiNetOrigin(d.location.origin)) {
    return;
  }

  d.getElementById('outputArea')?.remove();
  createOutputArea(d.querySelector('.see_through_block'));
})(document);
