(function(){
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
  
  function postMessageToTab(tab, action, text) {
    const obj = {action: action, payload: text};
    tab.postMessage(obj, "https://myjian.github.io");
  }

  async function fetchAllScores(tab, onError) {
    const host = document.location.host;
    if (host !== "maimaidx-eng.com" && host !== "maimaidx.jp") {
      onError("請登入 maimai NET");
      return;
    }
    const scoreList = [];
    for (const [difficulty, url] of SCORE_URLS) {
      postMessageToTab(tab, "appendPlayerScore", statusText(difficulty, false));
      await fetchScores(url, scoreList);
      postMessageToTab(tab, "appendPlayerScore", statusText(difficulty, true));
    }
    postMessageToTab(tab, "replacePlayerScore", "");
    for (let i = 0; i < scoreList.length; i += 50) {
      postMessageToTab(tab, "appendPlayerScore", scoreList.slice(i, i + 50).join("\n"));
    }
    postMessageToTab(tab, "calculateRating", "");
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

  const newtab = window.open(
    "https://myjian.github.io/mai-tools/rating-calculator/?t="+Math.floor(Date.now()/60000),
    "ratingcalc"
  );
  window.addEventListener("message", (evt) => {
    console.log(evt.origin, evt.data);
    if (evt.origin === "https://myjian.github.io") {
      if (evt.data === "ready") {
        fetchAllScores(newtab, handleError);
      }
    }
  });
})();
