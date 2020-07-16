"use strict";
(function (d) {
  const BASE_NEWTAB_URL = "https://myjian.github.io/mai-tools/";
  const FINALE_RANK_IMG = new Map([
    ["S", "/maimai-mobile/maimai-img/icon_s.png"],
    ["S+", "/maimai-mobile/maimai-img/icon_s_plus.png"],
    ["SS", "/maimai-mobile/maimai-img/icon_ss.png"],
    ["SS+", "/maimai-mobile/maimai-img/icon_ss_plus.png"],
    ["SSS", "/maimai-mobile/maimai-img/icon_sss.png"],
    ["SSS+", "/maimai-mobile/maimai-img/icon_sss_plus.png"],
  ]);
  const DX_RANK_IMG = new Map([
    ["AAA", "/maimai-mobile/img/music_icon_aaa.png"],
    ["AA", "/maimai-mobile/img/music_icon_aa.png"],
    ["A", "/maimai-mobile/img/music_icon_a.png"],
  ])
  const FINALE_APFC_IMG = new Map([
    ["fc", "/maimai-mobile/maimai-img/icon_fc_silver.png"],
    ["fcplus", "/maimai-mobile/maimai-img/icon_fc_gold.png"],
    ["ap", "/maimai-mobile/maimai-img/icon_ap.png"],
  ]);
  const DX_APFC_IMG = new Map([
    ["applus", "/maimai-mobile/img/music_icon_app.png"],
  ]);
  const FINALE_SYNC_IMG = new Map([
    ["FS", "/maimai-mobile/maimai-img/icon_maxfever_silver.png"],
    ["FS+", "/maimai-mobile/maimai-img/icon_maxfever_gold.png"],
  ]);
  const DX_SYNC_IMG = new Map([
    ["FDX", "/maimai-mobile/img/music_icon_fsd.png"],
    ["FDX+", "/maimai-mobile/img/music_icon_fsdp.png"],
  ])

  function trimSpaces(textLine) {
    return textLine.trim().replace(/\s+/g, "-");
  }

  function padNumberWithZeros(n, len) {
    len = len || 2;
    return n.toString().padStart(len, '0');
  }

  function formatDate(dt) {
    return (
      dt.getFullYear()
      + "-" + padNumberWithZeros(dt.getMonth() + 1)
      + "-" + padNumberWithZeros(dt.getDate())
      + " " + padNumberWithZeros(dt.getHours())
      + ":" + padNumberWithZeros(dt.getMinutes())
    );
  }

  function fetchAndCacheImg(map, title) {
    let img = map.get(title);
    if (img instanceof Blob) {
      return Promise.resolve(img);
    } else if (img) {
      return fetch(img).then((res) => res.blob()).then((b) => {
        map.set(title, b);
        return b;
      });
    }
  }

  function getSongName(e) {
    return e.querySelector(".basic_block.break").childNodes[1].nodeValue;
  }

  function getAchv(e) {
    const achv = e.querySelector(".playlog_achievement_txt").innerText;
    return achv.substring(0, achv.length - 1); // remove "%"
  }

  function getNoteDetails(e) {
    return e.querySelector(".playlog_notes_detail").innerText.split("\n").slice(-5).map(trimSpaces).join("_");
  }

  function getDifficulty(e) {
    const src = e.querySelector(".playlog_top_container img.playlog_diff").src;
    const d = src.substring(src.lastIndexOf("_") + 1, src.lastIndexOf("."));
    return d === "remaster" ? "Re:MASTER" : d.toUpperCase();
  }

  function getTrack(e) {
    return e.querySelector(".playlog_top_container .sub_title .f_b").innerText.replace("0", "");
  }

  function getPlayDate(e) {
    const jpDtText = e.querySelector(".playlog_top_container .sub_title span:last-child").innerText;
    const m = jpDtText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const jpDt = new Date(
      parseInt(m[1]),
      parseInt(m[2])-1,
      parseInt(m[3]),
      parseInt(m[4]),
      parseInt(m[5])
    );
    return formatDate(new Date(jpDt.valueOf() - 1000 * 60 * 60));
  }

  function getIsHighScore(e) {
    return e.querySelector(".playlog_achievement_newrecord") ? 1 : 0;
  }

  function getCombo(e) {
    return e.querySelector(".col2 .playlog_score_block .white").innerText;
    //return e.querySelector(".col2 .playlog_score_block .white").innerText.replace("/", " / ");
  }

  function getSongImage(e) {
    const img = e.querySelector("img.music_img");
    const canvas = d.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  function getRankTitle(e) {
    const src = document.querySelector(".playlog_scorerank").src;
    const title = src.substring(src.lastIndexOf("/") + 1, src.lastIndexOf("."));
    return title.toUpperCase().replace("PLUS", "+");
  }

  function getRankImage(title) {
    return (
      fetchAndCacheImg(FINALE_RANK_IMG, title)
      || fetchAndCacheImg(DX_RANK_IMG, title)
      || Promise.reject('invalid title "' + title + '"')
    );
  }

  function getApFcImage(e) {
    const src = document.querySelector(".playlog_result_innerblock > img:nth-child(2)").src;
    const title = src.substring(src.lastIndexOf("/") + 1, src.lastIndexOf("."));
    if (title === "fc_dummy") {
      return Promise.resolve();
    }
    return (
      fetchAndCacheImg(FINALE_APFC_IMG, title)
      || fetchAndCacheImg(DX_APFC_IMG, title)
      || Promise.reject('invalid title "' + title + '"')
    );
  }

  function getSyncResult(e) {
    const src = document.querySelector(".playlog_result_innerblock > img:nth-child(3)").src;
    const title = src.substring(src.lastIndexOf("/") + 1, src.lastIndexOf("."));
    switch (title) {
      case "fs":
        return "FS";
      case "fsplus":
        return "FS+";
      case "fsd":
        return "FDX";
      case "fsdplus":
        return "FDX+";
    }
    return null;
  }

  function getSyncImage(syncResult) {
    if (syncResult) {
      return (
        fetchAndCacheImg(FINALE_SYNC_IMG, syncResult)
        || fetchAndCacheImg(DX_SYNC_IMG, syncResult)
        || Promise.reject('invalid title "' + syncResult + '"')
      );
    }
    return Promise.resolve();
  }

  if ((d.location.host === "maimaidx-eng.com" || d.location.host === "maimaidx.jp") && d.location.pathname.includes("/maimai-mobile/record/playlogDetail/")) {
    let url = (
      BASE_NEWTAB_URL
      + "?st=" + encodeURIComponent(getSongName(d.body))
      + "&ac=" + encodeURIComponent(getAchv(d.body))
      + "&nd=" + encodeURIComponent(getNoteDetails(d.body))
      + "&df=" + encodeURIComponent(getDifficulty(d.body))
      + "&tk=" + encodeURIComponent(getTrack(d.body))
      + "&dt=" + encodeURIComponent(getPlayDate(d.body))
      + "&hs=" + encodeURIComponent(getIsHighScore(d.body))
      + "&cb=" + encodeURIComponent(getCombo(d.body))
    );
    const syncStatus = getSyncResult(d.body);
    if (syncStatus) {
      url += "&sc=" + encodeURIComponent();
    }
    console.log(url);
    console.log("url length: " + url.length);
    window.open(url, "_blank");
    window.addEventListener("message", (evt) => {
      if (evt.origin === "https://myjian.github.io" || evt.origin === "https://cdpn.io") {
        const data = evt.data;
        const source = evt.source;
        let rankTitle;
        switch (data.action) {
          case "ready":
            source.postMessage(
              {action: "songImage", imgSrc: getSongImage(d.body)},
              evt.origin
            );
            getApFcImage(d.body).then((img) => {
              if (img) {
                source.postMessage({action: "apFcImage", img}, evt.origin);
              }
            });
            getSyncImage(getSyncResult(d.body)).then((img) => {
              if (img) {
                source.postMessage({action: "syncImage", img}, evt.origin);
              }
            });
            rankTitle = getRankTitle(d.body);
            getRankImage(rankTitle).then((img) => {
              source.postMessage({action: "rankImage", title: rankTitle, img}, evt.origin);
            });
            break;
          case "getRankImage":
            rankTitle = data.payload;
            getRankImage(rankTitle).then((img) => {
              source.postMessage({action: "rankImage", title: rankTitle, img}, evt.origin);
            });
            break;
        }
      }
    });
  }
})(document);
