(()=>{"use strict";!function(i){if(["maimaidx-eng.com","maimaidx.jp"].indexOf(i.location.host)<0)return;function e(e){const a=i.createElement("script");a.src="https://myjian.github.io/mai-tools/scripts/"+e+"?t="+Math.floor(Date.now()/6e4),i.body.append(a)}const a=i.location.pathname;"/maimai-mobile/record/"===a?e("recent-play-downloader.js"):a.indexOf("/maimai-mobile/record/playlogDetail/")>=0?e("score-converter.js"):a.indexOf("/maimai-mobile/record/music")>=0||a.indexOf("/maimai-mobile/friend/friendGenreVs/battleStart/")>=0||a.indexOf("/maimai-mobile/friend/friendLevelVs/battleStart/")>=0?e("score-sort.js"):a.indexOf("/maimai-mobile/friend/")>=0?e("analyze-friend-rating-in-new-tab.js"):a.indexOf("/maimai-mobile/home/")>=0||a.indexOf("/maimai-mobile/playerData/")>=0?e("analyze-rating-in-newtab.js"):a.indexOf("/maimai-mobile/photo/")>=0&&e("album-download-helper.js")}(document)})();