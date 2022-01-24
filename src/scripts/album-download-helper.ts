(function (d) {
  const DIFF_REGEX = /music_(\w+)_score_back/;
  const DOWNLOAD_ICON = "💾";
  // 540 = 9 * 60 minutes = UTC+9 (Japan Time), 1 minute = 60000 milliseconds
  const timezoneOffset = (540 + new Date().getTimezoneOffset()) * 60000;

  function getPlayDate(row: HTMLElement) {
    const playDateText = (row.getElementsByClassName("block_info")[0] as HTMLElement).innerText;
    const m = playDateText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const japanDt = new Date(
      parseInt(m[1]),
      parseInt(m[2]) - 1,
      parseInt(m[3]),
      parseInt(m[4]),
      parseInt(m[5])
    );
    return new Date(japanDt.valueOf() - timezoneOffset);
  }

  function padNumberWithZeros(n: number, len?: number) {
    len = len || 2;
    return n.toString().padStart(len, "0");
  }

  function formatDate(dt: Date) {
    return (
      dt.getFullYear() +
      "-" +
      padNumberWithZeros(dt.getMonth() + 1) +
      "-" +
      padNumberWithZeros(dt.getDate()) +
      " " +
      padNumberWithZeros(dt.getHours()) +
      "-" +
      padNumberWithZeros(dt.getMinutes())
    );
  }

  function getFileName(row: HTMLElement) {
    const playDate = getPlayDate(row);
    const songName = (
      row.getElementsByClassName("black_block")[0] as HTMLElement
    ).innerText.replace(/<>:"\/\\\|\?\*/g, "-");
    const difficulty = row.className.match(DIFF_REGEX);
    return difficulty
      ? `${formatDate(playDate)} ${songName} ${difficulty[1].toUpperCase()}.jpg`
      : `${formatDate(playDate)} ${songName}.jpg`;
  }

  function getPhotoLink(row: HTMLElement) {
    const img = row.querySelector("img.w_430") as HTMLImageElement;
    return img.src;
  }

  function addLinkToPhoto(row: HTMLElement, href: string, filename: string) {
    if (row.getElementsByTagName("a").length) {
      return;
    }
    const img = row.querySelector("img.w_430") as HTMLImageElement;
    const link = d.createElement("a");
    link.download = filename;
    link.href = href;
    img.insertAdjacentElement("beforebegin", link);
    link.append(img);
  }

  function addLinkToSongname(row: HTMLElement, href: string, filename: string) {
    const songnameBlock = row.getElementsByClassName("black_block")[0];
    if (songnameBlock.getElementsByTagName("a").length) {
      return;
    }
    const link = d.createElement("a");
    link.download = filename;
    link.href = href;
    link.target = "_blank";
    songnameBlock.append(link);
    link.append(songnameBlock.childNodes[0], " ", DOWNLOAD_ICON);
  }

  function main() {
    // Enable right click
    document.body.oncontextmenu = null;
    const rows = Array.from(d.getElementsByClassName("black_block")).map((r) => r.parentElement);
    for (const row of rows) {
      const photoLink = getPhotoLink(row);
      const filename = getFileName(row);
      addLinkToPhoto(row, photoLink, filename);
      addLinkToSongname(row, photoLink, filename);
    }
  }
  main();
})(document);
