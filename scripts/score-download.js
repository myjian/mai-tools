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
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/score-download.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/common/fetch-score-util.ts":
/*!***************************************!*\
  !*** ./js/common/fetch-score-util.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.fetchPlayerGrade = exports.getPlayerName = exports.getChartType = exports.getChartDifficulty = exports.getChartLevel = exports.getSongName = void 0;\r\nfunction getSongName(row) {\r\n    return row.getElementsByClassName(\"music_name_block\")[0].innerText;\r\n}\r\nexports.getSongName = getSongName;\r\nfunction getChartLevel(row) {\r\n    return row.getElementsByClassName(\"music_lv_block\")[0].innerText;\r\n}\r\nexports.getChartLevel = getChartLevel;\r\nfunction getChartDifficulty(row) {\r\n    if (!row.classList.contains(\"pointer\")) {\r\n        row = row.querySelector(\".pointer\");\r\n    }\r\n    const d = row.className.match(/music_([a-z]+)_score_back/)[1].toUpperCase();\r\n    return d.indexOf(\"RE\") === 0 ? \"Re:MASTER\" : d;\r\n}\r\nexports.getChartDifficulty = getChartDifficulty;\r\nfunction getChartType(row) {\r\n    if (row.id) {\r\n        return row.id.includes(\"sta_\") ? 0 /* STANDARD */ : 1 /* DX */;\r\n    }\r\n    return row.querySelector(\"img:nth-child(2)\").src.includes(\"_standard\")\r\n        ? 0 /* STANDARD */\r\n        : 1 /* DX */;\r\n}\r\nexports.getChartType = getChartType;\r\nfunction getPlayerName(n) {\r\n    var _a;\r\n    return (_a = n.querySelector(\".name_block\")) === null || _a === void 0 ? void 0 : _a.innerText;\r\n}\r\nexports.getPlayerName = getPlayerName;\r\nfunction fetchPlayerGrade(n) {\r\n    const gradeImg = n.querySelector(\".user_data_block_line ~ img.h_25\");\r\n    if (gradeImg) {\r\n        const gradeIdx = gradeImg.src.lastIndexOf(\"grade_\");\r\n        return gradeImg.src.substring(gradeIdx + 6, gradeIdx + 8);\r\n    }\r\n    return null;\r\n}\r\nexports.fetchPlayerGrade = fetchPlayerGrade;\r\n\n\n//# sourceURL=webpack:///./js/common/fetch-score-util.ts?");

/***/ }),

/***/ "./js/common/fetch-self-score.ts":
/*!***************************************!*\
  !*** ./js/common/fetch-self-score.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.fetchScores = exports.SELF_SCORE_URLS = void 0;\r\nconst fetch_score_util_1 = __webpack_require__(/*! ./fetch-score-util */ \"./js/common/fetch-score-util.ts\");\r\nconst util_1 = __webpack_require__(/*! ./util */ \"./js/common/util.ts\");\r\nexports.SELF_SCORE_URLS = new Map([\r\n    [\"Re:MASTER\", \"/maimai-mobile/record/musicGenre/search/?genre=99&diff=4\"],\r\n    [\"MASTER\", \"/maimai-mobile/record/musicGenre/search/?genre=99&diff=3\"],\r\n    [\"EXPERT\", \"/maimai-mobile/record/musicGenre/search/?genre=99&diff=2\"],\r\n    [\"ADVANCED\", \"/maimai-mobile/record/musicGenre/search/?genre=99&diff=1\"],\r\n]);\r\nfunction getAchievement(row) {\r\n    const ach = row.querySelector(\".music_score_block.w_120\");\r\n    return ach && ach.innerText;\r\n}\r\nfunction processRow(row, difficulty, state) {\r\n    const isGenreRow = row.classList.contains(\"screw_block\");\r\n    const isScoreRow = row.classList.contains(\"w_450\") &&\r\n        row.classList.contains(\"m_15\") &&\r\n        row.classList.contains(\"p_r\") &&\r\n        row.classList.contains(\"f_0\");\r\n    if (isGenreRow) {\r\n        state.genre = row.innerText;\r\n    }\r\n    else if (isScoreRow) {\r\n        const songName = fetch_score_util_1.getSongName(row);\r\n        const level = fetch_score_util_1.getChartLevel(row);\r\n        const chartType = fetch_score_util_1.getChartType(row) === 1 /* DX */ ? \"DX\" : \"STANDARD\";\r\n        const achievement = getAchievement(row);\r\n        if (!achievement) {\r\n            return;\r\n        }\r\n        state.scoreList.push([songName, state.genre, difficulty, level, chartType, achievement].join(\"\\t\"));\r\n    }\r\n}\r\nfunction fetchScores(difficulty, scoreList) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        const url = exports.SELF_SCORE_URLS.get(difficulty);\r\n        if (!url) {\r\n            return;\r\n        }\r\n        return new Promise((resolve) => {\r\n            setTimeout(() => __awaiter(this, void 0, void 0, function* () {\r\n                const dom = yield util_1.fetchPage(url);\r\n                const rows = dom.querySelectorAll(\".main_wrapper.t_c .m_15\");\r\n                const state = { genre: \"\", scoreList: scoreList };\r\n                rows.forEach((row) => processRow(row, difficulty, state));\r\n                resolve(dom);\r\n            }), 0);\r\n        });\r\n    });\r\n}\r\nexports.fetchScores = fetchScores;\r\n\n\n//# sourceURL=webpack:///./js/common/fetch-self-score.ts?");

