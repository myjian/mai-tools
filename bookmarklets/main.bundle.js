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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/bookmarklets/main.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/bookmarklets/BookmarkItem.tsx":
/*!******************************************!*\
  !*** ./js/bookmarklets/BookmarkItem.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.BookmarkItem = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nexports.BookmarkItem = ({ itemTitle, feature, howTo, screenshotUrl, scriptUrl, }) => {\r\n    const setPageTitle = () => {\r\n        document.title = itemTitle;\r\n    };\r\n    return (react_1.default.createElement(react_1.default.Fragment, null,\r\n        react_1.default.createElement(\"div\", { className: \"bookmarklet\" },\r\n            react_1.default.createElement(\"div\", { className: \"bookmarkletText\" },\r\n                react_1.default.createElement(\"h3\", { className: \"bookmarkletTitle\" },\r\n                    react_1.default.createElement(\"a\", { href: scriptUrl, onTouchStart: setPageTitle, onContextMenu: setPageTitle }, itemTitle)),\r\n                react_1.default.createElement(\"ul\", null,\r\n                    react_1.default.createElement(\"li\", null, feature),\r\n                    react_1.default.createElement(\"li\", null, typeof howTo === \"string\" ? howTo : howTo()))),\r\n            react_1.default.createElement(\"div\", { className: \"bookmarkletImage\" },\r\n                react_1.default.createElement(\"a\", { href: screenshotUrl },\r\n                    react_1.default.createElement(\"img\", { className: \"screenshot\", alt: \"screenshot\", src: screenshotUrl }))))));\r\n};\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/BookmarkItem.tsx?");

/***/ }),

/***/ "./js/bookmarklets/MobileCreateManual.tsx":
/*!************************************************!*\
  !*** ./js/bookmarklets/MobileCreateManual.tsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.MobileCreateManual = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nconst UIString = {\r\n    zh: {\r\n        title: \"在手機上怎麼新增書籤？\",\r\n        desc: \"最簡單的方式，是先在電腦上新增書籤，再同步到手機上。如果不方便用電腦，請依照你使用的瀏覽器參考以下步驟。\",\r\n        chrome1: \"長按並複製連結網址\",\r\n        chrome2: \"打開瀏覽器右上角的選單，按星星把此頁加入書籤\",\r\n        chrome3: \"畫面下方會顯示「已加入書籤」，點右邊「編輯」\",\r\n        chrome4: \"把網址完全刪除，並貼上剛才複製的連結\",\r\n    },\r\n    en: {\r\n        title: \"How to create bookmarklet on phone?\",\r\n        desc: \"Easiest way is to create the bookmarklet on PC and sync it to the phone. If it does not work, try the following steps for your browser.\",\r\n        chrome1: \"Long press and copy the bookmarklet link\",\r\n        chrome2: \"Tap the browser menu and tap the star to add current page to bookmarks.\",\r\n        chrome3: 'Screen bottom will show \"Bookmarked\". Tap the \"Edit\" link next to it.',\r\n        chrome4: \"Replace the URL with what you copied earlier.\",\r\n    },\r\n}[lang_1.LANG];\r\nexports.MobileCreateManual = () => (react_1.default.createElement(react_1.default.Fragment, null,\r\n    react_1.default.createElement(\"h3\", null,\r\n        \"\\u25CF \",\r\n        UIString.title),\r\n    react_1.default.createElement(\"div\", null,\r\n        react_1.default.createElement(\"p\", null, UIString.desc),\r\n        react_1.default.createElement(\"p\", null, \"Chrome:\"),\r\n        react_1.default.createElement(\"ol\", null,\r\n            react_1.default.createElement(\"li\", null, UIString.chrome1),\r\n            react_1.default.createElement(\"li\", null, UIString.chrome2),\r\n            react_1.default.createElement(\"li\", null, UIString.chrome3),\r\n            react_1.default.createElement(\"li\", null, UIString.chrome4)))));\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/MobileCreateManual.tsx?");

/***/ }),

