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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/classic-layout/main.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/classic-layout/achvLoss.ts":
/*!***************************************!*\
  !*** ./js/classic-layout/achvLoss.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.calculateAchvLoss = void 0;\r\nconst number_helper_1 = __webpack_require__(/*! ../common/number-helper */ \"./js/common/number-helper.ts\");\r\nconst constants_1 = __webpack_require__(/*! ./constants */ \"./js/classic-layout/constants.ts\");\r\nfunction createEmptyJudgementMap() {\r\n    return Object.assign({ total: 0 }, constants_1.EMPTY_JUDGEMENT_OBJ);\r\n}\r\nfunction calculateAchvLoss(judgementsPerType, breakDistribution, scorePerPercentage) {\r\n    const dxTotalLoss = createEmptyJudgementMap();\r\n    const finaleTotalLoss = createEmptyJudgementMap();\r\n    const achievementLossPerType = { dx: new Map(), finale: new Map() };\r\n    const totalBreakCount = number_helper_1.sum(Object.values(judgementsPerType.get(\"break\")));\r\n    judgementsPerType.forEach((judgements, noteType) => {\r\n        const baseScore = constants_1.BASE_SCORE_PER_TYPE[noteType];\r\n        const finaleNoteLoss = createEmptyJudgementMap();\r\n        const dxNoteLoss = createEmptyJudgementMap();\r\n        if (noteType === \"break\") {\r\n            finaleNoteLoss.perfect = breakDistribution.get(2550) * 50 + breakDistribution.get(2500) * 100;\r\n            finaleNoteLoss.great = (breakDistribution.get(2000) * 600\r\n                + breakDistribution.get(1500) * 1100\r\n                + breakDistribution.get(1250) * 1350);\r\n            finaleNoteLoss.good = breakDistribution.get(1000) * 1600;\r\n            finaleNoteLoss.miss = breakDistribution.get(0) * 2600;\r\n            finaleNoteLoss.total = Object.values(finaleNoteLoss).reduce((a, b) => (a + b), 0);\r\n            dxNoteLoss.perfect = (breakDistribution.get(2550) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(2550))\r\n                + breakDistribution.get(2500) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(2500))) / totalBreakCount;\r\n            dxNoteLoss.great = (breakDistribution.get(2000) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(2000))\r\n                + breakDistribution.get(1500) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(1500))\r\n                + breakDistribution.get(1250) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(1250))) * baseScore / scorePerPercentage + (breakDistribution.get(2000) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(2000))\r\n                + breakDistribution.get(1500) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(1500))\r\n                + breakDistribution.get(1250) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(1250))) / totalBreakCount;\r\n            dxNoteLoss.good = (breakDistribution.get(1000) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(1000))) * baseScore / scorePerPercentage + (breakDistribution.get(1000) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(1000))) / totalBreakCount;\r\n            dxNoteLoss.miss = (breakDistribution.get(0) * baseScore / scorePerPercentage\r\n                + breakDistribution.get(0) / totalBreakCount);\r\n            dxNoteLoss.total = Object.values(dxNoteLoss).reduce((a, b) => (a + b), 0);\r\n        }\r\n        else {\r\n            finaleNoteLoss.perfect = 0;\r\n            finaleNoteLoss.great = Math.round(judgements.great * baseScore * (1 - constants_1.REGULAR_BASE_SCORE_MULTIPLIER.great));\r\n            finaleNoteLoss.good = Math.round(judgements.good * baseScore * (1 - constants_1.REGULAR_BASE_SCORE_MULTIPLIER.good));\r\n            finaleNoteLoss.miss = judgements.miss * baseScore;\r\n            finaleNoteLoss.total = Object.values(finaleNoteLoss).reduce((a, b) => (a + b), 0);\r\n            for (const [j, loss] of Object.entries(finaleNoteLoss)) {\r\n                dxNoteLoss[j] = loss / scorePerPercentage;\r\n            }\r\n        }\r\n        for (const [j, loss] of Object.entries(finaleNoteLoss)) {\r\n            finaleTotalLoss[j] += loss;\r\n        }\r\n        for (const [j, loss] of Object.entries(dxNoteLoss)) {\r\n            dxTotalLoss[j] += loss;\r\n        }\r\n        achievementLossPerType.finale.set(noteType, finaleNoteLoss);\r\n        achievementLossPerType.dx.set(noteType, dxNoteLoss);\r\n    });\r\n    achievementLossPerType.finale.set(\"total\", finaleTotalLoss);\r\n    achievementLossPerType.dx.set(\"total\", dxTotalLoss);\r\n    return achievementLossPerType;\r\n}\r\nexports.calculateAchvLoss = calculateAchvLoss;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/achvLoss.ts?");

/***/ }),

/***/ "./js/classic-layout/backtracing.ts":
/*!******************************************!*\
  !*** ./js/classic-layout/backtracing.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.walkBreakDistributions = void 0;\r\nconst constants_1 = __webpack_require__(/*! ./constants */ \"./js/classic-layout/constants.ts\");\r\n/*\r\n * @param breakDistribution Map<number, number>\r\n * @return number bestAchievement of this break judgement\r\n */\r\nfunction walkBreakDistributions(validBreakDistributions, breakDistribution, breakJudgements, remainingAchievement, basePercentagePerBreak) {\r\n    let noteCount = breakJudgements[0];\r\n    let isBestAchievementSet = false;\r\n    let bestAchievement = 0;\r\n    switch (breakJudgements.length) {\r\n        case 5: // Critical Perfect\r\n            breakDistribution.set(constants_1.MAX_BREAK_POINTS, noteCount);\r\n            return walkBreakDistributions(validBreakDistributions, breakDistribution, breakJudgements.slice(1), remainingAchievement, basePercentagePerBreak);\r\n        case 4: // Perfect\r\n            let cpLowerBound = 0, cpUpperBound = noteCount;\r\n            if (breakDistribution.has(constants_1.MAX_BREAK_POINTS)) {\r\n                const cpCount = breakDistribution.get(constants_1.MAX_BREAK_POINTS);\r\n                noteCount += cpCount;\r\n                cpLowerBound = cpCount;\r\n                cpUpperBound = cpCount;\r\n            }\r\n            for (let i = cpUpperBound; i >= cpLowerBound; i--) {\r\n                breakDistribution.set(constants_1.MAX_BREAK_POINTS, i);\r\n                for (let j = noteCount - i; j >= 0; j--) {\r\n                    breakDistribution.set(2550, j);\r\n                    breakDistribution.set(2500, noteCount - i - j);\r\n                    const playerAchievement = walkBreakDistributions(validBreakDistributions, breakDistribution, breakJudgements.slice(1), remainingAchievement, basePercentagePerBreak);\r\n                    if (!isBestAchievementSet) {\r\n                        bestAchievement = playerAchievement;\r\n                        isBestAchievementSet = true;\r\n                    }\r\n                    if (playerAchievement < remainingAchievement) {\r\n                        // playerAchievement will not get better for smaller j. Try next i.\r\n                        break;\r\n                    }\r\n                }\r\n            }\r\n            return bestAchievement;\r\n        case 3: // Great\r\n            for (let i = noteCount; i >= 0; i--) {\r\n                breakDistribution.set(2000, i);\r\n                for (let j = noteCount - i; j >= 0; j--) {\r\n                    breakDistribution.set(1500, j);\r\n                    breakDistribution.set(1250, noteCount - i - j);\r\n                    const playerAchievement = walkBreakDistributions(validBreakDistributions, breakDistribution, breakJudgements.slice(1), remainingAchievement, basePercentagePerBreak);\r\n                    if (!isBestAchievementSet) {\r\n                        bestAchievement = playerAchievement;\r\n                        isBestAchievementSet = true;\r\n                    }\r\n                    if (playerAchievement < remainingAchievement) {\r\n                        // playerAchievement will not get better for smaller j. Try next i.\r\n                        break;\r\n                    }\r\n                }\r\n            }\r\n            return bestAchievement;\r\n        case 2: // Good\r\n            breakDistribution.set(1000, noteCount);\r\n            return walkBreakDistributions(validBreakDistributions, breakDistribution, breakJudgements.slice(1), remainingAchievement, basePercentagePerBreak);\r\n        case 1: // Miss\r\n            breakDistribution.set(0, noteCount);\r\n            return walkBreakDistributions(validBreakDistributions, breakDistribution, breakJudgements.slice(1), remainingAchievement, basePercentagePerBreak);\r\n        case 0: // Validate\r\n            let totalCount = 0;\r\n            let bonusAchievementSum = 0.0;\r\n            let playerAchievement = 0;\r\n            breakDistribution.forEach((count, judgement) => {\r\n                totalCount += count;\r\n                playerAchievement +=\r\n                    count *\r\n                        constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(judgement) *\r\n                        basePercentagePerBreak;\r\n                bonusAchievementSum += count * constants_1.BREAK_BONUS_MULTIPLIER.get(judgement);\r\n            });\r\n            playerAchievement += bonusAchievementSum / totalCount;\r\n            remainingAchievement -= playerAchievement;\r\n            if (Math.abs(remainingAchievement) < 0.0001) {\r\n                validBreakDistributions.push(new Map(breakDistribution));\r\n            }\r\n            return playerAchievement;\r\n        default:\r\n            throw new Error(\"unreachable\");\r\n    }\r\n}\r\nexports.walkBreakDistributions = walkBreakDistributions;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/backtracing.ts?");

