import {fixTimezone, formatDate} from '../common/date-util';

(function (d) {
  const DIFF_REGEX = /music_(\w+)_score_back/;
  const DOWNLOAD_ICON = '💾';

  function getPlayDate(row: HTMLElement) {
    const playDateText = (row.getElementsByClassName('block_info')[0] as HTMLElement).innerText;
    const m = playDateText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const japanDt = new Date(
      parseInt(m[1]),
      parseInt(m[2]) - 1,
      parseInt(m[3]),
      parseInt(m[4]),
      parseInt(m[5])
    );
    return fixTimezone(japanDt);
  }

  function getFileName(row: HTMLElement) {
    const playDate = getPlayDate(row);
    const songName = (
      row.getElementsByClassName('black_block')[0] as HTMLElement
    ).innerText.replace(/<>:"\/\\\|\?\*/g, '-');
    const difficulty = row.className.match(DIFF_REGEX);
    return difficulty
      ? `${formatDate(playDate, '-')} ${songName} ${difficulty[1].toUpperCase()}.jpg`
      : `${formatDate(playDate, '-')} ${songName}.jpg`;
  }

  async function getPhotoLink(row: HTMLElement) {
    const img = row.querySelector('img.w_430') as HTMLImageElement;
    return fetch(img.src)
      .then((res) => res.blob())
      .then((b) => URL.createObjectURL(b));
  }

  function addLinkToSongname(row: HTMLElement, href: string, filename: string) {
    const songnameBlock = row.getElementsByClassName('black_block')[0];
    if (songnameBlock.getElementsByTagName('a').length) {
      return;
    }
    const link = d.createElement('a');
    link.download = filename;
    link.href = href;
    link.target = '_blank';
    songnameBlock.append(link);
    link.append(songnameBlock.childNodes[0], ' ', DOWNLOAD_ICON);
  }

  async function main() {
    // Enable right click
    d.body.oncontextmenu = null;

    const rows = Array.from(d.getElementsByClassName('black_block')).map((r) => r.parentElement);
    for (const row of rows) {
      const photoLink = await getPhotoLink(row);
      const filename = getFileName(row);
      addLinkToSongname(row, photoLink, filename);
    }
  }
  main();
})(document);
