!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=92)}({92:function(e,t,n){"use strict";!function(e){const t=/music_(\w+)_score_back/,n=6e4*(540+(new Date).getTimezoneOffset());function r(e,t){return t=t||2,e.toString().padStart(t,"0")}function o(e){return e.getFullYear()+"-"+r(e.getMonth()+1)+"-"+r(e.getDate())+" "+r(e.getHours())+"-"+r(e.getMinutes())}function a(e){const r=function(e){const t=e.getElementsByClassName("block_info")[0].innerText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/),r=new Date(parseInt(t[1]),parseInt(t[2])-1,parseInt(t[3]),parseInt(t[4]),parseInt(t[5]));return new Date(r.valueOf()-n)}(e),a=e.getElementsByClassName("black_block")[0].innerText.replace(/<>:"\/\\\|\?\*/g,"-"),u=e.className.match(t);return u?`${o(r)} ${a} ${u[1].toUpperCase()}.jpg`:`${o(r)} ${a}.jpg`}function u(t){if(t.getElementsByTagName("a").length)return;const n=t.querySelector("img.w_430"),r=e.createElement("a");r.download=a(t),r.href=n.src,n.insertAdjacentElement("beforebegin",r),r.append(n)}!function(){document.body.oncontextmenu=null;const t=Array.from(e.getElementsByClassName("black_block")).map(e=>e.parentElement);for(const e of t)u(e)}()}(document)}});