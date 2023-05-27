import {getChartType} from '../common/chart-type';
import {determineDxStar, getDxStarText} from '../common/dx-star';
import {getGameRegionFromOrigin} from '../common/game-region';
import {getDefaultLevel} from '../common/level-helper';
import {fetchMagic} from '../common/magic';
import {fetchGameVersion} from '../common/net-helpers';
import {normalizeSongName} from '../common/song-name-helper';
import {buildSongDatabase, SongProperties} from '../common/song-props';

type Cache = {
  songProp?: SongProperties;
};

(function (d) {
  const cache: Cache = {};
  const LV_DELTA = 0.02;

  function addDxStarDetail(row: HTMLElement) {
    const label = row.querySelector('img.f_l');
    if (!label) {
      // do not run this function twice
      return;
    }
    label.remove();

    const [playerDxScore, maxDxScore] = row.textContent
      .split('/')
      .map((t) => parseInt(t.replace(',', '').trim()));
    const dxScoreRatio = playerDxScore / maxDxScore;
    const dxStar =
      getDxStarText(determineDxStar(dxScoreRatio), true) + ` (${(dxScoreRatio * 100).toFixed(1)}%)`;
    const dxStarBlock = d.createElement('div');
    dxStarBlock.className = 'f_l';
    dxStarBlock.append(dxStar);
    row.prepend(dxStarBlock);
  }

  async function fetchAndAddInternalLv() {
    const gameVer = await fetchGameVersion(d.body);
    const gameRegion = getGameRegionFromOrigin(d.location.origin);
    const songDb = await buildSongDatabase(gameVer, gameRegion, await fetchMagic(gameVer));

    const song = getSongName(); // TODO: handle "Link"
    const chartType = getChartType(d.body);

    const props = songDb.getSongProperties(song, '', chartType);
    cache.songProp = props;

    // replace table song level
    Array.from(getLevelTable(), (row, idx) => {
      const levelElement = getLevelElement(row as HTMLElement);
      if (!levelElement) {
        return;
      }
      saveInLv(levelElement, coalesceInLv(levelElement, idx, props));
    });

    // replace play history's level
    ['basic', 'advanced', 'expert', 'master', 'remaster'].forEach((rowId, idx) => {
      const row = d.querySelector(`#${rowId}`);
      if (!row) {
        return;
      }
      const levelElement = getLevelElement(row as HTMLElement);
      saveInLv(levelElement, coalesceInLv(levelElement, idx, props));
    });
  }

  function saveInLv(levelElement: HTMLElement, lv: number) {
    if (!levelElement.dataset['inlv']) {
      const isEstimate = isEstimateLv(lv);
      levelElement.dataset['inlv'] = lv.toFixed(2);
      levelElement.innerText = (isEstimate ? '*' : '') + lv.toFixed(1);
    }
  }

  function isEstimateLv(lv: number) {
    const majorLv = Math.floor(lv);
    const minorLv = lv - majorLv;
    return minorLv > 0.95 ? 1 : minorLv > 0.65 && minorLv < 0.69 ? 0.7 : 0;
  }

  function coalesceInLv(levelElement: HTMLElement, lvIndex: number, props?: SongProperties | null) {
    let lv = 0;
    if (props) {
      lv = props.lv[lvIndex];
      if (typeof lv !== 'number') {
        lv = 0;
      } else if (lv < 0) {
        // console.warn("lv is negative for song " + song, props);
        lv = Math.abs(lv) - LV_DELTA;
      }
    }
    return lv || getDefaultLevel(getChartLv(levelElement)) - LV_DELTA;
  }

  function getChartLv(levelElement: HTMLElement, key: string = 'lv'): string | undefined {
    return levelElement.dataset[key];
  }

  function getSongName(): string {
    return normalizeSongName(document.querySelector('.m_5.f_15.break').textContent);
  }

  function getLevelTable(): NodeList {
    return d.querySelectorAll('.music_detail_table tr');
  }

  function getLevelElement(row: HTMLElement): HTMLDivElement {
    return row.querySelector('.music_lv_back');
  }

  const rows = d.querySelectorAll('.music_score_block.w_310') as NodeListOf<HTMLElement>;
  rows.forEach(addDxStarDetail);
  fetchAndAddInternalLv();
})(document);