/***/ }),

/***/ "./js/classic-layout/components/AchievementInfo.tsx":
/*!**********************************************************!*\
  !*** ./js/classic-layout/components/AchievementInfo.tsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.AchievementInfo = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst rank_functions_1 = __webpack_require__(/*! ../../common/rank-functions */ \"./js/common/rank-functions.ts\");\r\nconst MAX_DX_ACHIEVEMENT = 101;\r\nfunction calculateRankTitle(finaleAchv, isDxMode, dxAchv, apFcStatus) {\r\n    if (isDxMode) {\r\n        return rank_functions_1.getRankTitle(dxAchv);\r\n    }\r\n    if (apFcStatus === \"AP+\") {\r\n        return \"SSS+\";\r\n    }\r\n    return rank_functions_1.getFinaleRankTitle(finaleAchv);\r\n}\r\nfunction getApFcClassName(apFcStatus) {\r\n    const base = \"apfc\";\r\n    if (!apFcStatus) {\r\n        return base;\r\n    }\r\n    else if (apFcStatus === \"FC+\") {\r\n        return base + \" fcplus\";\r\n    }\r\n    return apFcStatus.includes(\"AP\") ? base + \" ap\" : base;\r\n}\r\nfunction getSyncClassName(isDxMode) {\r\n    return isDxMode ? \"sync\" : \"sync finaleSync\";\r\n}\r\nclass AchievementInfo extends react_1.default.PureComponent {\r\n    static getDerivedStateFromProps(props) {\r\n        const { dxAchv, apFcStatus, finaleAchv, isDxMode } = props;\r\n        return { rankTitle: calculateRankTitle(finaleAchv, isDxMode, dxAchv, apFcStatus) };\r\n    }\r\n    componentDidMount() {\r\n        this.fetchRankImage();\r\n    }\r\n    componentDidUpdate() {\r\n        this.fetchRankImage();\r\n    }\r\n    render() {\r\n        const { apFcStatus, apFcImg, rankImgMap, isHighScore, syncStatus, syncImg, maxFinaleAchv, dxAchv, finaleAchv, isDxMode, toggleDisplayMode, showMaxAchv, } = this.props;\r\n        const { rankTitle } = this.state;\r\n        const rankImg = rankImgMap.get(rankTitle);\r\n        const rankElem = rankImg ? (react_1.default.createElement(\"img\", { className: \"rankImg\", src: rankImg, alt: rankTitle })) : (rankTitle);\r\n        const apFcElem = apFcImg ? (react_1.default.createElement(\"img\", { className: \"apFcImg\", src: apFcImg, alt: apFcStatus })) : (apFcStatus);\r\n        const syncElem = syncImg ? (react_1.default.createElement(\"img\", { className: \"syncImg\", src: syncImg, alt: syncStatus })) : (this.getSyncStatusText(syncStatus, isDxMode));\r\n        const achvText = isDxMode ? dxAchv.toFixed(4) : finaleAchv.toFixed(2);\r\n        const maxAchvText = isDxMode ? MAX_DX_ACHIEVEMENT.toFixed(4) : maxFinaleAchv.toFixed(2);\r\n        return (react_1.default.createElement(\"div\", { className: \"achievementInfo\" },\r\n            react_1.default.createElement(\"div\", { className: \"achvInfoSpace\" }),\r\n            react_1.default.createElement(\"div\", { className: \"rank\" }, rankElem),\r\n            react_1.default.createElement(\"div\", { className: getApFcClassName(apFcStatus) }, apFcElem),\r\n            react_1.default.createElement(\"div\", { className: getSyncClassName(isDxMode) }, syncElem),\r\n            react_1.default.createElement(\"div\", { className: \"playerScore\" },\r\n                react_1.default.createElement(\"div\", { className: \"highScore\" }, isHighScore ? \"HIGH SCORE!!\" : \" \"),\r\n                react_1.default.createElement(\"div\", { className: \"achievement\", tabIndex: 0, onClick: toggleDisplayMode },\r\n                    \"\\u9054\\u6210\\u7387\\uFF1A\",\r\n                    react_1.default.createElement(\"div\", { className: \"achvNum\" + (showMaxAchv ? \" hasMaxAchv\" : \"\") },\r\n                        react_1.default.createElement(\"span\", { className: \"playerAchv\" },\r\n                            achvText,\r\n                            \"\\uFF05\"),\r\n                        showMaxAchv && react_1.default.createElement(\"span\", { className: \"maxAchv\" },\r\n                            maxAchvText,\r\n                            \"\\uFF05\"))))));\r\n    }\r\n    getSyncStatusText(syncStatus, isDxMode) {\r\n        if (syncStatus && !isDxMode) {\r\n            switch (syncStatus) {\r\n                case \"FS\":\r\n                case \"FS+\":\r\n                    return \"MAX FEVER\";\r\n                case \"FDX\":\r\n                case \"FDX+\":\r\n                    return \"100% SYNC\";\r\n            }\r\n        }\r\n        return syncStatus;\r\n    }\r\n    fetchRankImage() {\r\n        const { rankImgMap, fetchRankImage } = this.props;\r\n        const { rankTitle } = this.state;\r\n        if (!rankImgMap.has(rankTitle)) {\r\n            fetchRankImage(rankTitle);\r\n        }\r\n    }\r\n}\r\nexports.AchievementInfo = AchievementInfo;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/AchievementInfo.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/BreakNoteJudgement.tsx":
/*!*************************************************************!*\
  !*** ./js/classic-layout/components/BreakNoteJudgement.tsx ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.BreakNoteJudgement = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst NoteJudgement_1 = __webpack_require__(/*! ./NoteJudgement */ \"./js/classic-layout/components/NoteJudgement.tsx\");\r\nclass BreakNoteJudgement extends react_1.default.PureComponent {\r\n    render() {\r\n        const { judgements, distribution, lastColumn, isDxMode, displayMode } = this.props;\r\n        const scoreClass = lastColumn.isMax ? \"score maxScore\" : \"score\";\r\n        if (displayMode === \"DETAIL\" /* DETAIL */) {\r\n            return (react_1.default.createElement(\"tr\", { className: \"breakNoteRow\" },\r\n                react_1.default.createElement(\"th\", { className: \"rowHead\" }, \"Break\"),\r\n                react_1.default.createElement(\"td\", { colSpan: 3, className: \"noRightBorder\" },\r\n                    react_1.default.createElement(\"div\", { className: \"breakDistribution\" },\r\n                        react_1.default.createElement(\"span\", { className: \"perfect\" }, distribution.get(2600)),\r\n                        react_1.default.createElement(\"span\", { className: \"perfect\" }, distribution.get(2550)),\r\n                        react_1.default.createElement(\"span\", { className: \"perfect\" }, distribution.get(2500)),\r\n                        react_1.default.createElement(\"span\", { className: \"great\" }, distribution.get(2000)),\r\n                        react_1.default.createElement(\"span\", { className: \"great\" }, distribution.get(1500)),\r\n                        react_1.default.createElement(\"span\", { className: \"great\" }, distribution.get(1250)),\r\n                        react_1.default.createElement(\"span\", { className: \"good\" }, distribution.get(1000)))),\r\n                react_1.default.createElement(\"td\", { className: \"noLeftBorder\" },\r\n                    react_1.default.createElement(\"div\", { className: \"miss missWithBefore\" }, distribution.get(0))),\r\n                react_1.default.createElement(\"td\", { className: scoreClass }, NoteJudgement_1.getLastColumnText(lastColumn.score, isDxMode))));\r\n        }\r\n        else {\r\n            return (react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: \"break\", judgements: judgements, lastColumn: lastColumn, isDxMode: isDxMode }));\r\n        }\r\n    }\r\n}\r\nexports.BreakNoteJudgement = BreakNoteJudgement;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/BreakNoteJudgement.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/CreditInfo.tsx":
