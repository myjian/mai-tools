export function performLocalization() {
  const analyzeBtn = document.getElementById("analyze");
  const convertBtn = document.getElementById("convert");
  const resetLink = document.getElementById("resetLink");
  const chartInfoHeading = document.getElementById("chartInfoHeading");
  const howtoHeading = document.getElementById("howtoHeading");
  const descriptionArea = document.getElementById("description");
  const bookmarklet = document.getElementById("bookmarklet");
  const sampleInput = document.getElementById("sampleInputs")
  const totalNoteCount = document.getElementsByClassName("totalNoteCount")[0] as HTMLElement;

  if (navigator.language.startsWith("zh")) {
    document.title = "譜面資訊";

    howtoHeading.innerText = "使用方式";
    chartInfoHeading.innerText = "譜面資訊";
    bookmarklet.innerText = "換算 maimai DX 成績為舊版分數";
    analyzeBtn.innerText = "分析";
    convertBtn.innerText = "換算成舊版分數";
    sampleInput.innerText = "範例輸入";
    totalNoteCount.innerText = "總計";
    resetLink.innerText = "重新輸入";
    descriptionArea.innerText = `
使用方式一：自動代入成績
1. 把網頁下方的連結加入書籤
2. 登入 maimai DX NET，打開一個最近打過的歌曲成績
3. 使用書籤
4. 點擊「點我分析分數」
5. 分數資料會自動匯入

使用方式二：手動貼上成績 (僅限電腦版)
1. 登入 maimai DX net，打開一個最近打過的歌曲成績
2. 全選並用 Ctrl+C 複製
3. 貼到上面的文字欄。
4. 按下「${convertBtn.innerText}」或「${analyzeBtn.innerText}」
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
4. Click "${convertBtn.innerText}" or "${analyzeBtn.innerText}".
`;
  }
}