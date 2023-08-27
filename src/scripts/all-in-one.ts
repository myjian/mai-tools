import {isMaimaiNetOrigin} from '../common/game-region';
import {getInitialLanguage, Language} from '../common/lang';
import {removeScrollControl} from '../common/net-helpers';
import {handleError} from '../common/util';

(function (d) {
  const LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      pleaseLogIn: '請登入 maimai DX NET',
    },
    [Language.en_US]: {
      pleaseLogIn: 'Please log in to maimai DX NET.',
    },
    [Language.ko_KR]: {
      pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
    },
  }[LANG];

  if (!isMaimaiNetOrigin(d.location.origin)) {
    handleError(UIString.pleaseLogIn);
    return;
  }

  // Enable right click
  d.body.oncontextmenu = null;

  const path = d.location.pathname;
  if (path === '/maimai-mobile/record/') {
    import('./recent-play-downloader');
  } else if (path.indexOf('/maimai-mobile/record/playlogDetail/') >= 0) {
    import('./score-converter');
    import('./play-record-helper');
  } else if (path.indexOf('/maimai-mobile/record/musicDetail/') >= 0) {
    removeScrollControl(d);
    import('./song-detail-helper');
  } else if (path.indexOf('/maimai-mobile/record/music') >= 0) {
    import('./score-sort');
  } else if (path.indexOf('/maimai-mobile/friend/') >= 0) {
    import('./analyze-friend-rating-in-new-tab');
    if (path.indexOf('/maimai-mobile/friend/friendDetail/') >= 0) {
      import('./score-download');
    }
    if (
      path.indexOf('/maimai-mobile/friend/friendGenreVs/battleStart/') >= 0 ||
      path.indexOf('/maimai-mobile/friend/friendLevelVs/battleStart/') >= 0
    ) {
      import('./score-sort');
    }
  } else if (
    path.indexOf('/maimai-mobile/home/') >= 0 ||
    path.indexOf('/maimai-mobile/playerData/') >= 0
  ) {
    removeScrollControl(d);
    import('./score-download');
    import('./analyze-rating-in-newtab');
  } else if (path.indexOf('/maimai-mobile/photo/') >= 0) {
    import('./album-download-helper');
  }
})(document);