/*!*****************************************************!*\
  !*** ./js/classic-layout/components/CreditInfo.tsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.CreditInfo = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass CreditInfo extends react_1.default.PureComponent {\r\n    render() {\r\n        return (react_1.default.createElement(\"div\", { className: \"credit\" },\r\n            react_1.default.createElement(\"span\", { className: \"madeBy\" },\r\n                \"Made by\",\r\n                \" \"),\r\n            react_1.default.createElement(\"a\", { className: \"authorLink\", href: \"https://github.com/myjian\", target: \"_blank\" }, \"myjian\"),\r\n            \".\"));\r\n    }\r\n}\r\nexports.CreditInfo = CreditInfo;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/CreditInfo.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/DateAndPlace.tsx":
/*!*******************************************************!*\
  !*** ./js/classic-layout/components/DateAndPlace.tsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.DateAndPlace = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass DateAndPlace extends react_1.default.PureComponent {\r\n    render() {\r\n        const { date, isDxMode } = this.props;\r\n        const place = isDxMode ? \"でらっくすちほー\" : \"CAFE MiLK\";\r\n        return (react_1.default.createElement(\"div\", { className: \"dateAndPlace\" },\r\n            react_1.default.createElement(\"div\", { className: \"date\" }, date),\r\n            react_1.default.createElement(\"div\", { className: \"place\", tabIndex: 0, onClick: this.props.toggleDxMode }, place)));\r\n    }\r\n}\r\nexports.DateAndPlace = DateAndPlace;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/DateAndPlace.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/JudgementContainer.tsx":
/*!*************************************************************!*\
  !*** ./js/classic-layout/components/JudgementContainer.tsx ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.JudgementContainer = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst BreakNoteJudgement_1 = __webpack_require__(/*! ./BreakNoteJudgement */ \"./js/classic-layout/components/BreakNoteJudgement.tsx\");\r\nconst NextRankInfo_1 = __webpack_require__(/*! ./NextRankInfo */ \"./js/classic-layout/components/NextRankInfo.tsx\");\r\nconst NoteJudgement_1 = __webpack_require__(/*! ./NoteJudgement */ \"./js/classic-layout/components/NoteJudgement.tsx\");\r\nclass JudgementContainer extends react_1.default.PureComponent {\r\n    render() {\r\n        const { nextRank, noteJudgements, breakDistribution, totalJudgements, scorePerType, combo, isDxMode, displayMode } = this.props;\r\n        return (react_1.default.createElement(\"div\", { className: \"judgementContainer\" },\r\n            react_1.default.createElement(\"table\", { className: \"judgement\" },\r\n                react_1.default.createElement(\"tbody\", null,\r\n                    react_1.default.createElement(\"tr\", null,\r\n                        react_1.default.createElement(\"th\", { className: \"rowHead\" }, \"\\u00A0\"),\r\n                        react_1.default.createElement(\"th\", { className: \"perfect\" }, \"Perfect\"),\r\n                        react_1.default.createElement(\"th\", { className: \"great\" }, \"Great\"),\r\n                        react_1.default.createElement(\"th\", { className: \"good\" }, \"Good\"),\r\n                        react_1.default.createElement(\"th\", { className: \"miss\" }, \"Miss\"),\r\n                        react_1.default.createElement(\"th\", { className: \"score\" }, \"Score\")),\r\n                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: \"total\", judgements: totalJudgements, lastColumn: scorePerType.get(\"total\"), isDxMode: isDxMode }),\r\n                    react_1.default.createElement(NextRankInfo_1.NextRankInfo, { nextRank: nextRank, showTitle: displayMode !== \"NORMAL\" /* NORMAL */ }),\r\n                    combo && (react_1.default.createElement(\"tr\", { className: \"maxCombo\" },\r\n                        react_1.default.createElement(\"th\", { className: \"noRightBorder\", colSpan: 4 }, \"MAX COMBO\"),\r\n                        react_1.default.createElement(\"td\", { className: \"noLeftBorder\", colSpan: 2 }, combo))),\r\n                    react_1.default.createElement(\"tr\", { className: \"tableSeparator\" },\r\n                        react_1.default.createElement(\"td\", { colSpan: 6 })),\r\n                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: \"tap\", judgements: noteJudgements.get(\"tap\"), lastColumn: scorePerType.get(\"tap\"), isDxMode: isDxMode }),\r\n                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: \"hold\", judgements: noteJudgements.get(\"hold\"), lastColumn: scorePerType.get(\"hold\"), isDxMode: isDxMode }),\r\n                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: \"slide\", judgements: noteJudgements.get(\"slide\"), lastColumn: scorePerType.get(\"slide\"), isDxMode: isDxMode }),\r\n                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: \"touch\", judgements: noteJudgements.get(\"touch\"), lastColumn: scorePerType.get(\"touch\"), isDxMode: isDxMode }),\r\n                    react_1.default.createElement(BreakNoteJudgement_1.BreakNoteJudgement, { judgements: noteJudgements.get(\"break\"), distribution: breakDistribution, lastColumn: scorePerType.get(\"break\"), isDxMode: isDxMode, displayMode: displayMode })))));\r\n    }\r\n}\r\nexports.JudgementContainer = JudgementContainer;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/JudgementContainer.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/NextRankInfo.tsx":
/*!*******************************************************!*\
  !*** ./js/classic-layout/components/NextRankInfo.tsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.NextRankInfo = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass NextRankInfo extends react_1.default.PureComponent {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.state = { showTitle: false };\r\n    }\r\n    render() {\r\n        const { nextRank, showTitle } = this.props;\r\n        const nextRankTitle = (showTitle && nextRank) ? nextRank.title : \"\";\r\n        const nextRankDiff = this.getNextRankDiff();\r\n        return (react_1.default.createElement(\"tr\", { className: \"nextRank\" },\r\n            react_1.default.createElement(\"th\", { className: \"noRightBorder\", colSpan: 4 }, \"NEXT RANK\"),\r\n            react_1.default.createElement(\"td\", { className: \"noLeftBorder\", colSpan: 2 },\r\n                nextRankTitle && react_1.default.createElement(\"span\", { className: \"nextRankTitle\" }, nextRankTitle),\r\n                nextRankDiff && react_1.default.createElement(\"span\", { className: \"nextRankDiff\" }, nextRankDiff))));\r\n    }\r\n    getNextRankDiff() {\r\n        const { nextRank } = this.props;\r\n        if (!nextRank) {\r\n            return \"—————\";\r\n        }\r\n        const { diff } = nextRank;\r\n        if (typeof diff === \"number\") {\r\n            if (Math.round(diff) !== diff) {\r\n                return diff.toFixed(4) + \"%\";\r\n            }\r\n            return diff.toLocaleString(\"en\");\r\n        }\r\n        return diff;\r\n    }\r\n}\r\nexports.NextRankInfo = NextRankInfo;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/NextRankInfo.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/NoteJudgement.tsx":
/*!********************************************************!*\
  !*** ./js/classic-layout/components/NoteJudgement.tsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.NoteJudgement = exports.getLastColumnText = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst number_helper_1 = __webpack_require__(/*! ../../common/number-helper */ \"./js/common/number-helper.ts\");\r\nfunction getPerfectCount(j) {\r\n    const cpV = j.cp;\r\n    if (cpV) {\r\n        return cpV + j.perfect;\r\n    }\r\n    return j.perfect;\r\n}\r\nfunction getLastColumnText(score, isDxMode) {\r\n    if (typeof score === \"string\") {\r\n        return score;\r\n    }\r\n    return isDxMode ? number_helper_1.formatFloat(score, 4) + \"%\" : score.toLocaleString(\"en\");\r\n}\r\nexports.getLastColumnText = getLastColumnText;\r\nclass NoteJudgement extends react_1.default.PureComponent {\r\n    render() {\r\n        const { noteType, judgements, lastColumn, isDxMode } = this.props;\r\n        if (!judgements) {\r\n            return null;\r\n        }\r\n        const heading = noteType.charAt(0).toUpperCase() + noteType.substring(1);\r\n        const scoreClass = lastColumn.isMax ? \"score maxScore\" : \"score\";\r\n        const perfectCount = getPerfectCount(judgements);\r\n        return (react_1.default.createElement(\"tr\", { className: noteType + \"NoteRow\" },\r\n            react_1.default.createElement(\"th\", { className: \"rowHead\" }, heading),\r\n            react_1.default.createElement(\"td\", { className: \"perfect\" }, perfectCount),\r\n            react_1.default.createElement(\"td\", { className: \"great\" }, judgements.great),\r\n            react_1.default.createElement(\"td\", { className: \"good\" }, judgements.good),\r\n            react_1.default.createElement(\"td\", { className: \"miss\" }, judgements.miss),\r\n            react_1.default.createElement(\"td\", { className: scoreClass }, getLastColumnText(lastColumn.score, isDxMode))));\r\n    }\r\n}\r\nexports.NoteJudgement = NoteJudgement;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/NoteJudgement.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/PageFooter.tsx":
