import {getChartType} from "../common/chart-type";
import {Difficulty, getDifficultyForRecord, getDifficultyTextColor} from "../common/difficulties";
import {getSongName} from "../common/fetch-score-util";
import {GameRegion} from "../common/game-region";
import {fetchMagic} from "../common/magic";
import {isNiconicoLinkImg} from "../common/song-name-helper";
import {buildSongPropsMap, getSongProperties} from "../common/song-props";
import {fetchGameVersion, fetchSongDetailPage} from "../common/util";
import {getDisplayLv} from "../common/level-helper";

(function (d) {
  async function fetchChartLv(diff: Difficulty): Promise<string> {
    // First, try magic
    const gameVer = await fetchGameVersion(d.body);
    const gameRegion = window.location.host === "maimaidx.jp" ? GameRegion.Jp : GameRegion.Intl;
    const songProps = buildSongPropsMap(gameVer, gameRegion, await fetchMagic(gameVer));

    const name = getSongName(d.body);
    const songImg = d.querySelector("img.music_img") as HTMLImageElement;
    const genre = name === "Link" && isNiconicoLinkImg(songImg.src) ? "niconico" : "";
    const chartType = getChartType(d.body);
    const props = getSongProperties(songProps, name, genre, chartType);
    if (props) {
      return getDisplayLv(props.lv[diff]);
    }

    // If magic does not work, load from maimai-NET.
    const songIdxElem = d.querySelector("input[name=idx]") as HTMLInputElement;
    const songDetailPage = await fetchSongDetailPage(songIdxElem.value);
    const lvElem = songDetailPage.querySelector(`.music_detail_table tr:nth-child(${diff + 1}) .music_lv_back`);
    return lvElem.innerHTML.trim();
  }

  async function addLvToSongTitle(diff: Difficulty) {
    const chartLv = await fetchChartLv(diff);
    const songTitleDiv = d.querySelector(".basic_block.break") as HTMLElement;
    const clearImg = songTitleDiv.querySelector("img");
    if (clearImg) {
      clearImg.remove();
    }
    const lvElem = d.createElement("div");
    lvElem.className = "f_r"; // float: right
    lvElem.append("Lv " + chartLv)
    lvElem.style.color = getDifficultyTextColor(diff);
    songTitleDiv.append(lvElem);
  }

  if (
    (d.location.host === "maimaidx-eng.com" || d.location.host === "maimaidx.jp") &&
    d.location.pathname.includes("/maimai-mobile/record/playlogDetail/")
  ) {
    const diff = getDifficultyForRecord(d.body);
    addLvToSongTitle(diff);
  }
})(document);
