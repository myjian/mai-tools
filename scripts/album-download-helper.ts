(function (d) {
  const DIFF_REGEX = /music_(\w+)_score_back/;
  // 540 = 9 * 60 minutes = UTC+9 (Japan Time), 1 minute = 60000 milliseconds
  const timezoneOffset = (540 - new Date().getTimezoneOffset()) * 60000;

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
    const songName = (row.getElementsByClassName(
      "black_block"
    )[0] as HTMLElement).innerText.replace(/<>:"\/\\\|\?\*/g, "-");
    const difficulty = row.className.match(DIFF_REGEX);
    return difficulty
      ? `${formatDate(playDate)} ${songName} ${difficulty[1].toUpperCase()}.jpg`
      : `${formatDate(playDate)} ${songName}.jpg`;
  }

  function assignFilenameToPhoto(row: HTMLElement) {
    if (row.getElementsByTagName("a").length) {
      return;
    }
    const img = row.querySelector("img.w_430") as HTMLImageElement;
    const link = d.createElement("a");
    link.download = getFileName(row);
    link.href = img.src;
    img.insertAdjacentElement('beforebegin', link);
    link.append(img);
  }

  function main() {
    const rows = Array.from(d.getElementsByClassName("black_block")).map((r) => r.parentElement);
    for (const row of rows) {
      assignFilenameToPhoto(row);
    }
  }
  main();
})(document);