/*!*****************************************************!*\
  !*** ./js/classic-layout/components/PageFooter.tsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.PageFooter = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass PageFooter extends react_1.default.PureComponent {\r\n    render() {\r\n        return (react_1.default.createElement(\"div\", { className: \"pageFooter\" },\r\n            react_1.default.createElement(\"a\", { className: \"closePage\", href: \"javascript:window.close()\" }, \"\\u623B\\u308B\")));\r\n    }\r\n}\r\nexports.PageFooter = PageFooter;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/PageFooter.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/PageTitle.tsx":
/*!****************************************************!*\
  !*** ./js/classic-layout/components/PageTitle.tsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.PageTitle = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass PageTitle extends react_1.default.PureComponent {\r\n    render() {\r\n        return react_1.default.createElement(\"h3\", { className: \"pageTitle\" }, \"\\u30D7\\u30EC\\u30A4\\u5C65\\u6B74\");\r\n    }\r\n}\r\nexports.PageTitle = PageTitle;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/PageTitle.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/RootComponent.tsx":
/*!********************************************************!*\
  !*** ./js/classic-layout/components/RootComponent.tsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RootComponent = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst parser_1 = __webpack_require__(/*! ../parser */ \"./js/classic-layout/parser.ts\");\r\nconst CreditInfo_1 = __webpack_require__(/*! ./CreditInfo */ \"./js/classic-layout/components/CreditInfo.tsx\");\r\nconst PageFooter_1 = __webpack_require__(/*! ./PageFooter */ \"./js/classic-layout/components/PageFooter.tsx\");\r\nconst PageTitle_1 = __webpack_require__(/*! ./PageTitle */ \"./js/classic-layout/components/PageTitle.tsx\");\r\nconst ScorePageContainer_1 = __webpack_require__(/*! ./ScorePageContainer */ \"./js/classic-layout/components/ScorePageContainer.tsx\");\r\nconst SectionSeparator_1 = __webpack_require__(/*! ./SectionSeparator */ \"./js/classic-layout/components/SectionSeparator.tsx\");\r\nfunction padNumberWithZeros(n, len) {\r\n    len = len || 2;\r\n    return n.toString().padStart(len, \"0\");\r\n}\r\nfunction formatDate(dt) {\r\n    return (dt.getFullYear() +\r\n        \"-\" +\r\n        padNumberWithZeros(dt.getMonth() + 1) +\r\n        \"-\" +\r\n        padNumberWithZeros(dt.getDate()) +\r\n        \" \" +\r\n        padNumberWithZeros(dt.getHours()) +\r\n        \":\" +\r\n        padNumberWithZeros(dt.getMinutes()));\r\n}\r\nfunction getQueryParam(qp, key, fallback) {\r\n    const value = qp.get(key);\r\n    if (!value) {\r\n        console.warn('URL does not contain \"' + key + '\", using default value \"' + fallback + '\"');\r\n        return fallback;\r\n    }\r\n    return value;\r\n}\r\nfunction parseQueryParams(qp, dft) {\r\n    const date = getQueryParam(qp, \"dt\", dft.date);\r\n    const track = getQueryParam(qp, \"tk\", dft.track);\r\n    const difficulty = getQueryParam(qp, \"df\", dft.difficulty);\r\n    const songTitle = getQueryParam(qp, \"st\", dft.songTitle);\r\n    const achievement = getQueryParam(qp, \"ac\", dft.achievement);\r\n    const highScore = getQueryParam(qp, \"hs\", dft.highScore);\r\n    const combo = getQueryParam(qp, \"cb\", dft.combo);\r\n    const noteDetails = getQueryParam(qp, \"nd\", dft.noteDetails);\r\n    const syncStatus = getQueryParam(qp, \"sc\", dft.syncStatus);\r\n    return {\r\n        date,\r\n        track,\r\n        songTitle,\r\n        difficulty,\r\n        syncStatus,\r\n        noteJudgements: parser_1.parseJudgements(noteDetails),\r\n        combo: combo && combo.replace(\"/\", \" / \"),\r\n        highScore: highScore === \"1\",\r\n        achievement: parseFloat(achievement),\r\n    };\r\n}\r\nclass RootComponent extends react_1.default.PureComponent {\r\n    constructor(props) {\r\n        super(props);\r\n        this.fetchRankImage = (title) => {\r\n            console.log(\"fetchRankImage \" + title);\r\n            this.state.rankImg.set(title, null);\r\n            this.sendMessageToOpener({ action: \"getRankImage\", payload: title });\r\n        };\r\n        this.handleWindowMessage = (evt) => {\r\n            if (evt.origin === \"https://maimaidx-eng.com\" || evt.origin === \"https://maimaidx.jp\") {\r\n                switch (evt.data.action) {\r\n                    case \"songImage\":\r\n                        this.setState({ songImg: evt.data.imgSrc });\r\n                        break;\r\n                    case \"apFcImage\":\r\n                        this.setState({ apFcImg: URL.createObjectURL(evt.data.img) });\r\n                        break;\r\n                    case \"syncImage\":\r\n                        this.setState({ syncImg: URL.createObjectURL(evt.data.img) });\r\n                        break;\r\n                    case \"rankImage\":\r\n                        this.setState((state) => {\r\n                            const existingUrl = state.rankImg.get(evt.data.title);\r\n                            if (existingUrl) {\r\n                                URL.revokeObjectURL(existingUrl);\r\n                            }\r\n                            const map = new Map(state.rankImg);\r\n                            map.set(evt.data.title, URL.createObjectURL(evt.data.img));\r\n                            return { rankImg: map };\r\n                        });\r\n                        break;\r\n                    default:\r\n                        console.log(evt.data);\r\n                        break;\r\n                }\r\n            }\r\n        };\r\n        if (window.opener && document.referrer) {\r\n            this.openerOrigin = new URL(document.referrer).origin;\r\n        }\r\n        const qp = new URLSearchParams(document.location.search);\r\n        const defaultState = {\r\n            date: formatDate(new Date()),\r\n            track: \"TRACK \" + (Math.floor(Math.random() * 3) + 1),\r\n            //difficulty: \"MASTER\",\r\n            songTitle: \"分からない\",\r\n            achievement: \"95.3035%\",\r\n            highScore: Math.random() > 0.9 ? \"1\" : \"0\",\r\n            //combo: \"234/953\",\r\n            noteDetails: \"654-96-31-28\\n25-0-0-0\\n78-0-0-1\\n\\n37-2-1-0\",\r\n        };\r\n        try {\r\n            this.state = Object.assign(Object.assign({}, parseQueryParams(qp, defaultState)), { rankImg: new Map() });\r\n        }\r\n        catch (e) {\r\n            console.error(e.message);\r\n            console.error(e.stack);\r\n            this.state = Object.assign(Object.assign({}, parseQueryParams(new URLSearchParams(\"\"), defaultState)), { rankImg: new Map(), showError: true });\r\n        }\r\n    }\r\n    componentDidMount() {\r\n        document.title = this.state.songTitle + \" - maimai classic score layout\";\r\n        window.addEventListener(\"message\", this.handleWindowMessage);\r\n        this.sendMessageToOpener({ action: \"ready\" });\r\n    }\r\n    render() {\r\n        const { achievement, combo, date, difficulty, highScore, noteJudgements, songTitle, track, songImg, apFcImg, rankImg, syncImg, syncStatus, showError, } = this.state;\r\n        return (react_1.default.createElement(react_1.default.Fragment, null,\r\n            react_1.default.createElement(\"div\", { className: \"widthLimit\" },\r\n                react_1.default.createElement(\"div\", { className: \"container\" },\r\n                    react_1.default.createElement(PageTitle_1.PageTitle, null),\r\n                    react_1.default.createElement(SectionSeparator_1.SectionSep, null),\r\n                    showError ? (react_1.default.createElement(\"div\", { className: \"error\" }, \"Failed to parse input. Please contact the developer!\")) : (react_1.default.createElement(ScorePageContainer_1.ScorePageContainer, { achievement: achievement, combo: combo, date: date, difficulty: difficulty, highScore: highScore, noteJudgements: noteJudgements, songTitle: songTitle, track: track, syncStatus: syncStatus, songImgSrc: songImg, apFcImg: apFcImg, rankImg: rankImg, syncImg: syncImg, fetchRankImage: this.fetchRankImage })),\r\n                    react_1.default.createElement(SectionSeparator_1.SectionSep, null),\r\n                    react_1.default.createElement(PageFooter_1.PageFooter, null))),\r\n            react_1.default.createElement(CreditInfo_1.CreditInfo, null)));\r\n    }\r\n    sendMessageToOpener(data) {\r\n        if (this.openerOrigin) {\r\n            console.log(\"sending message to opener\", data);\r\n            window.opener.postMessage(data, this.openerOrigin);\r\n        }\r\n    }\r\n}\r\nexports.RootComponent = RootComponent;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/RootComponent.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/ScorePage.tsx":
