/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/score-converter.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./scripts/score-converter.ts":
/*!************************************!*\
  !*** ./scripts/score-converter.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n(function (d) {\r\n    const BASE_NEWTAB_URL = \"https://myjian.github.io/mai-tools/classic-layout/\";\r\n    const FINALE_RANK_IMG = new Map([\r\n        [\"S\", \"/maimai-mobile/maimai-img/icon_s.png\"],\r\n        [\"S+\", \"/maimai-mobile/maimai-img/icon_s_plus.png\"],\r\n        [\"SS\", \"/maimai-mobile/maimai-img/icon_ss.png\"],\r\n        [\"SS+\", \"/maimai-mobile/maimai-img/icon_ss_plus.png\"],\r\n        [\"SSS\", \"/maimai-mobile/maimai-img/icon_sss.png\"],\r\n        [\"SSS+\", \"/maimai-mobile/maimai-img/icon_sss_plus.png\"],\r\n    ]);\r\n    const DX_RANK_IMG = new Map([\r\n        [\"AAA\", \"/maimai-mobile/img/music_icon_aaa.png\"],\r\n        [\"AA\", \"/maimai-mobile/img/music_icon_aa.png\"],\r\n        [\"A\", \"/maimai-mobile/img/music_icon_a.png\"],\r\n    ]);\r\n    const FINALE_APFC_IMG = new Map([\r\n        [\"fc\", \"/maimai-mobile/maimai-img/icon_fc_silver.png\"],\r\n        [\"fcplus\", \"/maimai-mobile/maimai-img/icon_fc_gold.png\"],\r\n        [\"ap\", \"/maimai-mobile/maimai-img/icon_ap.png\"],\r\n    ]);\r\n    const DX_APFC_IMG = new Map([[\"applus\", \"/maimai-mobile/img/music_icon_app.png\"]]);\r\n    const FINALE_SYNC_IMG = new Map([\r\n        [\"FS\", \"/maimai-mobile/maimai-img/icon_maxfever_silver.png\"],\r\n        [\"FS+\", \"/maimai-mobile/maimai-img/icon_maxfever_gold.png\"],\r\n    ]);\r\n    const DX_SYNC_IMG = new Map([\r\n        [\"FDX\", \"/maimai-mobile/img/music_icon_fsd.png\"],\r\n        [\"FDX+\", \"/maimai-mobile/img/music_icon_fsdp.png\"],\r\n    ]);\r\n    function trimSpaces(textLine) {\r\n        return textLine.trim().replace(/\\s+/g, \"-\");\r\n    }\r\n    function padNumberWithZeros(n, len) {\r\n        len = len || 2;\r\n        return n.toString().padStart(len, \"0\");\r\n    }\r\n    function formatDate(dt) {\r\n        return (dt.getFullYear() +\r\n            \"-\" +\r\n            padNumberWithZeros(dt.getMonth() + 1) +\r\n            \"-\" +\r\n            padNumberWithZeros(dt.getDate()) +\r\n            \" \" +\r\n            padNumberWithZeros(dt.getHours()) +\r\n            \":\" +\r\n            padNumberWithZeros(dt.getMinutes()));\r\n    }\r\n    function fetchAndCacheImg(map, title) {\r\n        let img = map.get(title);\r\n        if (img instanceof Blob) {\r\n            return Promise.resolve(img);\r\n        }\r\n        else if (img) {\r\n            return fetch(img)\r\n                .then((res) => res.blob())\r\n                .then((b) => {\r\n                map.set(title, b);\r\n                return b;\r\n            });\r\n        }\r\n    }\r\n    function getSongName(e) {\r\n        return e.querySelector(\".basic_block.break\").childNodes[1].nodeValue;\r\n    }\r\n    function getAchv(e) {\r\n        const achv = e.querySelector(\".playlog_achievement_txt\").innerText;\r\n        return achv.substring(0, achv.length - 1); // remove \"%\"\r\n    }\r\n    function getNoteDetails(e) {\r\n        return e.querySelector(\".playlog_notes_detail\").innerText\r\n            .split(\"\\n\")\r\n            .slice(-5)\r\n            .map(trimSpaces)\r\n            .join(\"_\");\r\n    }\r\n    function getDifficulty(e) {\r\n        const src = e.querySelector(\".playlog_top_container img.playlog_diff\")\r\n            .src;\r\n        const d = src.substring(src.lastIndexOf(\"_\") + 1, src.lastIndexOf(\".\"));\r\n        return d === \"remaster\" ? \"Re:MASTER\" : d.toUpperCase();\r\n    }\r\n    function getTrack(e) {\r\n        return e.querySelector(\".playlog_top_container .sub_title .f_b\").innerText.replace(\"0\", \"\");\r\n    }\r\n    function getPlayDate(e) {\r\n        const jpDtText = e.querySelector(\".playlog_top_container .sub_title span:last-child\").innerText;\r\n        const m = jpDtText.match(/(\\d+)\\/(\\d+)\\/(\\d+) (\\d+):(\\d+)/);\r\n        const jpDt = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]));\r\n        return formatDate(new Date(jpDt.valueOf() - 1000 * 60 * 60));\r\n    }\r\n    function getIsHighScore(e) {\r\n        return e.querySelector(\".playlog_achievement_newrecord\") ? 1 : 0;\r\n    }\r\n    function getCombo(e) {\r\n        return e.querySelector(\".col2 .playlog_score_block .white\").innerText;\r\n        //return e.querySelector(\".col2 .playlog_score_block .white\").innerText.replace(\"/\", \" / \");\r\n    }\r\n    function getSongImage(e) {\r\n        const img = e.querySelector(\"img.music_img\");\r\n        const canvas = d.createElement(\"canvas\");\r\n        canvas.width = img.width;\r\n        canvas.height = img.height;\r\n        const context = canvas.getContext(\"2d\");\r\n        context.drawImage(img, 0, 0, canvas.width, canvas.height);\r\n        return canvas.toDataURL();\r\n    }\r\n    function getRankTitle(e) {\r\n        const src = e.querySelector(\".playlog_scorerank\").src;\r\n        const title = src.substring(src.lastIndexOf(\"/\") + 1, src.lastIndexOf(\".\"));\r\n        return title.toUpperCase().replace(\"PLUS\", \"+\");\r\n    }\r\n    function getRankImage(title) {\r\n        return (fetchAndCacheImg(FINALE_RANK_IMG, title) ||\r\n            fetchAndCacheImg(DX_RANK_IMG, title) ||\r\n            Promise.reject('invalid title \"' + title + '\"'));\r\n    }\r\n    function getApFcImage(e) {\r\n        const src = e.querySelector(\".playlog_result_innerblock > img:nth-child(2)\").src;\r\n        const title = src.substring(src.lastIndexOf(\"/\") + 1, src.lastIndexOf(\".\"));\r\n        if (title === \"fc_dummy\") {\r\n            return Promise.resolve(null);\r\n        }\r\n        return (fetchAndCacheImg(FINALE_APFC_IMG, title) ||\r\n            fetchAndCacheImg(DX_APFC_IMG, title) ||\r\n            Promise.reject('invalid title \"' + title + '\"'));\r\n    }\r\n    function getSyncResult(e) {\r\n        const src = e.querySelector(\".playlog_result_innerblock > img:nth-child(3)\").src;\r\n        const title = src.substring(src.lastIndexOf(\"/\") + 1, src.lastIndexOf(\".\"));\r\n        switch (title) {\r\n            case \"fs\":\r\n                return \"FS\";\r\n            case \"fsplus\":\r\n                return \"FS+\";\r\n            case \"fsd\":\r\n                return \"FDX\";\r\n            case \"fsdplus\":\r\n                return \"FDX+\";\r\n        }\r\n        return null;\r\n    }\r\n    function getSyncImage(syncResult) {\r\n        if (syncResult) {\r\n            return (fetchAndCacheImg(FINALE_SYNC_IMG, syncResult) ||\r\n                fetchAndCacheImg(DX_SYNC_IMG, syncResult) ||\r\n                Promise.reject('invalid title \"' + syncResult + '\"'));\r\n        }\r\n        return Promise.resolve(null);\r\n    }\r\n    if ((d.location.host === \"maimaidx-eng.com\" || d.location.host === \"maimaidx.jp\") &&\r\n        d.location.pathname.includes(\"/maimai-mobile/record/playlogDetail/\")) {\r\n        let url = BASE_NEWTAB_URL +\r\n            \"?st=\" +\r\n            encodeURIComponent(getSongName(d.body)) +\r\n            \"&ac=\" +\r\n            encodeURIComponent(getAchv(d.body)) +\r\n            \"&nd=\" +\r\n            encodeURIComponent(getNoteDetails(d.body)) +\r\n            \"&df=\" +\r\n            encodeURIComponent(getDifficulty(d.body)) +\r\n            \"&tk=\" +\r\n            encodeURIComponent(getTrack(d.body)) +\r\n            \"&dt=\" +\r\n            encodeURIComponent(getPlayDate(d.body)) +\r\n            \"&hs=\" +\r\n            encodeURIComponent(getIsHighScore(d.body)) +\r\n            \"&cb=\" +\r\n            encodeURIComponent(getCombo(d.body));\r\n        const syncStatus = getSyncResult(d.body);\r\n        if (syncStatus) {\r\n            url += \"&sc=\" + encodeURIComponent(syncStatus);\r\n        }\r\n        console.log(url);\r\n        console.log(\"url length: \" + url.length);\r\n        window.open(url, \"_blank\");\r\n        window.addEventListener(\"message\", (evt) => {\r\n            if (evt.origin === \"https://myjian.github.io\" || evt.origin === \"https://cdpn.io\") {\r\n                const data = evt.data;\r\n                const source = evt.source;\r\n                let rankTitle = \"\";\r\n                switch (data.action) {\r\n                    case \"ready\":\r\n                        source.postMessage({ action: \"songImage\", imgSrc: getSongImage(d.body) }, evt.origin);\r\n                        getApFcImage(d.body).then((img) => {\r\n                            if (img) {\r\n                                source.postMessage({ action: \"apFcImage\", img }, evt.origin);\r\n                            }\r\n                        });\r\n                        getSyncImage(getSyncResult(d.body)).then((img) => {\r\n                            if (img) {\r\n                                source.postMessage({ action: \"syncImage\", img }, evt.origin);\r\n                            }\r\n                        });\r\n                        rankTitle = getRankTitle(d.body);\r\n                        getRankImage(rankTitle).then((img) => {\r\n                            source.postMessage({ action: \"rankImage\", title: rankTitle, img }, evt.origin);\r\n                        });\r\n                        break;\r\n                    case \"getRankImage\":\r\n                        rankTitle = data.payload;\r\n                        getRankImage(rankTitle).then((img) => {\r\n                            source.postMessage({ action: \"rankImage\", title: rankTitle, img }, evt.origin);\r\n                        });\r\n                        break;\r\n                }\r\n            }\r\n        });\r\n    }\r\n})(document);\r\n\n\n//# sourceURL=webpack:///./scripts/score-converter.ts?");

/***/ })

/******/ });