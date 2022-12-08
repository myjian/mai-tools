import {determineDxStar, getDxStarText} from '../common/dx-star';

(function (d) {
  function addDxStarDetail(row: HTMLElement) {
    const label = row.querySelector("img.f_l");
    if (!label) {
      // do not run this function twice
      return;
    }
    label.remove();

    const [playerDxScore, maxDxScore] = row.textContent
      .split("/")
      .map((t) => parseInt(t.replace(",", "").trim()));
    const dxScoreRatio = playerDxScore / maxDxScore;
    const dxStar =
      getDxStarText(determineDxStar(dxScoreRatio), true) + ` (${(dxScoreRatio * 100).toFixed(1)}%)`;
    const dxStarBlock = d.createElement("div");
    dxStarBlock.className = "f_l";
    dxStarBlock.append(dxStar);
    row.prepend(dxStarBlock);
  }

  const rows = d.querySelectorAll(".music_score_block.w_310") as NodeListOf<HTMLElement>;
  rows.forEach(addDxStarDetail);
})(document);
