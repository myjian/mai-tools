import {FullChartRecord} from '../common/chart-record';
import {getChartTypeName} from '../common/chart-type';
import {getDifficultyName} from '../common/difficulties';
import {fetchScores, SELF_SCORE_URLS} from '../common/fetch-self-score';
import {isMaimaiNetOrigin} from '../common/game-region';
import {getInitialLanguage, Language} from '../common/lang';
import {getOfficialLevel} from '../common/level-helper';
import {statusText} from '../common/score-fetch-progress';
import {handleError} from '../common/util';

(function () {
  const LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      pleaseLogIn: '請登入 maimai NET',
      fetch: '下載所有成績',
      copy: '複製成績',
      copied: '已複製到剪貼簿',
      allDone:
        '✅ 已匯入全部成績到文字框，請按「複製成績」把資料複製到剪貼簿。複製後可於 Excel 或 Google 試算表內貼上。',
    },
    [Language.en_US]: {
      pleaseLogIn: 'Please log in to maimai DX NET.',
      fetch: 'Load all scores',
      copy: 'Copy',
      copied: 'Copied to clipboard',
      allDone:
        '✅ All scores are loaded into text box. Click "Copy" to copy scores to clipboard. You can paste it in Excel or Google Sheets.',
    },
    [Language.ko_KR]: {
      pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
      fetch: '모든 기록 불러오기',
      copy: '복사',
      copied: '클립보드에 복사되었습니다',
      allDone:
        '✅ 모든 기록이 로드되었습니다. "복사"를 눌러 클립보드로 복사하고 엑셀이나 구글 시트에 붙여 넣으세요.',
    },
  }[LANG];

  function createOutputArea(container: HTMLElement): HTMLTextAreaElement {
    const dv = document.createElement('div');
    dv.id = 'outputArea';
    dv.style.position = 'relative';
    dv.style.marginBottom = '16px';

    const tx = document.createElement('textarea');
    tx.className = 'f_10';
    tx.id = 'outputText';
    dv.append(tx);

    const fetchBtn = document.createElement('button');
    fetchBtn.className = 'm_r_5';
    fetchBtn.style.color = '#1477e6';
    fetchBtn.append(UIString.fetch);
    fetchBtn.addEventListener('click', handleStartDownload);

    const copyBtn = document.createElement('button');
    copyBtn.innerText = UIString.copy;
    for (let btn of [fetchBtn, copyBtn]) {
      btn.style.backgroundColor = '#9f51dc';
      btn.style.border = '2px solid black';
      btn.style.borderRadius = '5px';
      btn.style.color = 'white';
      btn.style.fontWeight = '700';
      btn.style.padding = '8px 12px';
    }
    dv.append(fetchBtn, copyBtn);

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
    dv.append(res);

    container.insertAdjacentElement('afterend', dv);
    return tx;
  }

  async function fetchAllScores(onError: (msg: string) => void) {
    if (!isMaimaiNetOrigin(document.location.origin)) {
      onError(UIString.pleaseLogIn);
      return;
    }
    const textarea = document.getElementById('outputText') as HTMLTextAreaElement;
    let scoreList: FullChartRecord[] = [];
    for (const difficulty of SELF_SCORE_URLS.keys()) {
      textarea.value += statusText(LANG, difficulty, false) + '\n';
      scoreList = scoreList.concat(await fetchScores(difficulty, new Map(), new Map()));
    }
    textarea.value = scoreList
      .map((score) =>
        [
          score.songName,
          score.genre,
          getDifficultyName(score.difficulty),
          getOfficialLevel(score.level),
          getChartTypeName(score.chartType),
          score.achievement,
        ].join('\t')
      )
      .join('\n');
    (document.querySelector('.fetchStatus') as HTMLElement).innerText = UIString.allDone;
  }

  function handleStartDownload(evt: Event) {
    evt.preventDefault();
    fetchAllScores(handleError);
  }

  createOutputArea(document.querySelector('.see_through_block'));
})();
