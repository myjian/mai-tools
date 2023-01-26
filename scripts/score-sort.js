(()=>{"use strict";var e={8642:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.getDifficultyName=n.DIFFICULTY_CLASSNAME_MAP=n.DIFFICULTIES=void 0,n.DIFFICULTIES=["BASIC","ADVANCED","EXPERT","MASTER","Re:MASTER"],n.DIFFICULTY_CLASSNAME_MAP=new Map([["Re:MASTER","remaster"],["MASTER","master"],["EXPERT","expert"],["ADVANCED","advanced"]]),n.getDifficultyName=function(e){return n.DIFFICULTIES[e]}},2347:(e,n,t)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.getPlayerGrade=n.getPlayerName=n.getChartType=n.getChartDifficulty=n.getChartLevel=n.getSongName=void 0;const r=t(472);n.getSongName=function(e){return(0,r.normalizeSongName)(e.getElementsByClassName("music_name_block")[0].innerText)},n.getChartLevel=function(e){return e.getElementsByClassName("music_lv_block")[0].innerText},n.getChartDifficulty=function(e){if(!e.classList.contains("pointer")){const n=e.querySelector(".pointer");e=n||e}const n=e.className.match(/music_([a-z]+)_score_back/)[1].toUpperCase();return 0===n.indexOf("RE")?"Re:MASTER":n},n.getChartType=function(e){return e.id?e.id.includes("sta_")?0:1:e.querySelector("img:nth-child(2)").src.includes("_standard")?0:1},n.getPlayerName=function(e){var n,t;return e.className.includes("friend_vs_friend_block")?null===(n=e.querySelector(".t_l"))||void 0===n?void 0:n.innerText:null===(t=e.querySelector(".name_block"))||void 0===t?void 0:t.innerText},n.getPlayerGrade=function(e){const n=e.querySelector(".user_data_block_line ~ img.h_25");if(n){const e=n.src.lastIndexOf("grade_");return n.src.substring(e+6,e+8)}return null}},6510:function(e,n,t){var r=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(o,c){function i(e){try{a(r.next(e))}catch(e){c(e)}}function s(e){try{a(r.throw(e))}catch(e){c(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,s)}a((r=r.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.fetchScores=n.SELF_SCORE_URLS=void 0;const o=t(8642),c=t(2347),i=t(6420);n.SELF_SCORE_URLS=new Map([[4,"/maimai-mobile/record/musicGenre/search/?genre=99&diff=4"],[3,"/maimai-mobile/record/musicGenre/search/?genre=99&diff=3"],[2,"/maimai-mobile/record/musicGenre/search/?genre=99&diff=2"],[1,"/maimai-mobile/record/musicGenre/search/?genre=99&diff=1"],[0,"/maimai-mobile/record/musicGenre/search/?genre=99&diff=0"]]),n.fetchScores=function(e,t){return r(this,void 0,void 0,(function*(){const r=n.SELF_SCORE_URLS.get(e);if(!r)return;const s=yield(0,i.fetchPage)(r),a=s.querySelectorAll(".main_wrapper.t_c .m_15"),l={genre:"",scoreList:t};return a.forEach((n=>function(e,n,t){const r=e.classList.contains("screw_block"),i=e.classList.contains("w_450")&&e.classList.contains("m_15")&&e.classList.contains("p_r")&&e.classList.contains("f_0");if(r)t.genre=e.innerText;else if(i){const r=(0,c.getSongName)(e),i=(0,c.getChartLevel)(e),s=1===(0,c.getChartType)(e)?"DX":"STANDARD",a=function(e){const n=e.querySelector(".music_score_block.w_120");return n&&n.innerText}(e);if(!a)return;t.scoreList.push([r,t.genre,(0,o.getDifficultyName)(n),i,s,a].join("\t"))}}(n,e,l))),s}))}},134:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.getVersionName=n.validateGameVersion=n.RATING_CALCULATOR_SUPPORTED_VERSIONS=void 0;const t=["maimai","maimai PLUS","GreeN","GreeN PLUS","ORANGE","ORANGE PLUS","PiNK","PiNK PLUS","MURASAKi","MURASAKi PLUS","MiLK","MiLK PLUS","FiNALE","maimaiでらっくす","maimaiでらっくす PLUS","Splash","Splash PLUS","UNiVERSE","UNiVERSE PLUS","FESTiVAL"];n.RATING_CALCULATOR_SUPPORTED_VERSIONS=[17,18,19],n.validateGameVersion=function(e,t=18){const r="string"==typeof e?parseInt(e):e;return!e||isNaN(r)?t:r>=n.RATING_CALCULATOR_SUPPORTED_VERSIONS[0]&&r<=n.RATING_CALCULATOR_SUPPORTED_VERSIONS[n.RATING_CALCULATOR_SUPPORTED_VERSIONS.length-1]?r:t},n.getVersionName=function(e){return t[e]}},8080:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.getInitialLanguage=n.saveLanguage=n.SUPPORTED_LANGUAGES=void 0,n.SUPPORTED_LANGUAGES=["en_US","zh_TW","ko_KR"];const t="MaiToolsLang";n.saveLanguage=function(e){window.localStorage.setItem(t,e)},n.getInitialLanguage=function(){const e=new URLSearchParams(location.search).get("hl");if(e)return e.startsWith("zh")?"zh_TW":e.startsWith("ko")?"ko_KR":"en_US";return function(){switch(window.localStorage.getItem(t)){case"en_US":return"en_US";case"zh_TW":return"zh_TW";case"ko_KR":return"ko_KR"}return null}()||(navigator.language.startsWith("zh")?"zh_TW":navigator.language.startsWith("ko")?"ko_KR":"en_US")}},9268:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.getDefaultLevel=n.getOfficialLevel=void 0,n.getOfficialLevel=function(e){const n=Math.floor(e);return e-n>.6?n+"+":n.toString()},n.getDefaultLevel=function(e){if(!e)return 1;const n=parseInt(e);return e.endsWith("+")?n+.7:n}},6685:function(e,n,t){var r=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(o,c){function i(e){try{a(r.next(e))}catch(e){c(e)}}function s(e){try{a(r.throw(e))}catch(e){c(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,s)}a((r=r.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.writeMagicToCache=n.readMagicFromCache=n.fetchMagic=void 0;const o=t(134),c={17:"aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfdW5pdmVyc2UuanM=",18:"aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vZWU1NjlkNzRmNDIyZDRlMjU1MDY1ZDhiMDJlYTI5NGEvcmF3LzkzMmZiMDNhMzgxMjEyMTAwODBkNmY1Mzc5MTNhMDg0MjQ3ZTUzMWMvbWFpZHhfaW5fbHZfdW5pdmVyc2VwbHVzLmpz",19:"aHR0cHM6Ly9zZ2ltZXJhLmdpdGh1Yi5pby9tYWlfUmF0aW5nQW5hbHl6ZXIvc2NyaXB0c19tYWltYWkvbWFpZHhfaW5fbHZfZmVzdGl2YWwuanM="};function i(e){return"dxLv"+e}n.fetchMagic=function(e){return r(this,void 0,void 0,(function*(){const n=c[e]||c[18],t=yield fetch(atob(n));return yield t.text()}))},n.readMagicFromCache=function(e){const n=i(e),t=window.localStorage.getItem(n);if(console.log('Reading cache for "'+n+'" =>',t),!t)return null;const r=JSON.parse(t),c=new Date(r.date);if((new Date).valueOf()-c.valueOf()>864e5){console.warn('Cache for "'+n+'" is expired.');for(const e of o.RATING_CALCULATOR_SUPPORTED_VERSIONS)window.localStorage.removeItem(i(e));return null}return r.content},n.writeMagicToCache=function(e,n){const t=i(e);console.log('Updating cache for "'+t+'"');const r={date:new Date,content:n};window.localStorage.setItem(t,JSON.stringify(r))}},472:function(e,n,t){var r=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(o,c){function i(e){try{a(r.next(e))}catch(e){c(e)}}function s(e){try{a(r.throw(e))}catch(e){c(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,s)}a((r=r.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.isNicoNicoLink=n.getSongNickname=n.getSongIdx=n.normalizeSongName=n.RATING_TARGET_SONG_NAME_PREFIX=n.DX_SONG_NAME_SUFFIX=void 0;const o=t(6420);n.DX_SONG_NAME_SUFFIX=" [DX]",n.RATING_TARGET_SONG_NAME_PREFIX="▶ ",n.normalizeSongName=function(e){return"D✪N’T  ST✪P  R✪CKIN’"===e?"D✪N’T ST✪P R✪CKIN’":e.replace(/" \+ '/g,"").replace(/' \+ "/g,"")},n.getSongIdx=function(e){return e.getElementsByTagName("form")[0].elements.namedItem("idx").value},n.getSongNickname=function(e,t,r){return"Link"===e&&(e=t.includes("niconico")?"Link(nico)":"Link(org)"),1===r?e+n.DX_SONG_NAME_SUFFIX:e};let c={};n.isNicoNicoLink=function(e){return r(this,void 0,void 0,(function*(){if(c.nico===e)return!0;if(c.original===e)return!1;const n=(yield(0,o.fetchPage)("/maimai-mobile/record/musicDetail/?"+new URLSearchParams([["idx",e]]).toString())).body.querySelector(".m_10.m_t_5.t_r.f_12").innerText.includes("niconico");return console.log("Link (idx: "+e+") "+(n?"is niconico":"is original")),n?c.nico=e:c.original=e,n}))}},87:(e,n,t)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.getSongsByVersion=n.filterSongsByVersion=n.getSongProperties=n.buildSongPropsMap=void 0;const r=t(8642),o=t(472),c=/\bdx\s*:\s*([0-9]+)/,i=/\blv\s*:\s*(\[.+?\])/,s=/\bv\s*:\s*(-?[0-9]+)/,a=/\bn\s*:\s*["'](.+?)['"]\s*[,\}]/,l=/\bnn\s*:\s*["'](.+?)['"]\s*[,\}]/,u=[{name:"宿星審判",dx:1,debut:16,lv:[-4,-8,-12,14.4,0]}],f=new Map([[19,[{name:"39",dx:1,lv:[NaN,NaN,NaN,12.8]},{name:"ヒステリックナイトガール",dx:1,lv:[NaN,NaN,NaN,12.8]},{name:"MOBILYS",dx:1,lv:[NaN,NaN,NaN,13.1]},{name:"マトリョシカ",dx:0,lv:[NaN,NaN,NaN,NaN,13.2]},{name:"宿星審判",dx:1,lv:[NaN,NaN,NaN,14.3]}]]]);function d(e){const n=e.match(c),t=e.match(i),u=e.match(s),f=e.match(a),d=e.match(l);if(n&&t&&u&&f){let e=JSON.parse(t[1]);if(e.length>r.DIFFICULTIES.length){const n=e.pop();e[r.DIFFICULTIES.length-1]=n}return{dx:parseInt(n[1]),lv:e,debut:Math.abs(parseInt(u[1])),name:(0,o.normalizeSongName)(f[1]),nickname:d&&d[1]}}}function h(e,n){if(!e.has(n.name))return!1;const t=e.get(n.name),r=t.findIndex((e=>n.dx===e.dx));return!(r<0||(t[r]=function(e,n){let t=e.lv;return n.lv instanceof Array&&(t=e.lv.map(((e,t)=>isNaN(n.lv[t])?e:n.lv[t]))),Object.assign(Object.assign(Object.assign({},e),n),{lv:t})}(t[r],n),0))}function g(e,n){h(e,n)||(e.has(n.name)||e.set(n.name,[]),e.get(n.name).push(n))}n.buildSongPropsMap=function(e,n,t){const r=t.split("\n"),o=new Map;for(const e of r){const n=d(e);n&&g(o,n)}if(0===n)for(const e of u)g(o,e);const c=f.get(e);if(c)for(const e of c)h(o,e);return o},n.getSongProperties=function(e,n,t,r){let c=e.get(n);if(c&&c.length>0){if(c.length>1&&(c=c.filter((e=>e.dx===r)),c.length>1)){const e=(0,o.getSongNickname)(n,t,r);c=c.filter((n=>n.nickname===e))}if(c.length)return c.length>1&&(console.warn(`Found multiple song properties for ${n} ${r}`),console.warn(c)),c[0]}console.warn(`Could not find song properties for ${n} ${r}`)},n.filterSongsByVersion=function(e,n,t,r){const o=[];for(const c of e){const{dx:e,name:i,nickname:s}=c;let a=n.get(i);a&&a.length>0&&(a.length>1&&(a=a.filter((n=>n.dx===e)),a.length>1&&(a=a.filter((e=>e.nickname===s)))),a.length)?(a.length>1&&(console.warn(`Found multiple song properties for ${i} ${e?"[DX]":""}`),console.warn(a)),(0===r&&a[0].debut===t||1===r&&a[0].debut<t)&&o.push(a[0])):console.warn(`Could not find song properties for ${i} ${e?"[DX]":""}`)}return o},n.getSongsByVersion=function(e,n){const t=[];return e.forEach((e=>e.forEach((e=>{e.debut===n&&t.push(e)})))),t}},6420:function(e,n,t){var r=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(o,c){function i(e){try{a(r.next(e))}catch(e){c(e)}}function s(e){try{a(r.throw(e))}catch(e){c(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,s)}a((r=r.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.getPostMessageFunc=n.fetchNewSongs=n.fetchAllSongs=n.fetchGameVersion=n.fetchPage=n.handleError=n.ALLOWED_ORIGINS=void 0;const o=t(2347),c=t(6510),i=t(472);function s(e){return r(this,void 0,void 0,(function*(){const n=yield fetch(e),t=yield n.text();return(new DOMParser).parseFromString(t,"text/html")}))}function a(e){return r(this,void 0,void 0,(function*(){const n=Array.from(e.querySelectorAll(".w_450.m_15.f_0")),t=[];for(const e of n){const n=(0,i.getSongIdx)(e),r=(0,o.getSongName)(e),c=(0,o.getChartType)(e);let s;"Link"===r&&(s=(yield(0,i.isNicoNicoLink)(n))?"Link(nico)":"Link(org)"),t.push({dx:c,name:r,nickname:s})}return t}))}n.ALLOWED_ORIGINS=["https://cdpn.io","https://myjian.github.io","http://localhost:8080"],n.handleError=function(e){alert(e)},n.fetchPage=s,n.fetchGameVersion=function e(n){return r(this,void 0,void 0,(function*(){const t=n.querySelector("select[name=version] option:last-of-type");return t?parseInt(t.value):e(n=yield s("/maimai-mobile/record/musicVersion/"))}))},n.fetchAllSongs=function(e){return r(this,void 0,void 0,(function*(){if(!e){const n=c.SELF_SCORE_URLS.get(1);e=yield s(n)}return yield a(e)}))},n.fetchNewSongs=function(e){return r(this,void 0,void 0,(function*(){const n=yield s(`/maimai-mobile/record/musicVersion/search/?version=${e}&diff=0`);return yield a(n)}))},n.getPostMessageFunc=function(e,n){return(t,r)=>{const o={action:t,payload:r};e.postMessage(o,n)}}},3153:function(e,n,t){var r=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(o,c){function i(e){try{a(r.next(e))}catch(e){c(e)}}function s(e){try{a(r.throw(e))}catch(e){c(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,s)}a((r=r.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0});const o=t(8642),c=t(2347),i=t(6510),s=t(8080),a=t(9268),l=t(6685),u=t(472),f=t(87),d=t(6420);!function(e){const n={en_US:{None:"-- Choose Sort Option --",RankAsc:"Rank (low → high)",RankDes:"Rank (high → low)",ApFcAsc:"AP/FC (FC → AP+)",ApFcDes:"AP/FC (AP+ → FC)",SyncAsc:"Sync (FS → FDX+)",SyncDes:"Sync (FDX+ → FS)",VsResultAsc:"VS Result (Lose → Win)",VsResultDes:"VS Result (Win → Lose)",LvAsc:"Level (low → high)",LvDes:"Level (high → low)",InLvAsc:"Internal Level (low → high)",InLvDes:"Internal Level (high → low)",DxStarDes:"DX-Star (7 → none)",DxStarAsc:"DX-Star (none → 7)"},zh_TW:{None:"-- 選擇排序方式 --",RankAsc:"達成率 (由低至高)",RankDes:"達成率 (由高至低)",ApFcAsc:"AP/FC (由 FC 到 AP+)",ApFcDes:"AP/FC (由 AP+ 到 FC)",SyncAsc:"Sync (由 FS 到 FDX+)",SyncDes:"Sync (由 FDX+ 到 FS)",VsResultAsc:"對戰結果 (由敗北到勝利)",VsResultDes:"對戰結果 (由勝利到敗北)",LvAsc:"譜面等級 (由低至高)",LvDes:"譜面等級 (由高至低)",InLvAsc:"內部譜面等級 (由低至高)",InLvDes:"內部譜面等級 (由高至低)",DxStarDes:"DX-Star (7 星至無星)",DxStarAsc:"DX-Star (無星至 7 星)"},ko_KR:{None:"-- 정렬 순서를 선택해주세요 --",RankAsc:"정확도 오름차순 (낮음 → 높음)",RankDes:"정확도 내림차순 (높음 → 낮음)",ApFcAsc:"AP/FC (FC → AP+)",ApFcDes:"AP/FC (AP+ → FC)",SyncAsc:"Sync (FS → FDX+)",SyncDes:"Sync (FDX+ → FS)",VsResultAsc:"VS 결과 (Lose → Win)",VsResultDes:"VS 결과 (Win → Lose)",LvAsc:"난이도 (낮음 → 높음)",LvDes:"난이도 (높음 → 낮음)",InLvAsc:"난이도 상수 (낮음 → 높음)",InLvDes:"난이도 상수 (높음 → 낮음)",DxStarDes:"DX-Star (7 → none)",DxStarAsc:"DX-Star (none → 7)"}}[(0,s.getInitialLanguage)()],t=["1","2","3","4","5","6","7","7+","8","8+","9","9+","10","10+","11","11+","12","12+","13","13+","14","14+","15"],h=["SSS+","SSS","SS+","SS","S+","S","AAA","AA","A","BBB","BB","B","C","D",null],g=["AP+","AP","FC+","FC",null],S=["FDX+","FDX","FS+","FS",null],m=["WIN","DRAW","LOSE"],p=[null,"✦ - 85%","✦✦ - 90%","✦✦✦ - 93%","✦✦✦✦ - 95%","✦✦✦✦✦ - 97%","✦6 - 99%","✦7 - 100%"],_=location.pathname.includes("battleStart"),v=location.search.includes("scoreType=1"),L={};function y(e){const n=e-Math.floor(e);return n>.95?1:n>.65&&n<.69?.7:0}function A(e){const n=y(e);return n?n<1?"UNKNOWN LEVEL "+Math.floor(e)+"+":"UNKNOWN LEVEL "+e.toFixed(0):"INTERNAL LEVEL "+e.toFixed(1)}function N(e,n){const t=new Map;n&&e.reverse();for(const n of e)t.set(n,[]);return n&&e.reverse(),t}function D(n,t,r){let o=[];return n.forEach(((n,c)=>{if(n.length){const i=e.createElement("div");i.className="screw_block m_15 f_15",i.innerText=function(e,n,t,r){let o=3===e?"":"◖";switch(e){case 1:o+="LEVEL "+n;break;case 2:o+=n?"RANK "+n:"NO RANK";break;default:o+=n||" ― "}return 3!==e&&(o+="◗"),o+"　　　"+t+"/"+r}(t,c,n.length,r),o.push(i),o=o.concat(n)}})),o}function E(e){return e.getElementsByClassName("music_lv_block")[0]}function I(e,n="lv"){var t;return null===(t=E(e))||void 0===t?void 0:t.dataset[n]}function T(e,n){const t=E(e);if(!t.dataset.inlv){const e=y(n);t.dataset.inlv=n.toFixed(2);const r=(e?"*":"")+n.toFixed(1);r.length>4&&(t.classList.remove("f_14"),t.classList.add("f_13")),t.innerText=r}}function R(e,n,t){let r=0;return t&&(r=t.lv[n],"number"!=typeof r?r=0:r<0&&(r=Math.abs(r)-.02)),r||(0,a.getDefaultLevel)(I(e))-.02}function b(e,n){const t=I(e,"inlv");if(t)return parseFloat(t);const r=(0,c.getSongName)(e),i=(0,c.getChartType)(e),s=o.DIFFICULTIES.indexOf((0,c.getChartDifficulty)(e));let a;if("Link"===r){const t=_?null:(0,u.getSongIdx)(e);L.nicoLinkIdx===t?a=(0,f.getSongProperties)(n,r,"niconico",i):L.originalLinkIdx===t&&(a=(0,f.getSongProperties)(n,r,"",i)),console.log(a)}else a=(0,f.getSongProperties)(n,r,"",i);return R(e,s,a)}function x(e,n){const t=b(e,L.songProps),r=b(n,L.songProps);return t<r?-1:r<t?1:0}function P(e,n){const r=N(t,n);return e.forEach((e=>{const n=I(e);r.get(n).push(e)})),L.songProps&&r.forEach((e=>{e.sort(x),n&&e.reverse()})),D(r,1,e.length)}function F(e){const n=_?e.querySelector("tr:last-child td:last-child img:last-child"):e.children[0].querySelector("img.f_r:not(.music_kind_icon):last-of-type");if(!n)return null;const t=new URL(n.src).pathname,r=t.substring(t.lastIndexOf("_")+1,t.lastIndexOf("."));return"back"===r?null:r.replace("p","+").toUpperCase()}function M(e){const n=_?e.querySelector("tr:first-child td:last-child"):e.querySelector(".music_score_block.w_120");return n?parseFloat(n.innerText):n}function w(e,n){const t=M(e),r=M(n);return null===t&&null===r?0:null===r?-1:null===t?1:t>r?-1:t<r?1:0}function k(e,n){const t=N(h,n);return e.forEach((e=>{const n=F(e);try{t.get(n).push(e)}catch(r){console.warn(n),t.get(null).push(e)}})),v||t.forEach(((e,t)=>{e.sort(w),null!==t&&n&&e.reverse()})),D(t,2,e.length)}function C(e){const n=_?e.querySelector("tr:last-child td:last-child img:nth-child(2)"):e.children[0].querySelector("img.f_r:nth-last-of-type(2)");if(!n)return null;const t=n.src.replace(/\?ver=.*$/,""),r=t.lastIndexOf("_"),o=t.lastIndexOf("."),c=t.substring(r+1,o);return"back"===c?null:c.replace("ap","AP").replace("p","+").toUpperCase()}function O(e,n){const t=N(g,n);return e.forEach((e=>{const n=C(e);t.get(n).push(e)})),D(t,0,e.length)}function U(e){const n=_?e.querySelector("tr:last-child td:last-child img:first-child"):e.children[0].querySelector("img.f_r:nth-last-of-type(3)");if(!n)return null;const t=n.src.replace(/\?ver=.*$/,""),r=t.lastIndexOf("_"),o=t.lastIndexOf("."),c=t.substring(r+1,o);return"back"===c?null:c.replace("sd","DX").replace("p","+").toUpperCase()}function $(e,n){const t=N(S,n);return e.forEach((e=>{const n=U(e);t.get(n).push(e)})),D(t,0,e.length)}function V(e,n){const t=N(m,n);return e.forEach((e=>{const n=function(e){const n=e.querySelector("tr:first-child td:nth-child(2) img").src.replace(/\?ver=.*$/,""),t=n.lastIndexOf("_"),r=n.lastIndexOf(".");return n.substring(t+1,r).toUpperCase()}(e);t.get(n).push(e)})),D(t,0,e.length)}function W(e){if(_){const n=e.querySelector("tr:first-child td:last-child img");if(!n)return null;const t=new URL(n.src).pathname,r=t.substring(t.lastIndexOf("_")+1,t.lastIndexOf("."));try{const e=parseInt(r);return(e<0||e>=p.length)&&console.warn("invalid dx star "+r),p[e]}catch(e){console.warn("invalid dx star "+r)}return null}if(e.dataset.dxStar)return"null"===e.dataset.dxStar?null:e.dataset.dxStar;const n=function(e){const n=e.querySelectorAll(".music_score_block");if(2!==n.length)return null;const t=n[1].childNodes,r=t[t.length-1];if(!r.wholeText)return null;const o=r.wholeText.split("/");if(2!==o.length)return null;try{const e=parseInt(o[0].replace(",","").trim()),n=parseInt(o[1].replace(",","").trim()),t=e/n;if(e===n)return p[7];if(t>=.99)return p[6];if(t>=.97)return p[5];if(t>=.95)return p[4];if(t>=.93)return p[3];if(t>=.9)return p[2];if(t>=.85)return p[1]}catch(e){console.warn(e)}return null}(e);return e.dataset.dxStar=n,n}function G(e,n){const t=N(p,n);return e.forEach((e=>{const n=W(e);t.get(n).push(e)})),D(t,3,e.length)}function X(e,n){const t=new Map,r=[];for(const n of Array.from(e)){const e=b(n,L.songProps);t.set(e,!0),r.push(e)}const o=Array.from(t.keys()).sort(((e,n)=>e>n?-1:e<n?1:0));n&&o.reverse();const c=new Map;return o.forEach((e=>{c.set(A(e),[])})),Array.from(e).forEach(((e,n)=>{c.get(A(r[n])).push(e)})),D(c,0,e.length)}function q(){return e.body.querySelectorAll(".main_wrapper.t_c .w_450.m_15.f_0")}function H(t,r){const o=n[t];let c=e.getElementsByClassName("option_"+t)[0];return c||(c=e.createElement("option"),c.className="option_"+t,c.innerText=o,c.value=t),r?c.classList.add("d_n"):c.classList.remove("d_n"),c}_?function(){var n,t;r(this,void 0,void 0,(function*(){const r=yield(0,d.fetchPage)(i.SELF_SCORE_URLS.get(4)),o=null===(n=r.querySelector(".music_scorelist_table"))||void 0===n?void 0:n.parentElement;if(!o)return void console.warn("could not find summary table");v||null===(t=o.querySelector("tr:last-child"))||void 0===t||t.remove();const c=q(),s=c.length;setTimeout((function(){const e={};for(const n of h)e[n]=0;c.forEach((n=>{e[F(n)]++}));for(let n=1;n<9;n++)e[h[n]]+=e[h[n-1]];const n=o.querySelectorAll("tr:first-child .f_10");n[0].innerHTML=`${e.A}/${s}`,n[1].innerHTML=`${e.S}/${s}`,n[2].innerHTML=`${e["S+"]}/${s}`,n[3].innerHTML=`${e.SS}/${s}`,n[4].innerHTML=`${e["SS+"]}/${s}`,n[5].innerHTML=`${e.SSS}/${s}`,n[6].innerHTML=`${e["SSS+"]}/${s}`}),0),setTimeout((function(){const e={};for(const n of g)e[n]=0;c.forEach((n=>{e[C(n)]++}));for(let n=1;n<4;n++)e[g[n]]+=e[g[n-1]];const n=o.querySelectorAll("tr:nth-child(2) .f_10");n[0].innerHTML=`${e.FC}/${s}`,n[1].innerHTML=`${e["FC+"]}/${s}`,n[2].innerHTML=`${e.AP}/${s}`,n[3].innerHTML=`${e["AP+"]}/${s}`}),0),setTimeout((function(){const e={};for(const n of S)e[n]=0;c.forEach((n=>{e[U(n)]++}));for(let n=1;n<4;n++)e[S[n]]+=e[S[n-1]];const n=o.querySelectorAll("tr:nth-child(2) .f_10");n[4].innerHTML=`${e.FS}/${s}`,n[5].innerHTML=`${e["FS+"]}/${s}`,n[6].innerHTML=`${e.FDX}/${s}`,n[7].innerHTML=`${e["FDX+"]}/${s}`}),0),v&&setTimeout((function(){const e={};for(const n of p)e[n]=0;c.forEach((n=>{e[W(n)]++}));for(let n=p.length-2;n>=1;n--)e[p[n]]+=e[p[n+1]];const n=o.querySelectorAll("tr:last-child .f_10");n[0].innerHTML=`${e[p[1]]}/${s}`,n[1].innerHTML=`${e[p[2]]}/${s}`,n[2].innerHTML=`${e[p[3]]}/${s}`,n[3].innerHTML=`${e[p[4]]}/${s}`,n[4].innerHTML=`${e[p[5]]}/${s}`}),0),e.querySelector(".town_block + .see_through_block").insertAdjacentElement("afterend",o)}))}():e.querySelectorAll("div.w_450.m_15.p_r.f_0[id]").forEach((e=>{var n,t;e.style.removeProperty("display"),e.style.removeProperty("margin-top"),e.id.includes("sta_")?null===(n=e.querySelector(".music_kind_icon_dx"))||void 0===n||n.remove():null===(t=e.querySelector(".music_kind_icon_standard"))||void 0===t||t.remove();const r=e.querySelector("img:nth-child(2)");r.onclick=null,r.className="music_kind_icon"})),Array.from(e.getElementsByClassName("music_lv_block")).forEach((e=>{e.dataset.lv||(e.dataset.lv=e.innerText)}));const j=e.body.querySelector(".main_wrapper.t_c .screw_block");j&&(j.insertAdjacentElement("beforebegin",function(){const n="scoreSortContainer";let t=e.getElementById(n);if(t)return t;t=e.createElement("div"),t.id=n,t.className="w_450 m_15";const r=e.createElement("select");return r.className="w_300 m_10",r.addEventListener("change",(n=>{!function(n){const t=q(),r=Array.from(e.body.querySelectorAll(".main_wrapper.t_c .screw_block"));let o=null;switch(n){case"RankDes":o=k(t,!1);break;case"RankAsc":o=k(t,!0);break;case"ApFcDes":o=O(t,!1);break;case"ApFcAsc":o=O(t,!0);break;case"SyncDes":o=$(t,!1);break;case"SyncAsc":o=$(t,!0);break;case"VsResultAsc":o=V(t,!0);break;case"VsResultDes":o=V(t,!1);break;case"LvDes":o=P(t,!0);break;case"LvAsc":o=P(t,!1);break;case"InLvDes":o=X(t,!1);break;case"InLvAsc":o=X(t,!0);break;case"DxStarAsc":o=G(t,!1);break;case"DxStarDes":o=G(t,!0);break;default:return}for(let e=1;e<r.length;e++)r[e].remove();const c=r[0];for(let e=o.length-1;e>=1;e--)c.insertAdjacentElement("afterend",o[e]);c.innerText=o[0].innerText}(n.target.value)})),r.append(H("None")),r.append(H("RankAsc")),r.append(H("RankDes")),r.append(H("ApFcAsc")),r.append(H("ApFcDes")),r.append(H("SyncAsc")),r.append(H("SyncDes")),_?(v&&(r.append(H("DxStarDes")),r.append(H("DxStarAsc"))),r.append(H("VsResultAsc")),r.append(H("VsResultDes"))):(r.append(H("DxStarDes")),r.append(H("DxStarAsc"))),r.append(H("LvAsc")),r.append(H("LvDes")),r.append(H("InLvAsc",!0)),r.append(H("InLvDes",!0)),t.append(r),t}()),function(){r(this,void 0,void 0,(function*(){const n=yield(0,d.fetchGameVersion)(e.body),t="maimaidx.jp"===window.location.host?1:0,r=(0,f.buildSongPropsMap)(n,t,yield(0,l.fetchMagic)(n)),i=Array.from(q());for(const e of i){const n=(0,c.getSongName)(e);if("Link"===n){const t=o.DIFFICULTIES.indexOf((0,c.getChartDifficulty)(e));try{const o=(0,u.getSongIdx)(e);let c;(yield(0,u.isNicoNicoLink)(o))?(L.nicoLinkIdx=o,c=(0,f.getSongProperties)(r,n,"niconico",0)):(L.originalLinkIdx=o,c=(0,f.getSongProperties)(r,n,"",0)),T(e,R(e,t,c))}catch(n){T(e,R(e,t))}}else T(e,b(e,r))}console.log("enabling internal level sort"),H("InLvAsc",!1),H("InLvDes",!1),L.songProps=r}))}())}(document)}},n={};!function t(r){var o=n[r];if(void 0!==o)return o.exports;var c=n[r]={exports:{}};return e[r].call(c.exports,c,c.exports,t),c.exports}(3153)})();