/***/ }),

/***/ "./js/common/lang.ts":
/*!***************************!*\
  !*** ./js/common/lang.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.LANG = void 0;\r\nconst queryParams = new URLSearchParams(document.location.search);\r\nlet lang = \"en\";\r\nif (queryParams.get(\"hl\")) {\r\n    lang = queryParams.get(\"hl\").startsWith(\"zh\") ? \"zh\" : \"en\";\r\n}\r\nelse if (navigator.language.startsWith(\"zh\")) {\r\n    lang = \"zh\";\r\n}\r\nexports.LANG = lang;\r\n\n\n//# sourceURL=webpack:///./js/common/lang.ts?");

/***/ }),

/***/ "./js/common/score-fetch-progress.ts":
/*!*******************************************!*\
  !*** ./js/common/score-fetch-progress.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.statusText = void 0;\r\nconst lang_1 = __webpack_require__(/*! ./lang */ \"./js/common/lang.ts\");\r\nconst UIString = {\r\n    zh: {\r\n        advStart: \"🕓 下載黃譜成績中…\",\r\n        advDone: \"✔ 黃譜成績下載完畢！\",\r\n        expStart: \"🕓 下載紅譜成績中…\",\r\n        expDone: \"✔ 紅譜成績下載完畢！\",\r\n        masStart: \"🕓 下載紫譜成績中…\",\r\n        masDone: \"✔ 紫譜成績下載完畢！\",\r\n        remStart: \"🕓 下載白譜成績中…\",\r\n        remDone: \"✔ 白譜成績下載完畢！\",\r\n    },\r\n    en: {\r\n        advStart: \"🕓 Downloading Advanced scores…\",\r\n        advDone: \"✔ Advanced scores downloaded!\",\r\n        expStart: \"🕓 Downloading Expert scores…\",\r\n        expDone: \"✔ Expert scores downloaded!\",\r\n        masStart: \"🕓 Downloading Master scores…\",\r\n        masDone: \"✔ Master scores downloaded!\",\r\n        remStart: \"🕓 Downloading Re:Master scores…\",\r\n        remDone: \"✔ Re:Master scores downloaded!\",\r\n    },\r\n}[lang_1.LANG];\r\nfunction statusText(what, end) {\r\n    switch (what) {\r\n        case \"Re:MASTER\":\r\n            return end ? UIString.remDone : UIString.remStart;\r\n        case \"MASTER\":\r\n            return end ? UIString.masDone : UIString.masStart;\r\n        case \"EXPERT\":\r\n            return end ? UIString.expDone : UIString.expStart;\r\n        case \"ADVANCED\":\r\n            return end ? UIString.advDone : UIString.advStart;\r\n    }\r\n    return \"\";\r\n}\r\nexports.statusText = statusText;\r\n\n\n//# sourceURL=webpack:///./js/common/score-fetch-progress.ts?");

/***/ }),

