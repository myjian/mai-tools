import {ChartRecord} from '../common/chart-record';
import {Difficulty} from '../common/difficulties';
import {getPlayerGrade, getPlayerName} from '../common/fetch-score-util';
import {fetchScores, fetchScoresFull, SELF_SCORE_URLS} from '../common/fetch-self-score';
import {getGameRegionFromOrigin, isMaimaiNetOrigin} from '../common/game-region';
import {GameVersion} from '../common/game-version';
import {getInitialLanguage, Language, saveLanguage} from '../common/lang';
import {fetchGameVersion} from '../common/net-helpers';
import {QueryParam} from '../common/query-params';
import {statusText} from '../common/score-fetch-progress';
import {getScriptHost} from '../common/script-host';
import {SongDatabase} from '../common/song-props';
import {ALLOWED_ORIGINS, fetchAllSongs, getPostMessageFunc, handleError} from '../common/util';

declare global {
  interface Window {
    ratingCalcMsgListener?: (evt: MessageEvent) => void;
  }
}

(function () {
  const BASE_URL = getScriptHost('analyze-rating-in-newtab');
  let LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      pleaseLogIn: '請登入 maimai NET',
      analyze: '分析 Rating',
      plateProgress: '名牌板',
    },
    [Language.en_US]: {
      pleaseLogIn: 'Please log in to maimai DX NET.',
      analyze: 'Analyze Rating',
      plateProgress: 'Plates',
    },
    [Language.ko_KR]: {
      pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
      analyze: '레이팅 분석하기',
      plateProgress: 'Plates', // TODO
    },
  };

  const isOnFriendPage = location.pathname.includes('friend');

  /**
   * Load self scores and send them via the callback provided.
   * @return the Document of BASIC song scores page. (this is later used to get all songs)
   */
  async function fetchSelfRecords(
    gameVer: GameVersion,
    send: (action: string, payload: unknown) => void,
    fullRecords: boolean = false
  ): Promise<Document> {
    let allSongsDom: Document;
    // Fetch player grade
    const playerGrade = isOnFriendPage ? null : getPlayerGrade(document.body);
    if (playerGrade) {
      send('playerGrade', playerGrade);
    }
    // Fetch all scores
    const domCache = new Map<Difficulty, Document>();
    let scoreList: ChartRecord[] = [];
    for (const difficulty of SELF_SCORE_URLS.keys()) {
      send('showProgress', statusText(LANG, difficulty, false));
      scoreList = scoreList.concat(
        await (fullRecords ? fetchScoresFull : fetchScores)(
          difficulty,
          domCache,
          new SongDatabase(gameVer, null, false)
        )
      );
    }
    allSongsDom = domCache.get(Difficulty.BASIC);
    send('showProgress', '');
    send('setPlayerScore', scoreList);
    return allSongsDom;
  }

  function insertAnalyzeButton(playerName: string) {
    const region = getGameRegionFromOrigin(window.location.origin);
    const urlSearch = new URLSearchParams({
      [QueryParam.GameRegion]: region,
    });
    if (playerName) {
      urlSearch.set(QueryParam.PlayerName, playerName);
    }
    const profileBlock = document.body.querySelector('.basic_block.p_10.f_0');
    if (!profileBlock) {
      return;
    }
    let analyzeSpan = document.querySelector('.analyzeLinks') as HTMLSpanElement;
    if (analyzeSpan) {
      analyzeSpan.remove();
    }
    analyzeSpan = document.createElement('span');
    analyzeSpan.className = 'analyzeLinks';

    const analyzeRatingLink = document.createElement('a');
    analyzeRatingLink.className = 'f_14';
    analyzeRatingLink.style.color = '#1477e6';
    analyzeRatingLink.target = 'selfRating';
    analyzeRatingLink.append(UIString[LANG].analyze);
    analyzeRatingLink.href = BASE_URL + '/rating-calculator/?' + urlSearch;

    const analyzePlatesLink = document.createElement('a');
    analyzePlatesLink.className = 'f_14';
    analyzePlatesLink.style.color = '#1477e6';
    analyzePlatesLink.target = 'plateProgress';
    analyzePlatesLink.append(UIString[LANG].plateProgress);
    analyzePlatesLink.href = BASE_URL + '/plate-progress/?' + urlSearch;

    analyzeSpan.append(analyzeRatingLink, ' / ', analyzePlatesLink, document.createElement('br'));

    if (location.pathname.indexOf('/maimai-mobile/playerData/') >= 0) {
      analyzeSpan.className += ' f_l';
      const playCountDiv = document.querySelector('.m_5.t_r.f_12');
      playCountDiv.insertAdjacentElement('afterbegin', analyzeSpan);
    } else if (location.pathname.indexOf('/maimai-mobile/home/') >= 0) {
      const playCommentDiv = document.querySelector('.comment_block.f_l.f_12');
      playCommentDiv.insertAdjacentElement('afterbegin', analyzeSpan);
    } else {
      profileBlock.querySelector('.name_block').parentElement.append(analyzeSpan);
    }
  }

  function main() {
    if (!isMaimaiNetOrigin(document.location.origin)) {
      handleError(UIString[LANG].pleaseLogIn);
      return;
    }
    const playerName = isOnFriendPage ? null : getPlayerName(document.body);
    insertAnalyzeButton(playerName);
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
        if (typeof evt.data === 'object') {
          if (evt.data.action === 'ready') {
            send('gameVersion', await gameVerPromise);
            if (typeof evt.data.payload === 'string') {
              LANG = evt.data.payload as Language;
            }
            allSongsDom = fetchSelfRecords(await gameVerPromise, send);
            allSongsDom.then(fetchAllSongs).then((songs) => send('allSongs', songs));
          } else if (evt.data.action === 'fetchScoresFull') {
            if (typeof evt.data.payload === 'string') {
              LANG = evt.data.payload as Language;
            }
            allSongsDom = fetchSelfRecords(await gameVerPromise, send, true);
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
