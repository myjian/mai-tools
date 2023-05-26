import {FullChartRecord} from '../common/chart-record';
import {Difficulty} from '../common/difficulties';
import {getPlayerGrade, getPlayerName} from '../common/fetch-score-util';
import {fetchScores, SELF_SCORE_URLS} from '../common/fetch-self-score';
import {isMaimaiNetOrigin} from '../common/game-region';
import {GameVersion} from '../common/game-version';
import {getInitialLanguage, Language, saveLanguage} from '../common/lang';
import {fetchGameVersion} from '../common/net-helpers';
import {statusText} from '../common/score-fetch-progress';
import {getScriptHost} from '../common/script-host';
import {
  ALLOWED_ORIGINS,
  fetchAllSongs,
  fetchNewSongs,
  getPostMessageFunc,
  handleError,
} from '../common/util';

declare global {
  interface Window {
    ratingCalcMsgListener?: (evt: MessageEvent) => void;
  }
}

(function () {
  const BASE_URL = getScriptHost('analyze-rating-in-newtab') + '/rating-calculator/';
  let LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      pleaseLogIn: '請登入 maimai NET',
      analyze: '分析 Rating',
    },
    [Language.en_US]: {
      pleaseLogIn: 'Please log in to maimai DX NET.',
      analyze: 'Analyze Rating',
    },
    [Language.ko_KR]: {
      pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
      analyze: '레이팅 분석하기',
    },
  };

  const isOnFriendPage = location.pathname.includes('friend');

  async function fetchSelfRecords(
    send: (action: string, payload: unknown) => void
  ): Promise<Document> {
    let allSongsDom: Document;
    // Fetch player grade
    const playerGrade = isOnFriendPage ? null : getPlayerGrade(document.body);
    if (playerGrade) {
      send('playerGrade', playerGrade);
    }
    // Fetch all scores
    const domCache = new Map<Difficulty, Document>();
    let scoreList: FullChartRecord[] = [];
    for (const difficulty of SELF_SCORE_URLS.keys()) {
      send('showProgress', statusText(LANG, difficulty, false));
      scoreList = scoreList.concat(await fetchScores(difficulty, domCache, new Map()));
    }
    allSongsDom = domCache.get(Difficulty.MASTER);
    send('showProgress', '');
    send('setPlayerScore', scoreList);
    send('calculateRating', '');
    return allSongsDom;
  }

  function insertAnalyzeButton(url: string) {
    const profileBlock = document.body.querySelector('.basic_block.p_10.f_0');
    if (!profileBlock) {
      return;
    }
    let analyzeLink = document.querySelector('.analyzeLink') as HTMLAnchorElement;
    if (analyzeLink) {
      analyzeLink.remove();
    }
    analyzeLink = document.createElement('a');
    analyzeLink.className = 'analyzeLink f_14';
    analyzeLink.style.color = '#1477e6';
    analyzeLink.target = 'selfRating';
    analyzeLink.append(UIString[LANG].analyze, document.createElement('br'));
    analyzeLink.href = url;
    if (location.pathname.indexOf('/maimai-mobile/playerData/') >= 0) {
      analyzeLink.className += ' f_l';
      document
        .querySelector('.m_5.m_t_10.t_r.f_12')
        .insertAdjacentElement('afterbegin', analyzeLink);
    } else if (location.pathname.indexOf('/maimai-mobile/home/') >= 0) {
      analyzeLink.className += ' d_b';
      document
        .querySelector('.comment_block.f_l.f_12')
        .insertAdjacentElement('afterbegin', analyzeLink);
    } else {
      profileBlock.querySelector('.name_block').parentElement.append(analyzeLink);
    }
  }

  function main() {
    if (!isMaimaiNetOrigin(document.location.origin)) {
      handleError(UIString[LANG].pleaseLogIn);
      return;
    }
    const playerName = isOnFriendPage ? null : getPlayerName(document.body);
    const url = playerName
      ? BASE_URL + '?' + new URLSearchParams({playerName: playerName})
      : BASE_URL;
    insertAnalyzeButton(url);
    const gameVerPromise = fetchGameVersion(document.body);
    let allSongsDom: Promise<Document>;
    if (window.ratingCalcMsgListener) {
      window.removeEventListener('message', window.ratingCalcMsgListener);
    }
    window.ratingCalcMsgListener = async (
      evt: MessageEvent<string | {action: string; payload?: string | number}>
    ) => {
      console.log(evt.origin, evt.data);
      if (ALLOWED_ORIGINS.includes(evt.origin)) {
        const send = getPostMessageFunc(evt.source as WindowProxy, evt.origin);
        if (typeof evt.data === 'string') {
          // this branch is deprecated!
          if (evt.data === 'ready') {
            // Fetch DX version
            send('gameVersion', await gameVerPromise);
            allSongsDom = fetchSelfRecords(send);
          }
        } else if (typeof evt.data === 'object') {
          if (evt.data.action === 'ready') {
            // Fetch DX version
            send('gameVersion', await gameVerPromise);
            if (typeof evt.data.payload === 'string') {
              LANG = evt.data.payload as Language;
            }
            allSongsDom = fetchSelfRecords(send);
          } else if (evt.data.action === 'fetchNewSongs') {
            const gameVer = await gameVerPromise;
            const ver = evt.data.payload as GameVersion;
            if (gameVer < ver) {
              // Current gameVer is older than the requested version.
              send('newSongs', []);
            } else {
              fetchNewSongs(ver).then((songs) => send('newSongs', songs));
            }
          } else if (evt.data.action === 'fetchAllSongs') {
            allSongsDom.then((dom) => fetchAllSongs(dom).then((songs) => send('allSongs', songs)));
          } else if (evt.data.action === 'saveLanguage') {
            LANG = evt.data.payload as Language;
            saveLanguage(LANG);
          }
        }
      }
    };
    window.addEventListener('message', window.ratingCalcMsgListener);
  }

  main();
})();