/*!****************************************************!*\
  !*** ./js/classic-layout/components/ScorePage.tsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.ScorePage = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst number_helper_1 = __webpack_require__(/*! ../../common/number-helper */ \"./js/common/number-helper.ts\");\r\nconst rank_functions_1 = __webpack_require__(/*! ../../common/rank-functions */ \"./js/common/rank-functions.ts\");\r\nconst AchievementInfo_1 = __webpack_require__(/*! ./AchievementInfo */ \"./js/classic-layout/components/AchievementInfo.tsx\");\r\nconst DateAndPlace_1 = __webpack_require__(/*! ./DateAndPlace */ \"./js/classic-layout/components/DateAndPlace.tsx\");\r\nconst JudgementContainer_1 = __webpack_require__(/*! ./JudgementContainer */ \"./js/classic-layout/components/JudgementContainer.tsx\");\r\nconst SongImg_1 = __webpack_require__(/*! ./SongImg */ \"./js/classic-layout/components/SongImg.tsx\");\r\nconst SongInfo_1 = __webpack_require__(/*! ./SongInfo */ \"./js/classic-layout/components/SongInfo.tsx\");\r\nconst LOSS_PREFIX = \"-\";\r\nfunction getNextDisplayMode(m) {\r\n    switch (m) {\r\n        case \"NORMAL\" /* NORMAL */:\r\n            return \"LOSS\" /* LOSS */;\r\n        case \"LOSS\" /* LOSS */:\r\n            return \"DETAIL\" /* DETAIL */;\r\n        default:\r\n            return \"NORMAL\" /* NORMAL */;\r\n    }\r\n}\r\nfunction formatLossNumber(loss, digits) {\r\n    if (digits) {\r\n        return LOSS_PREFIX + number_helper_1.formatFloat(loss, digits) + \"%\";\r\n    }\r\n    return LOSS_PREFIX + loss.toLocaleString(\"en\");\r\n}\r\nclass ScorePage extends react_1.default.PureComponent {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.state = { isDxMode: false, displayMode: \"NORMAL\" /* NORMAL */ };\r\n        this.toggleDxMode = () => {\r\n            this.setState((state) => {\r\n                const isDxMode = !state.isDxMode;\r\n                const { displayMode } = state;\r\n                const displayNoteJudgements = this.getNoteJudgementLoss(isDxMode, displayMode);\r\n                const displayScorePerType = this.getDisplayScorePerType(isDxMode, displayMode);\r\n                return { isDxMode, displayNoteJudgements, displayScorePerType };\r\n            });\r\n        };\r\n        this.toggleDisplayMode = () => {\r\n            this.setState((state) => {\r\n                const displayMode = getNextDisplayMode(state.displayMode);\r\n                const { isDxMode } = state;\r\n                const displayNoteJudgements = this.getNoteJudgementLoss(isDxMode, displayMode);\r\n                const displayScorePerType = this.getDisplayScorePerType(isDxMode, displayMode);\r\n                return { displayMode, displayNoteJudgements, displayScorePerType };\r\n            });\r\n        };\r\n    }\r\n    render() {\r\n        const { achievement, apFcImg, rankImg, syncImg, highScore, date, songTitle, track, difficulty, songImgSrc, noteJudgements, combo, syncStatus, apFcStatus, finaleAchievement, maxFinaleScore, breakDistribution, totalJudgements, playerScorePerType, } = this.props;\r\n        const { isDxMode, displayMode, displayScorePerType, displayNoteJudgements } = this.state;\r\n        return (react_1.default.createElement(\"div\", { className: \"songScoreContainer\" },\r\n            react_1.default.createElement(DateAndPlace_1.DateAndPlace, { date: date, isDxMode: isDxMode, toggleDxMode: this.toggleDxMode }),\r\n            react_1.default.createElement(\"div\", { className: \"songScoreBody\" },\r\n                react_1.default.createElement(\"hr\", { className: \"trackTopLine\" }),\r\n                react_1.default.createElement(SongInfo_1.SongInfo, { songTitle: songTitle, track: track, difficulty: difficulty }),\r\n                react_1.default.createElement(SongImg_1.SongImg, { imgSrc: songImgSrc }),\r\n                react_1.default.createElement(AchievementInfo_1.AchievementInfo, { apFcStatus: apFcStatus, apFcImg: apFcImg, rankImgMap: rankImg, syncStatus: syncStatus, syncImg: syncImg, isDxMode: isDxMode, isHighScore: highScore, dxAchv: achievement, finaleAchv: finaleAchievement, maxFinaleAchv: maxFinaleScore, showMaxAchv: displayMode !== \"NORMAL\" /* NORMAL */, toggleDisplayMode: this.toggleDisplayMode, fetchRankImage: this.props.fetchRankImage }),\r\n                react_1.default.createElement(JudgementContainer_1.JudgementContainer, { noteJudgements: displayNoteJudgements || noteJudgements, breakDistribution: breakDistribution, totalJudgements: displayNoteJudgements ? displayNoteJudgements.get(\"total\") : totalJudgements, scorePerType: displayScorePerType || playerScorePerType, nextRank: this.getNextRankEntry(isDxMode), combo: combo, isDxMode: isDxMode, displayMode: displayMode }))));\r\n    }\r\n    getNextRankEntry(isDxMode) {\r\n        const achv = isDxMode ? this.props.achievement : this.props.finaleAchievement;\r\n        if (isDxMode) {\r\n            if (achv === 101) {\r\n                return undefined;\r\n            }\r\n            else if (achv >= 100.5) {\r\n                return {\r\n                    title: \"AP+\",\r\n                    diff: 101 - achv,\r\n                };\r\n            }\r\n            const nextRankDef = rank_functions_1.RANK_DEFINITIONS[rank_functions_1.getRankIndexByAchievement(achv) - 1];\r\n            return {\r\n                title: nextRankDef.title,\r\n                diff: nextRankDef.th - achv,\r\n            };\r\n        }\r\n        let nextRank;\r\n        this.props.finaleBorder.forEach((diff, title) => {\r\n            if (diff > 0 && !nextRank) {\r\n                nextRank = { title, diff };\r\n            }\r\n        });\r\n        return nextRank;\r\n    }\r\n    getNoteJudgementLoss(isDxMode, displayMode) {\r\n        if (displayMode === \"LOSS\" /* LOSS */) {\r\n            const lossDetail = isDxMode ? this.props.achvLossDetail.dx : this.props.achvLossDetail.finale;\r\n            const digits = isDxMode ? 2 : 0;\r\n            const map = new Map();\r\n            lossDetail.forEach((d, noteType) => {\r\n                map.set(noteType, {\r\n                    perfect: formatLossNumber(d.perfect, digits),\r\n                    great: formatLossNumber(d.great, digits),\r\n                    good: formatLossNumber(d.good, digits),\r\n                    miss: formatLossNumber(d.miss, digits),\r\n                });\r\n            });\r\n            return map;\r\n        }\r\n    }\r\n    getDisplayScorePerType(isDxMode, displayMode) {\r\n        const { achvLossDetail } = this.props;\r\n        const lossDetail = isDxMode ? achvLossDetail.dx : achvLossDetail.finale;\r\n        if (displayMode === \"LOSS\" /* LOSS */) {\r\n            const digits = isDxMode ? 4 : 0;\r\n            const displayScorePerType = new Map();\r\n            lossDetail.forEach((detail, noteType) => {\r\n                const isMax = detail.total === 0;\r\n                const score = formatLossNumber(detail.total, digits);\r\n                displayScorePerType.set(noteType, { isMax, score });\r\n            });\r\n            return displayScorePerType;\r\n        }\r\n        return isDxMode ? this.props.dxAchvPerType : this.props.playerScorePerType;\r\n    }\r\n}\r\nexports.ScorePage = ScorePage;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/ScorePage.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/ScorePageContainer.tsx":