/***/ "./js/common/song-util.ts":
/*!********************************!*\
  !*** ./js/common/song-util.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.isNicoNicoLink = exports.getSongNickname = exports.getSongIdx = void 0;\r\nconst util_1 = __webpack_require__(/*! ./util */ \"./js/common/util.ts\");\r\nfunction getSongIdx(row) {\r\n    return row.getElementsByTagName(\"form\")[0].elements.namedItem(\"idx\").value;\r\n}\r\nexports.getSongIdx = getSongIdx;\r\nfunction getSongNickname(name, genre, isDxChart) {\r\n    if (name === \"Link\") {\r\n        name = genre.includes(\"niconico\") ? \"Link(nico)\" : \"Link(org)\";\r\n    }\r\n    return isDxChart ? name + \" [DX]\" : name;\r\n}\r\nexports.getSongNickname = getSongNickname;\r\nlet cachedLinkIdx = {};\r\nfunction isNicoNicoLink(idx) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        if (cachedLinkIdx.nico === idx) {\r\n            return true;\r\n        }\r\n        if (cachedLinkIdx.original === idx) {\r\n            return false;\r\n        }\r\n        const dom = yield util_1.fetchPage(\"/maimai-mobile/record/musicDetail/?\" + new URLSearchParams([[\"idx\", idx]]).toString());\r\n        const isNico = dom.body.querySelector(\".m_10.m_t_5.t_r.f_12\").innerText.includes(\"niconico\");\r\n        console.log(\"Link (idx: \" + idx + \") \" + (isNico ? \"is niconico\" : \"is original\"));\r\n        if (isNico) {\r\n            cachedLinkIdx.nico = idx;\r\n        }\r\n        else {\r\n            cachedLinkIdx.original = idx;\r\n        }\r\n        return isNico;\r\n    });\r\n}\r\nexports.isNicoNicoLink = isNicoNicoLink;\r\n\n\n//# sourceURL=webpack:///./js/common/song-util.ts?");

/***/ }),

/***/ "./js/common/util.ts":
/*!***************************!*\
  !*** ./js/common/util.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.getPostMessageFunc = exports.fetchNewSongs = exports.fetchAllSongs = exports.fetchGameVersion = exports.fetchPage = exports.handleError = exports.ALLOWED_ORIGINS = void 0;\r\nconst fetch_score_util_1 = __webpack_require__(/*! ./fetch-score-util */ \"./js/common/fetch-score-util.ts\");\r\nconst fetch_self_score_1 = __webpack_require__(/*! ./fetch-self-score */ \"./js/common/fetch-self-score.ts\");\r\nconst song_util_1 = __webpack_require__(/*! ./song-util */ \"./js/common/song-util.ts\");\r\nexports.ALLOWED_ORIGINS = [\r\n    \"https://cdpn.io\",\r\n    \"https://myjian.github.io\",\r\n    \"http://localhost:8080\",\r\n];\r\nfunction handleError(msg) {\r\n    alert(msg);\r\n}\r\nexports.handleError = handleError;\r\nfunction fetchPage(url) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        const response = yield fetch(url);\r\n        const html = yield response.text();\r\n        const parser = new DOMParser();\r\n        return parser.parseFromString(html, \"text/html\");\r\n    });\r\n}\r\nexports.fetchPage = fetchPage;\r\n/** Returns \"13\" if version is DX, \"14\" if version is DX Plus. */\r\nfunction fetchGameVersion(dom) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        const gameVer = dom.querySelector(\"select[name=version] option:last-of-type\");\r\n        if (gameVer) {\r\n            return gameVer.value;\r\n        }\r\n        dom = yield fetchPage(\"/maimai-mobile/record/musicVersion/\");\r\n        return fetchGameVersion(dom);\r\n    });\r\n}\r\nexports.fetchGameVersion = fetchGameVersion;\r\nfunction parseSongList(dom) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        // This is simplified from scripts/build-song-db.ts\r\n        const rows = Array.from(dom.querySelectorAll(\".w_450.m_15.f_0\"));\r\n        const songs = [];\r\n        for (const d of rows) {\r\n            const idx = song_util_1.getSongIdx(d);\r\n            const name = fetch_score_util_1.getSongName(d);\r\n            const isDx = fetch_score_util_1.getChartType(d);\r\n            let nickname;\r\n            if (name === \"Link\") {\r\n                nickname = (yield song_util_1.isNicoNicoLink(idx)) ? \"Link(nico)\" : \"Link(orig)\";\r\n            }\r\n            songs.push({ dx: isDx, name, nickname });\r\n        }\r\n        return songs;\r\n    });\r\n}\r\nfunction fetchAllSongs(dom) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        if (!dom) {\r\n            const url = fetch_self_score_1.SELF_SCORE_URLS.get(\"MASTER\");\r\n            dom = yield fetchPage(url);\r\n        }\r\n        return yield parseSongList(dom);\r\n    });\r\n}\r\nexports.fetchAllSongs = fetchAllSongs;\r\nfunction fetchNewSongs(ver) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        // diff=0 means BASIC\r\n        const dom = yield fetchPage(`/maimai-mobile/record/musicVersion/search/?version=${ver}&diff=0`);\r\n        return yield parseSongList(dom);\r\n    });\r\n}\r\nexports.fetchNewSongs = fetchNewSongs;\r\nfunction getPostMessageFunc(w, origin) {\r\n    return (action, payload) => {\r\n        const obj = { action, payload };\r\n        console.log(action, payload);\r\n        w.postMessage(obj, origin);\r\n    };\r\n}\r\nexports.getPostMessageFunc = getPostMessageFunc;\r\n\n\n//# sourceURL=webpack:///./js/common/util.ts?");