/***/ "./js/bookmarklets/MobileUseManual.tsx":
/*!*********************************************!*\
  !*** ./js/bookmarklets/MobileUseManual.tsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.MobileUseManual = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nconst UIString = {\r\n    zh: {\r\n        title: \"在手機上怎麼使用書籤？\",\r\n        step1: \"登入 maimai NET 並進入指定的頁面後\",\r\n        step2: \"點網址欄\",\r\n        chrome3: \"把原本的網址刪除，再輸入書籤名稱的開頭前幾個字\",\r\n        chrome4: \"找到剛才新增的書籤（網址開頭應該要是 javascript），點下去\",\r\n    },\r\n    en: {\r\n        title: \"How to execute bookmarklet on phone?\",\r\n        step1: \"Log in to maimai NET and open the specific page for the bookmarklet.\",\r\n        step2: \"Tap the URL field.\",\r\n        chrome3: \"Input the first few characters of the bookmarklet name.\",\r\n        chrome4: 'Find and tap the bookmarklet you created earlier. The URL of the bookmarklet should start with \"javascript\".',\r\n    },\r\n}[lang_1.LANG];\r\nexports.MobileUseManual = () => (react_1.default.createElement(react_1.default.Fragment, null,\r\n    react_1.default.createElement(\"h3\", null,\r\n        \"\\u25CF \",\r\n        UIString.title),\r\n    react_1.default.createElement(\"div\", null,\r\n        react_1.default.createElement(\"p\", null, \"Chrome:\"),\r\n        react_1.default.createElement(\"ol\", null,\r\n            react_1.default.createElement(\"li\", null, UIString.step1),\r\n            react_1.default.createElement(\"li\", null, UIString.step2),\r\n            react_1.default.createElement(\"li\", null, UIString.chrome3),\r\n            react_1.default.createElement(\"li\", null, UIString.chrome4)))));\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/MobileUseManual.tsx?");

/***/ }),

/***/ "./js/bookmarklets/PCManual.tsx":
/*!**************************************!*\
  !*** ./js/bookmarklets/PCManual.tsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.PCManual = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nconst UIString = {\r\n    zh: {\r\n        title: \"在電腦上怎麼新增和使用書籤？\",\r\n        create: \"直接把連結拖曳到書籤列就能新增書籤。\",\r\n        use: \"使用時，先登入 maimai NET 並進入指定的頁面後，再點擊書籤。\",\r\n    },\r\n    en: {\r\n        title: \"How to create and execute bookmarklets on PC?\",\r\n        create: \"Show bookmarks bar (or favorites bar) in browser. Drag the link into the bookmarks bar to save the bookmarklet. \",\r\n        use: \"To use the bookmarklet, log in to maimai DX NET and open the specific page for the bookmarklet, and then click the bookmarklet in bookmarks bar.\",\r\n    },\r\n}[lang_1.LANG];\r\nexports.PCManual = () => (react_1.default.createElement(react_1.default.Fragment, null,\r\n    react_1.default.createElement(\"h3\", null,\r\n        \"\\u25CF \",\r\n        UIString.title),\r\n    react_1.default.createElement(\"div\", null,\r\n        react_1.default.createElement(\"p\", null, UIString.create),\r\n        react_1.default.createElement(\"p\", null, UIString.use))));\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/PCManual.tsx?");

/***/ }),

/***/ "./js/bookmarklets/RootComponent.tsx":
/*!*******************************************!*\
  !*** ./js/bookmarklets/RootComponent.tsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RootComponent = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nconst BookmarkItem_1 = __webpack_require__(/*! ./BookmarkItem */ \"./js/bookmarklets/BookmarkItem.tsx\");\r\nconst bookmarklets_1 = __webpack_require__(/*! ./bookmarklets */ \"./js/bookmarklets/bookmarklets.tsx\");\r\nconst i18n_1 = __webpack_require__(/*! ./i18n */ \"./js/bookmarklets/i18n.ts\");\r\nconst MobileCreateManual_1 = __webpack_require__(/*! ./MobileCreateManual */ \"./js/bookmarklets/MobileCreateManual.tsx\");\r\nconst MobileUseManual_1 = __webpack_require__(/*! ./MobileUseManual */ \"./js/bookmarklets/MobileUseManual.tsx\");\r\nconst PCManual_1 = __webpack_require__(/*! ./PCManual */ \"./js/bookmarklets/PCManual.tsx\");\r\nconst IntroText = {\r\n    zh: {\r\n        intro1: \"以下各標題的連結都是書籤小工具，必須在 maimai NET 上打開才有效果。如果沒使用過書籤小工具，請先閱讀 \",\r\n        faq: \"常見問題\",\r\n        intro2: \"。\",\r\n    },\r\n    en: {\r\n        intro1: \"The link for each section title is a bookmarklet. Bookmarklet works only when they are opened on maimai NET. If you never used bookmarklets before, read \",\r\n        faq: \"FAQ\",\r\n        intro2: \" first.\",\r\n    },\r\n}[lang_1.LANG];\r\nexports.RootComponent = () => (react_1.default.createElement(react_1.default.Fragment, null,\r\n    react_1.default.createElement(\"h2\", null, i18n_1.PAGE_TITLE),\r\n    react_1.default.createElement(\"p\", null,\r\n        IntroText.intro1,\r\n        react_1.default.createElement(\"a\", { href: \"#faq\" }, IntroText.faq),\r\n        IntroText.intro2),\r\n    react_1.default.createElement(\"div\", { className: \"bookmarkletList\" },\r\n        react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({}, bookmarklets_1.recentPlaySummary)),\r\n        react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({}, bookmarklets_1.albumDownloadHelper)),\r\n        react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({}, bookmarklets_1.ratingAnalyzer)),\r\n        react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({}, bookmarklets_1.analyzeFriendRating)),\r\n        react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({}, bookmarklets_1.scoreSorter)),\r\n        react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({}, bookmarklets_1.scoreConverter)),\r\n        react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({}, bookmarklets_1.scoreDownloader)),\r\n        react_1.default.createElement(\"br\", null),\r\n        react_1.default.createElement(\"div\", null,\r\n            react_1.default.createElement(\"h2\", { id: \"faq\" }, IntroText.faq),\r\n            react_1.default.createElement(PCManual_1.PCManual, null),\r\n            react_1.default.createElement(MobileCreateManual_1.MobileCreateManual, null),\r\n            react_1.default.createElement(MobileUseManual_1.MobileUseManual, null))),\r\n    react_1.default.createElement(\"div\", { className: \"footer credit\" },\r\n        react_1.default.createElement(\"hr\", null),\r\n        \"Made by\",\r\n        \" \",\r\n        react_1.default.createElement(\"a\", { href: \"https://github.com/myjian\", target: \"_blank\" }, \"myjian\"),\r\n        \".\")));\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/RootComponent.tsx?");