/*!*************************************************************!*\
  !*** ./js/classic-layout/components/ScorePageContainer.tsx ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.ScorePageContainer = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst scoreCalc_1 = __webpack_require__(/*! ../scoreCalc */ \"./js/classic-layout/scoreCalc.ts\");\r\nconst ScorePage_1 = __webpack_require__(/*! ./ScorePage */ \"./js/classic-layout/components/ScorePage.tsx\");\r\nfunction calculateTotalJudgements(noteJudgements) {\r\n    const res = { perfect: 0, great: 0, good: 0, miss: 0 };\r\n    noteJudgements.forEach((noteJ) => {\r\n        Object.keys(noteJ).forEach((rawJ) => {\r\n            let j = rawJ;\r\n            const count = noteJ[j];\r\n            if (j === \"cp\") {\r\n                j = \"perfect\";\r\n            }\r\n            res[j] += count;\r\n        });\r\n    });\r\n    return res;\r\n}\r\nfunction calculateApFcStatus(totalJudgements, finaleBorder) {\r\n    if (totalJudgements.miss) {\r\n        return null;\r\n    }\r\n    else if (finaleBorder.get(\"AP+\") === 0) {\r\n        return \"AP+\";\r\n    }\r\n    else if (totalJudgements.good) {\r\n        return \"FC\";\r\n    }\r\n    else if (totalJudgements.great) {\r\n        return \"FC+\";\r\n    }\r\n    return \"AP\";\r\n}\r\nclass ScorePageContainer extends react_1.default.PureComponent {\r\n    static getDerivedStateFromProps(nextProps) {\r\n        const info = scoreCalc_1.calculateScoreInfo(nextProps.noteJudgements, nextProps.achievement);\r\n        const totalJudgements = calculateTotalJudgements(nextProps.noteJudgements);\r\n        const apFcStatus = calculateApFcStatus(totalJudgements, info.finaleBorder);\r\n        return Object.assign(Object.assign({}, info), { totalJudgements, apFcStatus });\r\n    }\r\n    render() {\r\n        return react_1.default.createElement(ScorePage_1.ScorePage, Object.assign({}, this.props, this.state));\r\n    }\r\n}\r\nexports.ScorePageContainer = ScorePageContainer;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/ScorePageContainer.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/SectionSeparator.tsx":
/*!***********************************************************!*\
  !*** ./js/classic-layout/components/SectionSeparator.tsx ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.SectionSep = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass SectionSep extends react_1.default.PureComponent {\r\n    render() {\r\n        return react_1.default.createElement(\"div\", { className: \"pageSectionSeparator\" });\r\n    }\r\n    ;\r\n}\r\nexports.SectionSep = SectionSep;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/SectionSeparator.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/SongImg.tsx":
/*!**************************************************!*\
  !*** ./js/classic-layout/components/SongImg.tsx ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.SongImg = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass SongImg extends react_1.default.PureComponent {\r\n    render() {\r\n        const { imgSrc } = this.props;\r\n        return (react_1.default.createElement(\"div\", { className: \"songImgContainer\" },\r\n            (imgSrc\r\n                ? react_1.default.createElement(\"img\", { className: \"songImg\", src: imgSrc, alt: \"\" })\r\n                : react_1.default.createElement(\"div\", { className: \"songImg songImgPlaceholder\" })),\r\n            react_1.default.createElement(\"div\", { className: \"songImgReflecContainer\" }, this.getReflecElement(imgSrc))));\r\n    }\r\n    getReflecElement(imgSrc) {\r\n        if (imgSrc) {\r\n            const style = { backgroundImage: `url(\"${imgSrc}\")` };\r\n            return react_1.default.createElement(\"div\", { className: \"songImgReflec\", style: style });\r\n        }\r\n        return react_1.default.createElement(\"div\", { className: \"songImgPlaceholder songImgReflecPlaceholder\" });\r\n    }\r\n}\r\nexports.SongImg = SongImg;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/SongImg.tsx?");

/***/ }),

/***/ "./js/classic-layout/components/SongInfo.tsx":
/*!***************************************************!*\
  !*** ./js/classic-layout/components/SongInfo.tsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.SongInfo = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst wiki_link_1 = __webpack_require__(/*! ../../common/wiki-link */ \"./js/common/wiki-link.ts\");\r\nconst DifficultyInfo = react_1.default.memo((props) => {\r\n    const { difficulty } = props;\r\n    if (!difficulty) {\r\n        return null;\r\n    }\r\n    const difficultyClass = difficulty.toLowerCase().replace(\":\", \"\");\r\n    return (react_1.default.createElement(\"span\", { className: \"difficulty \" + difficultyClass },\r\n        \"\\u3010\",\r\n        react_1.default.createElement(\"span\", { id: \"difficulty\" }, difficulty),\r\n        \"\\u3011\"));\r\n});\r\nclass SongInfo extends react_1.default.PureComponent {\r\n    render() {\r\n        const { songTitle, track, difficulty } = this.props;\r\n        return (react_1.default.createElement(\"div\", { className: \"songInfoContainer\" },\r\n            react_1.default.createElement(\"div\", null,\r\n                react_1.default.createElement(\"span\", { className: \"track\", id: \"track\" }, track),\r\n                react_1.default.createElement(DifficultyInfo, { difficulty: difficulty })),\r\n            react_1.default.createElement(\"h2\", { className: \"songTitle\", id: \"songTitle\" },\r\n                react_1.default.createElement(\"a\", { className: \"songWikiLink\", href: wiki_link_1.getZhWikiLink(songTitle), target: \"_blank\" }, songTitle))));\r\n    }\r\n}\r\nexports.SongInfo = SongInfo;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/components/SongInfo.tsx?");

/***/ }),

/***/ "./js/classic-layout/constants.ts":
/*!****************************************!*\
  !*** ./js/classic-layout/constants.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.EMPTY_JUDGEMENT_OBJ = exports.BREAK_BONUS_MULTIPLIER = exports.BREAK_BASE_SCORE_MULTIPLIER = exports.MAX_BREAK_POINTS = exports.BREAK_BONUS_POINTS = exports.REGULAR_BASE_SCORE_MULTIPLIER = exports.BASE_SCORE_PER_TYPE = exports.DX_NOTE_TYPES = void 0;\r\nexports.DX_NOTE_TYPES = [\"tap\", \"hold\", \"slide\", \"touch\", \"break\"];\r\nexports.BASE_SCORE_PER_TYPE = {\r\n    tap: 500,\r\n    hold: 1000,\r\n    touch: 500,\r\n    slide: 1500,\r\n    break: 2500\r\n};\r\nexports.REGULAR_BASE_SCORE_MULTIPLIER = { cp: 1, perfect: 1, great: 0.8, good: 0.5, miss: 0 };\r\nexports.BREAK_BONUS_POINTS = 100;\r\nexports.MAX_BREAK_POINTS = (exports.BASE_SCORE_PER_TYPE.break + exports.BREAK_BONUS_POINTS);\r\nexports.BREAK_BASE_SCORE_MULTIPLIER = new Map([\r\n    [exports.MAX_BREAK_POINTS, 1],\r\n    [2550, 1],\r\n    [2500, 1],\r\n    [2000, 0.8],\r\n    [1500, 0.6],\r\n    [1250, 0.5],\r\n    [1000, 0.4],\r\n    [0, 0]\r\n]);\r\nexports.BREAK_BONUS_MULTIPLIER = new Map([\r\n    [exports.MAX_BREAK_POINTS, 1],\r\n    [2550, 0.75],\r\n    [2500, 0.5],\r\n    [2000, 0.4],\r\n    [1500, 0.4],\r\n    [1250, 0.4],\r\n    [1000, 0.3],\r\n    [0, 0]\r\n]);\r\nexports.EMPTY_JUDGEMENT_OBJ = {\r\n    perfect: 0,\r\n    great: 0,\r\n    good: 0,\r\n    miss: 0,\r\n};\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/constants.ts?");

/***/ }),

/***/ "./js/classic-layout/judgementsHelper.ts":
/*!***********************************************!*\
  !*** ./js/classic-layout/judgementsHelper.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.convertJudgementsToArray = void 0;\r\nfunction convertJudgementsToArray(jarr) {\r\n    if (typeof jarr.cp === \"number\") {\r\n        return [jarr.cp, jarr.perfect, jarr.great, jarr.good, jarr.miss];\r\n    }\r\n    return [jarr.perfect, jarr.great, jarr.good, jarr.miss];\r\n}\r\nexports.convertJudgementsToArray = convertJudgementsToArray;\r\n;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/judgementsHelper.ts?");

/***/ }),