/***/ }),

/***/ "./scripts/score-download.ts":
/*!***********************************!*\
  !*** ./scripts/score-download.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst fetch_self_score_1 = __webpack_require__(/*! ../js/common/fetch-self-score */ \"./js/common/fetch-self-score.ts\");\r\nconst lang_1 = __webpack_require__(/*! ../js/common/lang */ \"./js/common/lang.ts\");\r\nconst score_fetch_progress_1 = __webpack_require__(/*! ../js/common/score-fetch-progress */ \"./js/common/score-fetch-progress.ts\");\r\nconst util_1 = __webpack_require__(/*! ../js/common/util */ \"./js/common/util.ts\");\r\n(function () {\r\n    const UIString = {\r\n        zh: {\r\n            pleaseLogIn: \"請登入 maimai NET\",\r\n            copy: \"複製成績\",\r\n            copied: \"已複製到剪貼簿\",\r\n            allDone: \"✅ 全部成績下載完畢，請按網頁上的「複製成績」把資料複製到剪貼簿。\",\r\n        },\r\n        en: {\r\n            pleaseLogIn: \"Please log in to maimai DX NET.\",\r\n            copy: \"Copy\",\r\n            copied: \"Copied to clipboard\",\r\n            allDone: '✅ All scores are downloaded. Click the \"Copy\" buton on the page to copy scores.',\r\n        },\r\n    }[lang_1.LANG];\r\n    function createOutputArea(container) {\r\n        const dv = document.createElement(\"div\");\r\n        dv.id = \"outputArea\";\r\n        dv.style.position = \"relative\";\r\n        dv.style.marginBottom = \"16px\";\r\n        const tx = document.createElement(\"textarea\");\r\n        tx.id = \"outputText\";\r\n        dv.append(tx);\r\n        const btn = document.createElement(\"button\");\r\n        btn.innerText = UIString.copy;\r\n        btn.style.backgroundColor = \"#9f51dc\";\r\n        btn.style.border = \"2px solid black\";\r\n        btn.style.borderRadius = \"5px\";\r\n        btn.style.color = \"white\";\r\n        btn.style.fontWeight = \"700\";\r\n        btn.style.padding = \"8px 12px\";\r\n        dv.append(btn);\r\n        const res = document.createElement(\"span\");\r\n        res.className = \"f_16\";\r\n        res.style.position = \"absolute\";\r\n        res.style.left = \"300px\";\r\n        res.style.bottom = \"10px\";\r\n        res.style.fontWeight = \"700\";\r\n        res.style.color = \"#fff000\";\r\n        dv.append(res);\r\n        btn.addEventListener(\"click\", () => {\r\n            tx.select();\r\n            document.execCommand(\"copy\");\r\n            res.innerText = UIString.copied;\r\n            setTimeout(() => {\r\n                res.innerText = \"\";\r\n            }, 5000);\r\n        });\r\n        container.append(dv);\r\n        return tx;\r\n    }\r\n    function fetchAllScores(onError, onLog) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const host = document.location.host;\r\n            if (host !== \"maimaidx-eng.com\" && host !== \"maimaidx.jp\") {\r\n                onError(UIString.pleaseLogIn);\r\n                return;\r\n            }\r\n            const scoreList = [];\r\n            for (const difficulty of fetch_self_score_1.SELF_SCORE_URLS.keys()) {\r\n                onLog(score_fetch_progress_1.statusText(difficulty, false));\r\n                yield fetch_self_score_1.fetchScores(difficulty, scoreList);\r\n                onLog(score_fetch_progress_1.statusText(difficulty, true));\r\n            }\r\n            let textarea = document.getElementById(\"outputText\");\r\n            if (!textarea) {\r\n                textarea = createOutputArea(document.querySelector(\".main_wrapper header\"));\r\n            }\r\n            textarea.value = scoreList.join(\"\\n\");\r\n            onLog(UIString.allDone);\r\n        });\r\n    }\r\n    function handleOutput(msg) {\r\n        const comment = document.querySelector(\".comment_block\");\r\n        if (comment) {\r\n            comment.innerText = comment.innerText + msg + \"\\n\";\r\n        }\r\n        else {\r\n            console.log(msg);\r\n        }\r\n    }\r\n    fetchAllScores(util_1.handleError, handleOutput);\r\n})();\r\n\n\n//# sourceURL=webpack:///./scripts/score-download.ts?");

/***/ })

/******/ });