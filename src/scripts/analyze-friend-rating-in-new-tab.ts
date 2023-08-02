import {ChartRecord, FullChartRecord} from '../common/chart-record';
import {
  fetchFriendScores,
  fetchFriendScoresFull,
  FRIEND_SCORE_URLS,
} from '../common/fetch-friend-score';
import {getPlayerGrade, getPlayerName} from '../common/fetch-score-util';
import {GameRegion, getGameRegionFromOrigin, isMaimaiNetOrigin} from '../common/game-region';
import {GameVersion} from '../common/game-version';
import {getInitialLanguage, Language, saveLanguage} from '../common/lang';
import {fetchGameVersion} from '../common/net-helpers';
import {QueryParam} from '../common/query-params';
import {statusText} from '../common/score-fetch-progress';
import {getScriptHost} from '../common/script-host';
import {BasicSongProps, SongDatabase} from '../common/song-props';
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

const enum FriendPage {
  FRIEND_LIST,
  FRIEND_DETAIL,
  FRIEND_VS,
}

type FriendInfo = {
  name: string;
  idx: string;
  grade: string;
  page: FriendPage;
};

(function (d) {
  const BASE_URL = getScriptHost('analyze-friend-rating-in-new-tab');
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
  const friends_cache: {[idx: string]: FriendInfo} = {};

  function getFriendIdx(n: HTMLElement) {
    return (n.querySelector('[name=idx]') as HTMLInputElement).value;
  }

  function insertAnalyzeButton(friend: FriendInfo, container: HTMLElement) {
    const region = getGameRegionFromOrigin(window.location.origin);
    const queryParams = new URLSearchParams({
      [QueryParam.GameRegion]: region === GameRegion.Jp ? 'jp' : 'intl',
      [QueryParam.FriendIdx]: friend.idx,
      [QueryParam.PlayerName]: friend.name,
    });
    let analyzeSpan = (friend.page === FriendPage.FRIEND_VS ? document : container).querySelector(
      '.analyzeSpan'
    ) as HTMLSpanElement;
    if (analyzeSpan) {
      analyzeSpan.remove();
    }
    analyzeSpan = document.createElement('span');
    analyzeSpan.className = 'analyzeSpan';

    const analyzeRatingLink = d.createElement('a');
    analyzeRatingLink.className = 'f_14';
    analyzeRatingLink.style.color = '#1477e6';
    analyzeRatingLink.target = 'friendRating';
    analyzeRatingLink.innerText = UIString[LANG].analyze;
    analyzeRatingLink.href = BASE_URL + '/rating-calculator/?' + queryParams;

    const analyzePlatesLink = document.createElement('a');
    analyzePlatesLink.className = 'f_14';
    analyzePlatesLink.style.color = '#1477e6';
    analyzePlatesLink.target = 'plateProgress';
    analyzePlatesLink.append(UIString[LANG].plateProgress);
    analyzePlatesLink.href = BASE_URL + '/plate-progress/?' + queryParams;

    analyzeSpan.append(analyzeRatingLink, ' / ', analyzePlatesLink);

    if (friend.page === FriendPage.FRIEND_VS) {
      analyzeSpan.className += ' d_ib friend_comment_block f_r';
      analyzeSpan.style.transform = 'translate(-25px, -20px)';
      container.parentElement.insertAdjacentElement('afterend', analyzeSpan);
    } else {
      analyzeSpan.className += ' d_b';
      container
        .querySelector(
          friend.page === FriendPage.FRIEND_LIST ? '.friend_comment_block' : '.comment_block'
        )
        .insertAdjacentElement('afterbegin', analyzeSpan);
    }
  }

  async function fetchFriendRecords(
    friend: FriendInfo,
    full: boolean,
    send: (action: string, payload: unknown) => void
  ) {
    // Send player grade
    if (friend.grade) {
      send('playerGrade', friend.grade);
    }
    // Fetch all scores
    let scoreList: (FullChartRecord | ChartRecord)[] = [];
    for (const difficulty of FRIEND_SCORE_URLS.keys()) {
      send('showProgress', statusText(LANG, difficulty, false));
      if (full) {
        scoreList = scoreList.concat(
          await fetchFriendScoresFull(friend.idx, difficulty, new SongDatabase(false))
        );
      } else {
        scoreList = scoreList.concat(
          await fetchFriendScores(friend.idx, difficulty, new SongDatabase(false))
        );
      }
    }
    send('showProgress', '');
    send('setPlayerScore', scoreList);
  }

  function main() {
    if (!isMaimaiNetOrigin(document.location.origin)) {
      handleError(UIString[LANG].pleaseLogIn);
      return;
    }
    if (
      location.pathname.includes('/friendLevelVs/') ||
      location.pathname.includes('/friendGenreVs/')
    ) {
      const elem = document.querySelector('.friend_vs_friend_block') as HTMLElement;
      const idx = new URLSearchParams(location.search).get('idx');
      const info = {idx, name: getPlayerName(elem), grade: '', page: FriendPage.FRIEND_VS};
      friends_cache[idx] = info;
      insertAnalyzeButton(info, elem);
    } else if (location.pathname.includes('/friend/friendDetail/')) {
      const elem = document.querySelector('.see_through_block') as HTMLElement;
      const idx = new URLSearchParams(location.search).get('idx');
      const info = {
        idx,
        name: getPlayerName(elem),
        grade: getPlayerGrade(elem),
        page: FriendPage.FRIEND_DETAIL,
      };
      friends_cache[idx] = info;
      insertAnalyzeButton(info, elem);
    } else {
      const list = Array.from(
        d.querySelectorAll('img.friend_favorite_icon') as NodeListOf<HTMLImageElement>
      ).map((n) => n.parentElement);
      list.forEach((elem) => {
        const idx = getFriendIdx(elem);
        const info = {
          idx,
          name: getPlayerName(elem),
          grade: getPlayerGrade(elem),
          page: FriendPage.FRIEND_LIST,
        };
        friends_cache[idx] = info;
        insertAnalyzeButton(info, elem);
      });
    }
    let allSongs: BasicSongProps[];
    // Fetch DX version
    const gameVerPromise = fetchGameVersion(document.body);
    if (window.ratingCalcMsgListener) {
      window.removeEventListener('message', window.ratingCalcMsgListener);
    }
    window.ratingCalcMsgListener = async (
      evt: MessageEvent<{action: string; payload?: string | number}>
    ) => {
      console.log(evt.origin, evt.data);
      if (ALLOWED_ORIGINS.includes(evt.origin)) {
        const send = getPostMessageFunc(evt.source as WindowProxy, evt.origin);
        if (typeof evt.data !== 'object') {
          return;
        }

        if (evt.data.action === 'getFriendRecords') {
          send('gameVersion', await gameVerPromise);
          const friend = friends_cache[evt.data.payload];
          if (friend) {
            fetchFriendRecords(friend, false, send);
          }
        } else if (evt.data.action === 'getFriendFullRecords') {
          const friend = friends_cache[evt.data.payload];
          if (friend) {
            fetchFriendRecords(friend, true, send);
          }
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
          if (allSongs) {
            send('allSongs', allSongs);
          }
          fetchAllSongs().then((songs) => {
            allSongs = songs;
            send('allSongs', songs);
          });
        } else if (evt.data.action === 'saveLanguage') {
          LANG = evt.data.payload as Language;
          saveLanguage(LANG);
        }
      }
    };
    window.addEventListener('message', window.ratingCalcMsgListener);
  }

  main();
})(document);