/***/ "./js/classic-layout/main.tsx":
/*!************************************!*\
  !*** ./js/classic-layout/main.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ \"react-dom\"));\r\nconst RootComponent_1 = __webpack_require__(/*! ./components/RootComponent */ \"./js/classic-layout/components/RootComponent.tsx\");\r\nreact_dom_1.default.render(react_1.default.createElement(RootComponent_1.RootComponent, null), document.getElementById(\"root\"));\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/main.tsx?");

/***/ }),

/***/ "./js/classic-layout/parser.ts":
/*!*************************************!*\
  !*** ./js/classic-layout/parser.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.parseJudgements = void 0;\r\nconst ZERO_JUDGEMENT = {\r\n    cp: 0, perfect: 0, great: 0, good: 0, miss: 0,\r\n};\r\nfunction parseNumArrayFromText(line, fallback) {\r\n    const textArr = line.match(/\\d+/g);\r\n    if (!textArr) {\r\n        return fallback;\r\n    }\r\n    if (textArr.length < 4) {\r\n        throw new Error(\"Cannot parse note judgements\");\r\n    }\r\n    const numArr = textArr.map((num) => parseInt(num, 10));\r\n    if (numArr.length > 4) {\r\n        return { cp: numArr[0], perfect: numArr[1], great: numArr[2], good: numArr[3], miss: numArr[4] };\r\n    }\r\n    return { perfect: numArr[0], great: numArr[1], good: numArr[2], miss: numArr[3] };\r\n}\r\nfunction parseJudgements(text) {\r\n    let jTextLines = text.split(\"_\");\r\n    if (jTextLines.length === 1) {\r\n        jTextLines = text.split(\"\\n\");\r\n    }\r\n    if (jTextLines.length < 4) {\r\n        throw new Error(\"Cannot parse note judgement lines\");\r\n    }\r\n    const judgementsPerType = new Map();\r\n    const breakJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);\r\n    judgementsPerType.set(\"break\", breakJ);\r\n    const touchJ = parseNumArrayFromText(jTextLines.pop(), undefined);\r\n    if (touchJ) {\r\n        judgementsPerType.set(\"touch\", touchJ);\r\n    }\r\n    const slideJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);\r\n    judgementsPerType.set(\"slide\", slideJ);\r\n    const holdJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);\r\n    judgementsPerType.set(\"hold\", holdJ);\r\n    const tapJ = parseNumArrayFromText(jTextLines.pop(), ZERO_JUDGEMENT);\r\n    judgementsPerType.set(\"tap\", tapJ);\r\n    return judgementsPerType;\r\n}\r\nexports.parseJudgements = parseJudgements;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/parser.ts?");

/***/ }),

/***/ "./js/classic-layout/scoreCalc.ts":
/*!****************************************!*\
  !*** ./js/classic-layout/scoreCalc.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.calculateScoreInfo = void 0;\r\nconst number_helper_1 = __webpack_require__(/*! ../common/number-helper */ \"./js/common/number-helper.ts\");\r\nconst achvLoss_1 = __webpack_require__(/*! ./achvLoss */ \"./js/classic-layout/achvLoss.ts\");\r\nconst backtracing_1 = __webpack_require__(/*! ./backtracing */ \"./js/classic-layout/backtracing.ts\");\r\nconst constants_1 = __webpack_require__(/*! ./constants */ \"./js/classic-layout/constants.ts\");\r\nconst judgementsHelper_1 = __webpack_require__(/*! ./judgementsHelper */ \"./js/classic-layout/judgementsHelper.ts\");\r\nfunction calculateBorder(totalBaseScore, breakCount, achievement, playerNoteScore) {\r\n    if (achievement === \"AP+\") {\r\n        return totalBaseScore + breakCount * constants_1.BREAK_BONUS_POINTS - playerNoteScore;\r\n    }\r\n    const rawBorder = totalBaseScore * achievement - playerNoteScore;\r\n    if (rawBorder < 0) {\r\n        return -1;\r\n    }\r\n    return number_helper_1.roundFloat(rawBorder, \"ceil\", 50);\r\n}\r\n/**\r\n * Given judgements per note type and player achievement (percentage from DX),\r\n * figure out its maimai FiNALE score and break distribution.\r\n * @param judgementsPerType Map<string, number[]>\r\n * @param playerAchievement number\r\n * @return various properties of playerScore\r\n */\r\nfunction calculateScoreInfo(judgementsPerType, playerAchievement) {\r\n    let totalBaseScore = 0;\r\n    let playerRegularNoteScore = 0;\r\n    const playerScorePerType = new Map([\r\n        [\"tap\", { score: 0, isMax: false }],\r\n        [\"hold\", { score: 0, isMax: false }],\r\n        [\"slide\", { score: 0, isMax: false }],\r\n        [\"touch\", { score: 0, isMax: false }],\r\n        [\"break\", { score: 0, isMax: false }],\r\n        [\"total\", { score: 0, isMax: false }],\r\n    ]);\r\n    const lostScorePerType = new Map();\r\n    judgementsPerType.forEach((judgements, noteType) => {\r\n        const noteBaseScore = constants_1.BASE_SCORE_PER_TYPE[noteType];\r\n        const count = number_helper_1.sum(Object.values(judgements));\r\n        const totalNoteScore = count * noteBaseScore;\r\n        totalBaseScore += totalNoteScore;\r\n        // We'll deal with player break score later.\r\n        if (noteType !== \"break\") {\r\n            let playerNoteScore = 0;\r\n            Object.keys(judgements).forEach((_j) => {\r\n                const j = _j;\r\n                const count = judgements[j];\r\n                playerNoteScore += count * noteBaseScore * constants_1.REGULAR_BASE_SCORE_MULTIPLIER[j];\r\n            });\r\n            const loss = totalNoteScore - playerNoteScore;\r\n            playerScorePerType.set(noteType, { score: playerNoteScore, isMax: loss === 0 });\r\n            lostScorePerType.set(noteType, loss);\r\n            playerRegularNoteScore += playerNoteScore;\r\n        }\r\n    });\r\n    // Figure out break distribution\r\n    const scorePerPercentage = totalBaseScore / 100;\r\n    const playerRegularNotePercentage = playerRegularNoteScore / scorePerPercentage;\r\n    const remainingAchievement = playerAchievement - playerRegularNotePercentage;\r\n    const basePercentagePerBreak = constants_1.BASE_SCORE_PER_TYPE.break / scorePerPercentage;\r\n    const validBreakDistributions = [];\r\n    const breakJudgements = judgementsPerType.get(\"break\");\r\n    backtracing_1.walkBreakDistributions(validBreakDistributions, new Map(), judgementsHelper_1.convertJudgementsToArray(breakJudgements), // Make a copy of breakJudgements\r\n    remainingAchievement, basePercentagePerBreak);\r\n    console.log(\"valid break distributions\", validBreakDistributions);\r\n    let breakDistribution = validBreakDistributions[0];\r\n    if (!breakDistribution) {\r\n        console.warn(\"Could not find a valid break distribution!\");\r\n        console.warn(\"Please report the issue to the developer.\");\r\n        // Assume the worst case\r\n        breakDistribution = new Map([\r\n            [constants_1.MAX_BREAK_POINTS, breakJudgements.cp || 0],\r\n            [2550, 0],\r\n            [2500, breakJudgements.perfect],\r\n            [2000, 0],\r\n            [1500, 0],\r\n            [1250, breakJudgements.great],\r\n            [1000, breakJudgements.good],\r\n            [0, breakJudgements.miss],\r\n        ]);\r\n    }\r\n    // Figure out FiNALE achievement\r\n    let totalBreakCount = 0;\r\n    let playerBreakNoteScore = 0;\r\n    breakDistribution.forEach((count, judgement) => {\r\n        totalBreakCount += count;\r\n        playerBreakNoteScore += count * judgement;\r\n    });\r\n    playerScorePerType.set(\"break\", {\r\n        score: playerBreakNoteScore,\r\n        isMax: totalBreakCount === breakDistribution.get(2600),\r\n    });\r\n    const playerTotalNoteScore = playerRegularNoteScore + playerBreakNoteScore;\r\n    const maxNoteScore = totalBaseScore + constants_1.BREAK_BONUS_POINTS * totalBreakCount;\r\n    playerScorePerType.set(\"total\", {\r\n        score: playerTotalNoteScore,\r\n        isMax: playerTotalNoteScore === maxNoteScore,\r\n    });\r\n    const finaleAchievement = number_helper_1.roundFloat(playerTotalNoteScore / scorePerPercentage, \"floor\", 0.01);\r\n    const finaleMaxAchievement = number_helper_1.roundFloat(maxNoteScore / scorePerPercentage, \"floor\", 0.01);\r\n    // Figure out player achv per note type\r\n    console.log(\"player score per note type\", playerScorePerType);\r\n    const dxAchvPerType = new Map();\r\n    dxAchvPerType.set(\"tap\", {\r\n        score: number_helper_1.roundFloat(playerScorePerType.get(\"tap\").score / scorePerPercentage, \"round\", 0.0001),\r\n        isMax: playerScorePerType.get(\"tap\").isMax,\r\n    });\r\n    dxAchvPerType.set(\"hold\", {\r\n        score: number_helper_1.roundFloat(playerScorePerType.get(\"hold\").score / scorePerPercentage, \"round\", 0.0001),\r\n        isMax: playerScorePerType.get(\"hold\").isMax,\r\n    });\r\n    dxAchvPerType.set(\"slide\", {\r\n        score: number_helper_1.roundFloat(playerScorePerType.get(\"slide\").score / scorePerPercentage, \"round\", 0.0001),\r\n        isMax: playerScorePerType.get(\"slide\").isMax,\r\n    });\r\n    dxAchvPerType.set(\"touch\", {\r\n        score: number_helper_1.roundFloat(playerScorePerType.get(\"touch\").score / scorePerPercentage, \"round\", 0.0001),\r\n        isMax: playerScorePerType.get(\"touch\").isMax,\r\n    });\r\n    dxAchvPerType.set(\"break\", {\r\n        score: number_helper_1.roundFloat(remainingAchievement, \"round\", 0.0001),\r\n        isMax: playerScorePerType.get(\"break\").isMax,\r\n    });\r\n    dxAchvPerType.set(\"total\", {\r\n        score: number_helper_1.roundFloat(playerAchievement, \"round\", 0.0001),\r\n        isMax: playerScorePerType.get(\"total\").isMax,\r\n    });\r\n    // Figure out achievement loss per note type\r\n    const achvLossDetail = achvLoss_1.calculateAchvLoss(judgementsPerType, breakDistribution, scorePerPercentage);\r\n    console.log(\"achievement loss detail\", achvLossDetail);\r\n    // Figure out score diff vs. higher ranks\r\n    const finaleBorder = new Map([\r\n        [\"S\", calculateBorder(totalBaseScore, totalBreakCount, 0.97, playerTotalNoteScore)],\r\n        [\"S+\", calculateBorder(totalBaseScore, totalBreakCount, 0.98, playerTotalNoteScore)],\r\n        [\"SS\", calculateBorder(totalBaseScore, totalBreakCount, 0.99, playerTotalNoteScore)],\r\n        [\"SS+\", calculateBorder(totalBaseScore, totalBreakCount, 0.995, playerTotalNoteScore)],\r\n        [\"SSS\", calculateBorder(totalBaseScore, totalBreakCount, 1, playerTotalNoteScore)],\r\n        [\"AP+\", calculateBorder(totalBaseScore, totalBreakCount, \"AP+\", playerTotalNoteScore)],\r\n    ]);\r\n    // Figure out percentage per note\r\n    const pctPerNoteType = new Map();\r\n    const pctPerTap = 500 / scorePerPercentage;\r\n    const bonusPctPerBreak = 1 / totalBreakCount;\r\n    pctPerNoteType.set(\"tap\", pctPerTap);\r\n    pctPerNoteType.set(\"hold\", pctPerTap * 2);\r\n    pctPerNoteType.set(\"slide\", pctPerTap * 3);\r\n    pctPerNoteType.set(\"touch\", pctPerTap);\r\n    pctPerNoteType.set(\"breakDx\", pctPerTap * 5 + bonusPctPerBreak);\r\n    pctPerNoteType.set(\"break\", pctPerTap * 5.2);\r\n    return {\r\n        finaleAchievement,\r\n        maxFinaleScore: finaleMaxAchievement,\r\n        breakDistribution,\r\n        achvLossDetail,\r\n        finaleBorder,\r\n        pctPerNoteType,\r\n        playerScorePerType,\r\n        dxAchvPerType,\r\n    };\r\n}\r\nexports.calculateScoreInfo = calculateScoreInfo;\r\n\n\n//# sourceURL=webpack:///./js/classic-layout/scoreCalc.ts?");

