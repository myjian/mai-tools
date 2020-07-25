export function getSongName(row: HTMLElement) {
  return (row.getElementsByClassName("music_name_block")[0] as HTMLElement).innerText;
}

export function getChartLevel(row: HTMLElement) {
  return (row.getElementsByClassName("music_lv_block")[0] as HTMLElement).innerText;
}

export function getChartDifficulty(row: HTMLElement) {
  const d = row.children[0].className.match(/music_([a-z]+)_score_back/)[1].toUpperCase();
  return d.indexOf("RE") === 0 ? "Re:MASTER" : d;
}

export function getChartType(row: HTMLElement) {
  if (row.id) {
    return row.id.includes("sta_") ? "STANDARD" : "DX";
  }
  return (row.children[1] as HTMLImageElement).src.includes("_standard") ? "STANDARD" : "DX";
}

export function getPlayerName(n: HTMLElement) {
  return (n.querySelector(".name_block") as HTMLElement).innerText;
}

export function fetchPlayerGrade(n: Document | HTMLElement) {
  const gradeImg = n.querySelector(".user_data_block_line ~ img.h_25") as HTMLImageElement;
  if (gradeImg) {
    const gradeIdx = gradeImg.src.lastIndexOf("grade_");
    return gradeImg.src.substring(gradeIdx + 6, gradeIdx + 8);
  }
  return null;
}
