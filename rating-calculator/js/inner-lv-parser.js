/*
 * Parser is based on the format of
 * https%3A%2F%2Fsgimera.github.io%2Fmai_RatingAnalyzer%2Fscripts_maimai%2Fin_lv_dx.js
 * (use decodeURIComponent to unescape the link)
 */
const DX_REGEX = /\bdx\s*:\s*([^,]*)/
const LV_REGEX = /\blv\s*:\s*(\[.+?\])/
const SONGNAME_REGEX = /\bn\s*:\s*["'](.+?)['"]\s*[,\}]/
const SONGNICKNAME_REGEX = /\bnn\s*:\s*["'](.+?)['"]\s*[,\}]/

function parseInnerLevelLine(line) {
  const dxMatch = line.match(DX_REGEX);
  const lvMatch = line.match(LV_REGEX);
  const songNameMatch = line.match(SONGNAME_REGEX);
  const nicknameMatch = line.match(SONGNICKNAME_REGEX);
  if (dxMatch && lvMatch && songNameMatch) {
    return {
      dx: parseInt(dxMatch[1]),
      lv: JSON.parse(lvMatch[1]),
      songName: songNameMatch[1],
      nickname: nicknameMatch && nicknameMatch[1],
    };
  }
}
