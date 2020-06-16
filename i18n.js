(function(){
  const convertBtn = document.getElementById("convert");
  const achievementSpans = document.querySelectorAll(".achievement");
  const chartInfoHeading = document.getElementById("chartInfoHeading");
  const howtoHeading = document.getElementById("howtoHeading");
  const descriptionArea = document.getElementById("description");
  const bookmarklet = document.getElementById("bookmarklet");
  const finaleBorder = document.getElementById("finaleBorder");
  const totalNoteCount = document.getElementsByClassName("totalNoteCount")[0];

  if (navigator.language.startsWith("zh")) {
    howtoHeading.innerText = "使用方式";
    chartInfoHeading.innerText = "譜面資訊";
    bookmarklet.innerText = document.title = "換算 maimai DX 成績為 maimai 舊筐成績";
    convertBtn.innerText = "分析";
    totalNoteCount.innerText = "總計";
    finaleBorder.innerText = "距離下個 Rank 的分數差 (舊版計分方式)";
    achievementSpans.forEach((span) => {
      span.innerText = "達成率";
    });
    descriptionArea.innerText = `
使用方式一：自動代入成績
1. 把網頁下方的連結加入書籤
2. 登入 maimai DX NET，打開一個最近打過的歌曲成績
3. 使用書籤 (如果問你是否顯示彈出視窗，按允許)
4. 分數資料會自動匯入到此頁面

使用方式二：手動貼上成績 (僅限電腦版)
1. 登入 maimai DX net，打開一個最近打過的歌曲成績
2. 全選並用 Ctrl+C 複製
3. 貼到上面的文字欄。
4. 按下「${convertBtn.innerText}」進行分數換算。
`;
  } else {
    descriptionArea.innerText = `
Method 1: automatic import
1. Create a bookmarklet from the link below.
2. Log in to maimai DX NET, and open a recently played song score page.
3. Use the bookmarklet. (Accept pop-up window if being asked.)
4. This page shall open with score data imported.

Method 2: manually paste score
1. Log in to maimai DX NET, and open a recently played song score page.
2. Select all and copy with Ctrl-C.
3. Paste the content into the text area at the top of this page.
4. Click "${convertBtn.innerText}".
`;
  }
})();
