"use strict";
(function (d) {
  function trimSpaces(textLine) {
    return textLine.trim().replaceAll("\t", " ");
  }
  if ((d.location.host === "maimaidx-eng.com" || d.location.host === "maimaidx.jp") && d.location.pathname.includes("/maimai-mobile/record/playlogDetail/")) {
    var st = d.querySelector(".basic_block.break").childNodes[1].nodeValue;
    var ac = d.querySelector(".playlog_achievement_txt").innerText;
    var nd = d.querySelector(".playlog_notes_detail").innerText.split("\n").slice(-5).map(trimSpaces).join("\n");
    window.open("https://myjian.github.io/mai-tools/?st=" + encodeURIComponent(st) + "&ac=" + encodeURIComponent(ac) + "&nd=" + encodeURIComponent(nd), "_blank");
  }
})(document);