/***/ }),

/***/ "./js/common/number-helper.ts":
/*!************************************!*\
  !*** ./js/common/number-helper.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.formatFloat = exports.roundFloat = exports.sum = exports.compareNumber = void 0;\r\nfunction compareNumber(a, b) {\r\n    return a > b ? 1 : a < b ? -1 : 0;\r\n}\r\nexports.compareNumber = compareNumber;\r\nfunction sum(values) {\r\n    let total = 0;\r\n    for (const v of values) {\r\n        total += v;\r\n    }\r\n    return total;\r\n}\r\nexports.sum = sum;\r\nfunction roundFloat(num, method, unit) {\r\n    return Math[method](num / unit) * unit;\r\n}\r\nexports.roundFloat = roundFloat;\r\nfunction formatFloat(n, digits) {\r\n    if (n) {\r\n        return n.toFixed(digits);\r\n    }\r\n    return \"0\";\r\n}\r\nexports.formatFloat = formatFloat;\r\n\n\n//# sourceURL=webpack:///./js/common/number-helper.ts?");

/***/ }),

/***/ "./js/common/rank-functions.ts":
/*!*************************************!*\
  !*** ./js/common/rank-functions.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.getFinaleRankTitle = exports.getRankTitle = exports.getRankByAchievement = exports.getRankIndexByAchievement = exports.RANK_DEFINITIONS = void 0;\r\nexports.RANK_DEFINITIONS = [\r\n    { th: 100.5, factor: 14, title: \"SSS+\" },\r\n    { th: 100.0, factor: 13.5, title: \"SSS\" },\r\n    { th: 99.5, factor: 13.2, title: \"SS+\" },\r\n    { th: 99.0, factor: 13, title: \"SS\" },\r\n    { th: 98.0, factor: 12.7, title: \"S+\" },\r\n    { th: 97.0, factor: 12.5, title: \"S\" },\r\n    { th: 94.0, factor: 10.5, title: \"AAA\" },\r\n    { th: 90.0, factor: 9.5, title: \"AA\" },\r\n    { th: 80.0, factor: 8.5, title: \"A\" },\r\n    { th: 75.0, factor: 7.5, title: \"BBB\" },\r\n    { th: 70.0, factor: 7, title: \"BB\" },\r\n    { th: 60.0, factor: 6, title: \"B\" },\r\n    { th: 50.0, factor: 5, title: \"C\" },\r\n];\r\nfunction getRankIndexByAchievement(achievement) {\r\n    return exports.RANK_DEFINITIONS.findIndex((rank) => {\r\n        return achievement >= rank.th;\r\n    });\r\n}\r\nexports.getRankIndexByAchievement = getRankIndexByAchievement;\r\nfunction getRankByAchievement(achievement) {\r\n    const idx = getRankIndexByAchievement(achievement);\r\n    return idx < 0 ? null : exports.RANK_DEFINITIONS[idx];\r\n}\r\nexports.getRankByAchievement = getRankByAchievement;\r\nfunction getRankTitle(achievement) {\r\n    const rankDef = getRankByAchievement(achievement);\r\n    return rankDef ? rankDef.title : \"C\";\r\n}\r\nexports.getRankTitle = getRankTitle;\r\nfunction getFinaleRankTitle(achievement) {\r\n    return getRankTitle(achievement).replace(\"SSS+\", \"SSS\");\r\n}\r\nexports.getFinaleRankTitle = getFinaleRankTitle;\r\n\n\n//# sourceURL=webpack:///./js/common/rank-functions.ts?");

/***/ }),

/***/ "./js/common/wiki-link.ts":
/*!********************************!*\
  !*** ./js/common/wiki-link.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.getZhWikiLink = void 0;\r\nconst WIKI_URL_PREFIX = \"https://maimai.fandom.com/zh/wiki/\";\r\nconst WIKI_URL_SUFFIX = \"?variant=zh-hant\";\r\nfunction getZhWikiLink(title) {\r\n    return WIKI_URL_PREFIX + encodeURIComponent(title) + WIKI_URL_SUFFIX;\r\n}\r\nexports.getZhWikiLink = getZhWikiLink;\r\n\n\n//# sourceURL=webpack:///./js/common/wiki-link.ts?");

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