/**
 * Use it on a play record page to
 * 1) analyze DX score ratio
 * 2) convert to FiNALE achievement scale
 * 3) analyze break note judgements
 */
import {getDifficultyForRecord} from '../common/difficulties';
import {calculateDetailedDxStar} from '../common/dx-star';
import {getSongName} from '../common/fetch-score-util';
import {isMaimaiNetOrigin} from '../common/game-region';
import {getInitialLanguage, Language} from '../common/lang';
import {removeScrollControl} from '../common/net-helpers';
import {QueryParam} from '../common/query-params';
import {getScriptHost} from '../common/script-host';
import {ALLOWED_ORIGINS} from '../common/util';

(function (d) {
  const UIString = {
    [Language.en_US]: {
      analyzeScore: '🔍 CLICK ME TO ANALYZE SCORE',
    },
    [Language.zh_TW]: {
      analyzeScore: '🔍 點我分析分數',
    },
    [Language.ko_KR]: {
      analyzeScore: '🔍 정확도 분석하기',
    },
  }[getInitialLanguage()];
  const BASE_NEWTAB_URL = getScriptHost('score-converter') + '/classic-layout/';
  const FINALE_RANK_IMG = new Map([
    ['S', '/maimai-mobile/maimai-img/icon_s.png'],
    ['S+', '/maimai-mobile/maimai-img/icon_s_plus.png'],
    ['SS', '/maimai-mobile/maimai-img/icon_ss.png'],
    ['SS+', '/maimai-mobile/maimai-img/icon_ss_plus.png'],
    ['SSS', '/maimai-mobile/maimai-img/icon_sss.png'],
    ['SSS+', '/maimai-mobile/maimai-img/icon_sss_plus.png'],
  ]);
  const DX_RANK_IMG = new Map([
    ['AAA', '/maimai-mobile/img/music_icon_aaa.png'],
    ['AA', '/maimai-mobile/img/music_icon_aa.png'],
    ['A', '/maimai-mobile/img/music_icon_a.png'],
  ]);
  const FINALE_APFC_IMG = new Map([
    ['fc', '/maimai-mobile/maimai-img/icon_fc_silver.png'],
    ['fcplus', '/maimai-mobile/maimai-img/icon_fc_gold.png'],
    ['ap', '/maimai-mobile/maimai-img/icon_ap.png'],
  ]);
  const DX_APFC_IMG = new Map([['applus', '/maimai-mobile/img/music_icon_app.png']]);
  const FINALE_SYNC_IMG = new Map([
    ['FS', '/maimai-mobile/maimai-img/icon_maxfever_silver.png'],
    ['FS+', '/maimai-mobile/maimai-img/icon_maxfever_gold.png'],
  ]);
  const DX_SYNC_IMG = new Map([
    ['FDX', '/maimai-mobile/img/music_icon_fsd.png'],
    ['FDX+', '/maimai-mobile/img/music_icon_fsdp.png'],
  ]);

  function trimSpaces(textLine: string) {
    return textLine.trim().replace(/\s+/g, '-');
  }

  function padNumberWithZeros(n: number, len?: number) {
    len = len || 2;
    return n.toString().padStart(len, '0');
  }

  function formatDate(dt: Date) {
    return (
      dt.getFullYear() +
      '-' +
      padNumberWithZeros(dt.getMonth() + 1) +
      '-' +
      padNumberWithZeros(dt.getDate()) +
      ' ' +
      padNumberWithZeros(dt.getHours()) +
      ':' +
      padNumberWithZeros(dt.getMinutes())
    );
  }

  function fetchAndCacheImg(map: Map<string, Blob | string>, title: string) {
    let img = map.get(title);
    if (img instanceof Blob) {
      return Promise.resolve(img);
    } else if (img) {
      return fetch(img)
        .then((res) => res.blob())
        .then((b) => {
          map.set(title, b);
          return b;
        });
    }
  }

  function getAchv(e: HTMLElement) {
    const achv = (e.querySelector('.playlog_achievement_txt') as HTMLElement).innerText;
    return achv.substring(0, achv.length - 1); // remove "%"
  }

  function getNoteDetails(e: HTMLElement) {
    return (e.querySelector('.playlog_notes_detail') as HTMLElement).innerText
      .split('\n')
      .slice(-5)
      .map(trimSpaces)
      .join('_');
  }

  function getTrack(e: HTMLElement) {
    return (
      e.querySelector('.playlog_top_container .sub_title .f_b') as HTMLElement
    ).innerText.replace('0', '');
  }

  function getPlayDate(e: HTMLElement) {
    const jpDtText = (
      e.querySelector('.playlog_top_container .sub_title span:last-child') as HTMLElement
    ).innerText;
    const m = jpDtText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const jpDt = new Date(
      parseInt(m[1]),
      parseInt(m[2]) - 1,
      parseInt(m[3]),
      parseInt(m[4]),
      parseInt(m[5])
    );
    return formatDate(new Date(jpDt.valueOf() - 1000 * 60 * 60));
  }

  function getIsHighScore(e: HTMLElement) {
    return e.querySelector('.playlog_achievement_newrecord') ? 1 : 0;
  }

  function getCombo(e: HTMLElement) {
    return (e.querySelector('.col2 .playlog_score_block .white') as HTMLElement).innerText;
    //return e.querySelector(".col2 .playlog_score_block .white").innerText.replace("/", " / ");
  }

  function getSongImage(e: HTMLElement) {
    const img = e.querySelector('img.music_img') as HTMLImageElement;
    const canvas = d.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  function getRankTitle(e: HTMLElement) {
    const src = (e.querySelector('.playlog_scorerank') as HTMLImageElement).src.replace(
      /\?ver=.*$/,
      ''
    );
    const title = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
    return title.toUpperCase().replace('PLUS', '+');
  }

  function getRankImage(title: string) {
    return (
      fetchAndCacheImg(FINALE_RANK_IMG, title) ||
      fetchAndCacheImg(DX_RANK_IMG, title) ||
      Promise.reject('invalid title "' + title + '"')
    );
  }

  function getApFcImage(e: HTMLElement) {
    const src = (
      e.querySelector('.playlog_result_innerblock > img:nth-child(2)') as HTMLImageElement
    ).src.replace(/\?ver=.*$/, '');
    const title = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
    if (title === 'fc_dummy') {
      return Promise.resolve(null);
    }
    return (
      fetchAndCacheImg(FINALE_APFC_IMG, title) ||
      fetchAndCacheImg(DX_APFC_IMG, title) ||
      Promise.reject('invalid title "' + title + '"')
    );
  }

  function getSyncResult(e: HTMLElement) {
    const src = (
      e.querySelector('.playlog_result_innerblock > img:nth-child(3)') as HTMLImageElement
    ).src;
    const title = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
    switch (title) {
      case 'fs':
        return 'FS';
      case 'fsplus':
        return 'FS+';
      case 'fsd':
        return 'FDX';
      case 'fsdplus':
        return 'FDX+';
    }
    return null;
  }

  function getSyncImage(syncResult: string) {
    if (syncResult) {
      return (
        fetchAndCacheImg(FINALE_SYNC_IMG, syncResult) ||
        fetchAndCacheImg(DX_SYNC_IMG, syncResult) ||
        Promise.reject('invalid title "' + syncResult + '"')
      );
    }
    return Promise.resolve(null);
  }

  function createPlaceBlock() {
    const placeNameBlock = d.createElement('div');
    placeNameBlock.className = 'basic_block m_10 p_l_10 t_l f_14 break';
    const placeNameSpan = d.createElement('span');
    placeNameSpan.className = 'm_t_5 p_5 d_ib';
    const clearfix = d.createElement('div');
    clearfix.className = 'clearfix';

    placeNameBlock.append(placeNameSpan, clearfix);
    d.querySelector('.gray_block').insertAdjacentElement('afterend', placeNameBlock);
    return placeNameBlock;
  }

  function addLinkToPlace(link: string) {
    let placeNameBlock = d.getElementById('placeName');
    if (!placeNameBlock) {
      placeNameBlock = createPlaceBlock();
    }
    const placeNameCtrl = d.getElementById('placeNameCtrl');
    if (placeNameCtrl) {
      placeNameCtrl.remove();
    }
    const placeNameSpan = placeNameBlock.querySelector('span');
    if (placeNameSpan.parentElement instanceof HTMLAnchorElement) {
      // Do nothing if this function is run more than once.
      return;
    }
    placeNameSpan.innerText = UIString.analyzeScore;
    const linkElem = d.createElement('a');
    linkElem.href = link;
    linkElem.target = 'classic_layout';
    linkElem.className = 'blue d_ib';
    linkElem.style.height = '40px';
    placeNameBlock.append(linkElem);
    linkElem.append(placeNameSpan);
  }

  function addScoreConverterLink() {
    removeScrollControl(d);
    const queryParams = new URLSearchParams({
      [QueryParam.Date]: getPlayDate(d.body),
      [QueryParam.Track]: getTrack(d.body),
      [QueryParam.SongTitle]: getSongName(d.body),
      [QueryParam.Difficulty]: getDifficultyForRecord(d.body).toString(),
      [QueryParam.Achievement]: getAchv(d.body),
      [QueryParam.HighScore]: getIsHighScore(d.body).toString(),
      [QueryParam.NoteDetails]: getNoteDetails(d.body),
      [QueryParam.Combo]: getCombo(d.body),
    });
    let url = BASE_NEWTAB_URL + '?' + queryParams.toString();
    const syncStatus = getSyncResult(d.body);
    if (syncStatus) {
      url += '&sc=' + encodeURIComponent(syncStatus);
    }
    addLinkToPlace(url);
    window.addEventListener('message', (evt) => {
      if (ALLOWED_ORIGINS.includes(evt.origin)) {
        const data = evt.data;
        const source = evt.source as WindowProxy;
        let rankTitle: string = '';
        switch (data.action) {
          case 'ready':
            source.postMessage({action: 'songImage', imgSrc: getSongImage(d.body)}, evt.origin);
            getApFcImage(d.body).then((img) => {
              if (img) {
                source.postMessage({action: 'apFcImage', img}, evt.origin);
              }
            });
            getSyncImage(getSyncResult(d.body)).then((img: Blob | null) => {
              if (img) {
                source.postMessage({action: 'syncImage', img}, evt.origin);
              }
            });
            rankTitle = getRankTitle(d.body);
            getRankImage(rankTitle).then((img) => {
              source.postMessage({action: 'rankImage', title: rankTitle, img}, evt.origin);
            });
            break;
          case 'getRankImage':
            rankTitle = data.payload;
            getRankImage(rankTitle).then((img) => {
              source.postMessage({action: 'rankImage', title: rankTitle, img}, evt.origin);
            });
            break;
        }
      }
    });
  }

  if (
    isMaimaiNetOrigin(d.location.origin) &&
    d.location.pathname.includes('/maimai-mobile/record/playlogDetail/')
  ) {
    addScoreConverterLink();
    calculateDetailedDxStar(d.body);
  }
})(document);