/***/ }),

/***/ "./js/bookmarklets/bookmarklets.tsx":
/*!******************************************!*\
  !*** ./js/bookmarklets/bookmarklets.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.albumDownloadHelper = exports.scoreDownloader = exports.analyzeFriendRating = exports.ratingAnalyzer = exports.recentPlaySummary = exports.scoreSorter = exports.scoreConverter = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nfunction getBookmarkletLink(scriptUrl, paths = [], strictPathMatch) {\r\n    const pathCheck = paths.reduce((code, path, index, array) => {\r\n        if (index === 0) {\r\n            code += \" && (\";\r\n        }\r\n        else if (index > 0) {\r\n            code += \" || \";\r\n        }\r\n        if (strictPathMatch) {\r\n            code += \"d.location.pathname==='\" + path + \"'\";\r\n        }\r\n        else {\r\n            code += \"d.location.pathname.indexOf('\" + path + \"')>=0\";\r\n        }\r\n        if (index === array.length - 1) {\r\n            code += \")\";\r\n        }\r\n        return code;\r\n    }, \"\");\r\n    let js = `javascript:void (function(d){if (\n['maimaidx-eng.com','maimaidx.jp'].indexOf(d.location.host)>=0\n${pathCheck}\n){var s=d.createElement('script');\ns.src='${scriptUrl}?t='+Math.floor(Date.now()/60000);\nd.body.append(s);\n}})(document)`;\r\n    return js;\r\n}\r\nexports.scoreConverter = {\r\n    itemTitle: {\r\n        zh: \"換算成舊版達成率 & 分析\",\r\n        en: \"Convert DX score to old score system\",\r\n    }[lang_1.LANG],\r\n    feature: {\r\n        zh: \"功能：可轉換 DX 達成率為舊版 (maimai FiNALE) 計分方式，以及分析各指令扣分比例。\",\r\n        en: \"Feature: Convert DX achievement to old achievement (maimai FiNALE & older), and analyze score penalty by note type.\",\r\n    }[lang_1.LANG],\r\n    howTo: {\r\n        zh: \"使用方式：登入 maimai NET，點選最近遊玩的其中一筆紀錄後執行。執行後會開啟新分頁，顯示舊版成績以及相關數據。點擊地點（Cafe MiLK）可切換計分方式，點擊達成率可切換詳細顯示。\",\r\n        en: 'Usage: Log in to maimai NET. Open a recent song record and execute the bookmarklet. New tab will open and display score in old achievement system. You can click on \"Cafe MiLK\" to switch to DX achievement, and click on the achievement % to see how much percentage was lost per note type.',\r\n    }[lang_1.LANG],\r\n    scriptUrl: getBookmarkletLink(\"https://myjian.github.io/mai-tools/scripts/score-converter.js\", [\r\n        \"/maimai-mobile/record/playlogDetail/\",\r\n    ]),\r\n    screenshotUrl: \"./screenshots/convert-to-finale-score-20200718.jpg\",\r\n};\r\nexports.scoreSorter = {\r\n    itemTitle: {\r\n        zh: \"排序成績\",\r\n        en: \"Sort scores\",\r\n    }[lang_1.LANG],\r\n    feature: {\r\n        zh: \"功能：可依照等級、Rank、AP/FC 狀態排序成績。\",\r\n        en: \"Feature: Sort scores by level, rank, or AP/FC status.\",\r\n    }[lang_1.LANG],\r\n    howTo: {\r\n        zh: \"使用方式：於分類查詢成績頁執行。執行完後畫面上會出現選單，可按自己喜歡的方式排序。\",\r\n        en: \"Usage: Open historical scores (by genre, level, song title, version, etc.) and execute the bookmarklet.\",\r\n    }[lang_1.LANG],\r\n    scriptUrl: getBookmarkletLink(\"https://myjian.github.io/mai-tools/scripts/score-sort.js\", [\r\n        \"/maimai-mobile/record/music\",\r\n    ]),\r\n    screenshotUrl: \"./screenshots/score-sort-20200630.png\",\r\n};\r\nexports.recentPlaySummary = {\r\n    itemTitle: {\r\n        zh: \"整理最近遊玩紀錄\",\r\n        en: \"Recent play summary\",\r\n    }[lang_1.LANG],\r\n    feature: {\r\n        zh: \"功能：以表格方式整理最近的遊玩紀錄，並將遊戲時間修正為當地時間。\",\r\n        en: \"Feature: Organize recent game records into a condensed table.\",\r\n    }[lang_1.LANG],\r\n    howTo: {\r\n        zh: \"使用方式：於最近成績列表執行。執行後會在頁面中產生表格，可以選取日期和排序。\",\r\n        en: \"Usage: Open the recent game records list and execute the bookmarklet.\",\r\n    }[lang_1.LANG],\r\n    scriptUrl: getBookmarkletLink(\"https://myjian.github.io/mai-tools/scripts/recent-play-downloader.js\", [\"/maimai-mobile/record/\"], true),\r\n    screenshotUrl: \"./screenshots/recent-play-summary-20200704.png\",\r\n};\r\nexports.ratingAnalyzer = {\r\n    itemTitle: {\r\n        zh: \"分析 DX Rating\",\r\n        en: \"Analyze DX Rating\",\r\n    }[lang_1.LANG],\r\n    feature: {\r\n        zh: \"功能：可分析自己的 DX Rating 組成。\",\r\n        en: \"Feature: Analyze your DX Rating composition.\",\r\n    }[lang_1.LANG],\r\n    howTo: {\r\n        zh: \"使用方式：於 maimai NET 首頁或個人檔案頁面執行。執行時會開新分頁，載入成績並進行分析。\",\r\n        en: \"Usage: Execute the bookmarklet on maimai NET home page or player data page.\",\r\n    }[lang_1.LANG],\r\n    scriptUrl: getBookmarkletLink(\"https://myjian.github.io/mai-tools/scripts/analyze-rating-in-newtab.js\"),\r\n    screenshotUrl: \"./screenshots/rating-analyzer-20200702.png\",\r\n};\r\nexports.analyzeFriendRating = {\r\n    itemTitle: {\r\n        zh: \"分析好友 DX Rating\",\r\n        en: \"Analyze Friend's DX Rating\",\r\n    }[lang_1.LANG],\r\n    feature: {\r\n        zh: \"功能：可分析朋友的 DX Rating 組成。\",\r\n        en: \"Feature: Analyze your favorite friend's DX Rating composition.\",\r\n    }[lang_1.LANG],\r\n    howTo: {\r\n        zh: \"使用方式：於朋友清單頁面，先將想分析的好友加入最愛（ADD to FAVORITE），再執行書籤。設成最愛的好友檔案中會出現「分析 Rating」的連結，點擊後會分析該玩家的 R 值。\",\r\n        en: 'Usage: Open friend list. Add the friend you want to analyze to FAVORITE. Execute the bookmarklet. There will have an \"Analyze Rating\" link for each favorite friend. Click on one of the links to analyze rating for that player.',\r\n    }[lang_1.LANG],\r\n    scriptUrl: getBookmarkletLink(\"https://myjian.github.io/mai-tools/scripts/analyze-friend-rating-in-new-tab.js\", [\"/maimai-mobile/friend/\", \"/maimai-mobile/friend/favoriteOn/\", \"/maimai-mobile/friend/pages/\"], true),\r\n    screenshotUrl: \"./screenshots/analyze-friend-rating-20200725.png\",\r\n};\r\nconst scoreDownloaderUsageText = {\r\n    en: {\r\n        part1: 'Usage: Execute the bookmarklet on maimai NET home page. After several seconds, a \"Copy\" button will appear on screen. Click the Copy button to copy scores. You can paste them in Excel, Google Sheets, or ',\r\n        ratingAnalyzer: \"Rating Analyzer\",\r\n        part2: \".\",\r\n    },\r\n    zh: {\r\n        part1: \"使用方式：於 maimai NET 首頁執行。執行完後點下畫面上的「複製」按鈕就能複製所有成績。複製後可貼到 Excel、Google 試算表，或是 \",\r\n        ratingAnalyzer: \"R 值分析工具\",\r\n        part2: \"。\",\r\n    },\r\n}[lang_1.LANG];\r\nexports.scoreDownloader = {\r\n    itemTitle: {\r\n        zh: \"下載所有歌曲成績\",\r\n        en: \"Download all scores\",\r\n    }[lang_1.LANG],\r\n    feature: {\r\n        zh: \"功能：下載所有白譜、紫譜、紅譜、黃譜的成績。可用於個人紀錄或是 R 值分析。\",\r\n        en: \"Feature: Download all ADVANCED, EXPERT, MASTER, and Re:MASTER scores.\",\r\n    }[lang_1.LANG],\r\n    howTo: () => (react_1.default.createElement(react_1.default.Fragment, null,\r\n        scoreDownloaderUsageText.part1,\r\n        react_1.default.createElement(\"a\", { href: \"/mai-tools/rating-calculator/\", target: \"_blank\" }, scoreDownloaderUsageText.ratingAnalyzer),\r\n        scoreDownloaderUsageText.part2)),\r\n    scriptUrl: getBookmarkletLink(\"https://myjian.github.io/mai-tools/scripts/score-download.js\"),\r\n    screenshotUrl: \"./screenshots/score-download-20200630.png\",\r\n};\r\nexports.albumDownloadHelper = {\r\n    itemTitle: {\r\n        zh: \"相簿照片命名\",\r\n        en: \"Album Download Helper\",\r\n    }[lang_1.LANG],\r\n    feature: {\r\n        zh: '功能：把相簿內的照片以 \"日期 曲名 難度.jpg\" 方式命名，並且可以直接點擊照片下載。',\r\n        en: 'Feature: Make photos in the album downloadable with filenames like \"Date Songname Difficulty.jpg\"',\r\n    }[lang_1.LANG],\r\n    howTo: {\r\n        zh: \"使用方式：進入 PHOTOS 頁面後執行書籤，執行完後點擊想要下載的照片，就能存到手機或電腦上。\",\r\n        en: 'Usage: Open PHOTOS page and execute this bookmarklet. Photos on the page will be clickable and have proper filenames.',\r\n    }[lang_1.LANG],\r\n    scriptUrl: getBookmarkletLink(\"https://myjian.github.io/mai-tools/scripts/album-download-helper.js\"),\r\n    screenshotUrl: \"./screenshots/album-download-helper-20210216.png\",\r\n};\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/bookmarklets.tsx?");

/***/ }),

