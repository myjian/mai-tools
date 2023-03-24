import {normalizeSongName} from './song-name-helper';

export function getSongName(row: HTMLElement) {
  return normalizeSongName(
    (row.getElementsByClassName("music_name_block")[0] as HTMLElement).innerText
  );
}

export function getChartLevel(row: HTMLElement) {
  return (row.getElementsByClassName("music_lv_block")[0] as HTMLElement).innerText;
}

export function getChartDifficulty(row: HTMLElement) {
  if (!row.classList.contains("pointer")) {
    const actualRow = row.querySelector(".pointer") as HTMLElement;
    row = actualRow || row;
  }
  const d = row.className.match(/music_([a-z]+)_score_back/)[1].toUpperCase();
  return d.indexOf("RE") === 0 ? "Re:MASTER" : d;
}

export function getPlayerName(n: HTMLElement) {
  if (n.className.includes("friend_vs_friend_block")) {
    return (n.querySelector(".t_l") as HTMLElement)?.innerText;
  }
  return (n.querySelector(".name_block") as HTMLElement)?.innerText;
}

export function getPlayerGrade(n: Document | HTMLElement) {
  const gradeImg = n.querySelector(".user_data_block_line ~ img.h_25") as HTMLImageElement;
  if (gradeImg) {
    const gradeIdx = gradeImg.src.lastIndexOf("grade_");
    return gradeImg.src.substring(gradeIdx + 6, gradeIdx + 8);
  }
  return null;
}
