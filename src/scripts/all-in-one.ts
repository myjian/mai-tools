import {removeScrollControl} from '../common/net-helpers';
import {getScriptHost} from '../common/script-host';

(function (d) {
  const SCRIPT_HOST = getScriptHost("all-in-one") + "/scripts/";
  if (["maimaidx-eng.com", "maimaidx.jp"].indexOf(d.location.host) < 0) {
    // TODO: tell user to open maimai net
    return;
  }

  function appendScript(filename: string) {
    const s = d.createElement("script");
    s.src = SCRIPT_HOST + filename + "?t=" + Math.floor(Date.now() / 60000);
    d.body.append(s);
  }

  const path = d.location.pathname;
  if (path === "/maimai-mobile/record/") {
    appendScript("recent-play-downloader.js");
  } else if (path.indexOf("/maimai-mobile/record/playlogDetail/") >= 0) {
    appendScript("score-converter.js");
    appendScript("play-record-helper.js");
  } else if (path.indexOf("/maimai-mobile/record/musicDetail/") >= 0) {
    removeScrollControl(d);
    appendScript("song-detail-helper.js");
  } else if (path.indexOf("/maimai-mobile/record/music") >= 0) {
    appendScript("score-sort.js");
  } else if (path.indexOf("/maimai-mobile/friend/") >= 0) {
    appendScript("analyze-friend-rating-in-new-tab.js");
    if (
      path.indexOf("/maimai-mobile/friend/friendGenreVs/battleStart/") >= 0 ||
      path.indexOf("/maimai-mobile/friend/friendLevelVs/battleStart/") >= 0
    ) {
      appendScript("score-sort.js");
    }
  } else if (
    path.indexOf("/maimai-mobile/home/") >= 0 ||
    path.indexOf("/maimai-mobile/playerData/") >= 0
  ) {
    removeScrollControl(d);
    appendScript("score-download.js");
    appendScript("analyze-rating-in-newtab.js");
  } else if (path.indexOf("/maimai-mobile/photo/") >= 0) {
    appendScript("album-download-helper.js");
  }
})(document);