/***/ "./js/bookmarklets/i18n.ts":
/*!*********************************!*\
  !*** ./js/bookmarklets/i18n.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.PAGE_TITLE = void 0;\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nexports.PAGE_TITLE = {\r\n    en: \"maimai Bookmarklets\",\r\n    zh: \"maimai 書籤小工具\",\r\n}[lang_1.LANG];\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/i18n.ts?");

/***/ }),

/***/ "./js/bookmarklets/main.tsx":
/*!**********************************!*\
  !*** ./js/bookmarklets/main.tsx ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ \"react-dom\"));\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nconst i18n_1 = __webpack_require__(/*! ./i18n */ \"./js/bookmarklets/i18n.ts\");\r\nconst RootComponent_1 = __webpack_require__(/*! ./RootComponent */ \"./js/bookmarklets/RootComponent.tsx\");\r\ndocument.children[0].lang = lang_1.LANG === \"zh\" ? \"zh-Hant\" : \"en-US\";\r\ndocument.title = i18n_1.PAGE_TITLE;\r\nreact_dom_1.default.render(react_1.default.createElement(RootComponent_1.RootComponent, null), document.getElementById(\"root\"));\r\n\n\n//# sourceURL=webpack:///./js/bookmarklets/main.tsx?");

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

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = React;\n\n//# sourceURL=webpack:///external_%22React%22?");

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = ReactDOM;\n\n//# sourceURL=webpack:///external_%22ReactDOM%22?");

/***/ })

/******/ });