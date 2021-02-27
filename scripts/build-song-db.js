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
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/build-song-db.ts");
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

/***/ "./scripts/build-song-db.ts":
/*!**********************************!*\
  !*** ./scripts/build-song-db.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst fetch_score_util_1 = __webpack_require__(/*! ../js/common/fetch-score-util */ \"./js/common/fetch-score-util.ts\");\r\nconst song_util_1 = __webpack_require__(/*! ../js/common/song-util */ \"./js/common/song-util.ts\");\r\nfunction buildSongDb() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        const rows = Array.from(document.querySelectorAll(\".w_450.m_15.f_0\"));\r\n        const songs = [];\r\n        for (const d of rows) {\r\n            const idx = song_util_1.getSongIdx(d);\r\n            let n = fetch_score_util_1.getSongName(d);\r\n            const di = fetch_score_util_1.getChartDifficulty(d);\r\n            let lv = fetch_score_util_1.getChartLevel(d);\r\n            const c = fetch_score_util_1.getChartType(d);\r\n            if (n === \"Link\") {\r\n                n = (yield song_util_1.isNicoNicoLink(idx)) ? \"Link(nico)\" : \"Link(orig)\";\r\n            }\r\n            else if (n === \"+♂\" || n === \"39\") {\r\n                n = \"'\" + n;\r\n            }\r\n            if (c === 1 /* DX */) {\r\n                n += \" [dx]\";\r\n            }\r\n            if (!lv.includes(\"+\")) {\r\n                lv = \"'\" + lv;\r\n            }\r\n            songs.push([n, di, lv].join(\"\\t\"));\r\n        }\r\n        return songs;\r\n    });\r\n}\r\nfunction main() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        console.log(yield buildSongDb());\r\n    });\r\n}\r\nmain();\r\n\n\n//# sourceURL=webpack:///./scripts/build-song-db.ts?");

/***/ })

/******/ });