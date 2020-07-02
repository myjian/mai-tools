(function(){
  const LOCATION_HASH = "#rating-analyzer";
  
  const SCORE_URLS = new Map([
    ["Re:MASTER", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=4"],
    ["MASTER", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=3"],
    ["EXPERT", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=2"],
    ["ADVANCED", "/maimai-mobile/record/musicGenre/search/?genre=99&diff=1"]
  ]);

  function statusText(difficulty, end) {
    switch (difficulty) {
      case "Re:MASTER":
        return (end ? "✔ 白譜成績下載完畢！" : "🕓 下載白譜成績中…");
      case "MASTER":
        return (end ? "✔ 紫譜成績下載完畢！" : "🕓 下載紫譜成績中…");
      case "EXPERT":
        return (end ? "✔ 紅譜成績下載完畢！" : "🕓 下載紅譜成績中…");
      case "ADVANCED":
        return (end ? "✔ 黃譜成績下載完畢！" : "🕓 下載黃譜成績中…");
      case "ALL":
        return "✅ 全部成績下載完畢，請按網頁上的「複製成績」把資料複製到剪貼簿。";
    }
  }

  function getSongName(row) {
    return row.getElementsByClassName("music_name_block")[0].innerText;
  }

  function getChartLevel(row) {
    return row.getElementsByClassName("music_lv_block")[0].innerText;
  }

  function getChartDifficulty(row) {
    const d = row.children[0].className.match(/music_([a-z]+)_score_back/)[1].toUpperCase();
    return d.indexOf("RE") === 0 ? "Re:MASTER" : d;
  }

  function getChartType(row) {
    if (row.id) {
      return row.id.includes("sta_") ? "STANDARD" : "DX";
    }
    return row.children[1].src.includes("_standard") ? "STANDARD" : "DX";
  }

  function getAchievement(row) {
    const ach = row.querySelector(".music_score_block.w_120");
    return ach && ach.innerText;
  }

  function processRow(row, state) {
    const isGenreRow = row.classList.contains("screw_block");
    const isScoreRow = (
      row.classList.contains("w_450")
      && row.classList.contains("m_15")
      && row.classList.contains("p_r")
      && row.classList.contains("f_0")
    );
    if (isGenreRow) {
      state.genre = row.innerText;
    }
    else if (isScoreRow) {
      const songName = getSongName(row);
      const level = getChartLevel(row);
      const difficulty = getChartDifficulty(row);
      const chartType = getChartType(row);
      const achievement = getAchievement(row);
      if (!achievement) {
        return;
      }
      state.scoreList.push([
        songName,
        state.genre,
        difficulty,
        level,
        chartType,
        achievement
      ].join("\t"));
    }
  }

  async function fetchScores(url, scoreList) {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    const rows = dom.querySelectorAll(".main_wrapper.t_c .m_15");
    const state = {genre: "", scoreList: scoreList};
    rows.forEach(row => processRow(row, state));
  }
  
  function sendAllScoresToIframe(iframe, action, text) {
    const obj = {action: "insertPlayerScore", payload: text};
    iframe.contentWindow.postMessage(obj, "https://myjian.github.io/");
  }

  async function fetchAllScores(iframe, onError) {
    const host = document.location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      onError("請登入 maimai NET");
      return;
    }
    const scoreList = [];
    for (const [difficulty, url] of SCORE_URLS) {
      sendAllScoresToIframe(iframe, "appendPlayerScore", statusText(difficulty, false));
      await fetchScores(url, scoreList);
      sendAllScoresToIframe(iframe, "appendPlayerScore", statusText(difficulty, true));
    }
    sendAllScoresToIframe(iframe, scoreList.join("\n"));
  }

  function handleError(msg) {
    alert(msg);
  }

  function handleOutput(msg) {
    const comment = document.querySelector(".comment_block");
    if (comment) {
      comment.innerText = comment.innerText + msg + "\n";
    }
    else {
      console.log(msg);
    }
  }

  function createIframe() {
    const fr = document.createElement("iframe");
    document.body.style.overflow = "hidden";
    fr.style.position = "fixed";
    fr.style.width = "100vw";
    fr.style.height = "100vh";
    fr.style.zIndex = 1000;
    fr.style.border = "none";
    fr.src = "https://myjian.github.io/mai-tools/rating-calculator/";
    window.location.assign("#rating-analyzer");
    window.addEventListener('hashchange', function() {
      if (window.location.hash === LOCATION_HASH) {
        fr.style.display = "block";
        document.body.style.overflow = "hidden";
      } else {
        fr.style.display = "none";
        document.body.style.overflow = "visible";
      }
    });
    return fr;
  }
  
  const fr = createIframe();
  document.body.prepend(fr);
  window.addEventListener("message", (evt) => {
    if (evt.origin === "https://myjian.github.io/" && evt.data === "ready") {
      fetchAllScores(fr, handleError);
    }
  });
})();
