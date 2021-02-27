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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/rating-visualizer/main.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/common/lang.ts":
/*!***************************!*\
  !*** ./js/common/lang.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.LANG = void 0;\r\nconst queryParams = new URLSearchParams(document.location.search);\r\nlet lang = \"en\";\r\nif (queryParams.get(\"hl\")) {\r\n    lang = queryParams.get(\"hl\").startsWith(\"zh\") ? \"zh\" : \"en\";\r\n}\r\nelse if (navigator.language.startsWith(\"zh\")) {\r\n    lang = \"zh\";\r\n}\r\nexports.LANG = lang;\r\n\n\n//# sourceURL=webpack:///./js/common/lang.ts?");

/***/ }),

/***/ "./js/rating-visualizer/IntervalLines.tsx":
/*!************************************************!*\
  !*** ./js/rating-visualizer/IntervalLines.tsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.IntervalLines = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass IntervalLines extends react_1.default.PureComponent {\r\n    render() {\r\n        const { interval, heightUnit, onClick } = this.props;\r\n        const isCollapsed = interval[0] === interval[1];\r\n        let lowLabelBottom, highLabelBottom;\r\n        const lowLineBottom = lowLabelBottom = (interval[0] - 0.5) * heightUnit - 1;\r\n        const highLineBottom = highLabelBottom = (interval[1] + 0.5) * heightUnit;\r\n        const lowLineStyle = { bottom: lowLineBottom + \"px\" };\r\n        const highLineStyle = { bottom: highLineBottom + \"px\" };\r\n        if (isCollapsed) {\r\n            lowLabelBottom += 4;\r\n        }\r\n        else if (highLabelBottom - lowLabelBottom < 14) {\r\n            highLabelBottom += 2;\r\n            lowLabelBottom -= 5;\r\n        }\r\n        const lowLabelStyle = { bottom: lowLabelBottom + \"px\" };\r\n        const highLabelStyle = { bottom: highLabelBottom + \"px\" };\r\n        return (react_1.default.createElement(\"div\", { onClick: onClick },\r\n            react_1.default.createElement(\"div\", { className: \"intervalBoundary\", style: highLineStyle }),\r\n            react_1.default.createElement(\"div\", { className: \"intervalBoundary\", style: lowLineStyle }),\r\n            react_1.default.createElement(\"div\", { className: \"intervalLabel\", style: lowLabelStyle },\r\n                react_1.default.createElement(\"span\", { className: \"intervalLabelText axisLabelText\" }, interval[0])),\r\n            !isCollapsed && (react_1.default.createElement(\"div\", { className: \"intervalLabel\", style: highLabelStyle },\r\n                react_1.default.createElement(\"span\", { className: \"intervalLabelText axisLabelText\" }, interval[1])))));\r\n    }\r\n}\r\nexports.IntervalLines = IntervalLines;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/IntervalLines.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/LvLabel.tsx":
/*!******************************************!*\
  !*** ./js/rating-visualizer/LvLabel.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.LvLabel = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass LvLabel extends react_1.default.PureComponent {\r\n    render() {\r\n        const { canZoomIn, onClick, title } = this.props;\r\n        return (react_1.default.createElement(\"div\", { className: \"lvLabel\" },\r\n            react_1.default.createElement(\"div\", { className: \"lvLabelButtonContainer\" },\r\n                react_1.default.createElement(\"button\", { className: \"lvLabelButton\", disabled: !canZoomIn, onClick: onClick }, title))));\r\n    }\r\n}\r\nexports.LvLabel = LvLabel;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/LvLabel.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/LvRankRatingSegment.tsx":
/*!******************************************************!*\
  !*** ./js/rating-visualizer/LvRankRatingSegment.tsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.LvRankRatingSegment = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass LvRankRatingSegment extends react_1.default.PureComponent {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.minRt = 0;\r\n        this.maxRt = 0;\r\n        this.handleClick = () => {\r\n            this.props.highlightInterval(this.minRt, this.maxRt);\r\n        };\r\n    }\r\n    render() {\r\n        const { minLv, minAchv, rankFactor, maxLv, maxAchv, maxRankFactor, heightUnit, title, } = this.props;\r\n        this.minRt = Math.floor((minLv * minAchv * rankFactor) / 100);\r\n        this.maxRt = Math.floor((maxLv * maxAchv * (maxRankFactor || rankFactor)) / 100);\r\n        const style = {\r\n            bottom: (this.minRt - 0.5) * heightUnit + \"px\",\r\n            height: (this.maxRt - this.minRt + 1) * heightUnit + \"px\",\r\n        };\r\n        const className = \"ratingSegment \" + \"segment\" + title.replace(\"+\", \"P\");\r\n        return (react_1.default.createElement(\"div\", { className: className, style: style, title: this.hoverText(), tabIndex: 0, onClick: this.handleClick },\r\n            react_1.default.createElement(\"div\", { className: \"ratingSegmentLabel\" }, title)));\r\n    }\r\n    hoverText() {\r\n        if (this.minRt < this.maxRt) {\r\n            return `${this.minRt} - ${this.maxRt}`;\r\n        }\r\n        return this.maxRt.toString();\r\n    }\r\n}\r\nexports.LvRankRatingSegment = LvRankRatingSegment;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/LvRankRatingSegment.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/LvRatingContainer.tsx":
/*!****************************************************!*\
  !*** ./js/rating-visualizer/LvRatingContainer.tsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.LvRatingContainer = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst LvLabel_1 = __webpack_require__(/*! ./LvLabel */ \"./js/rating-visualizer/LvLabel.tsx\");\r\nconst LvRankRatingSegment_1 = __webpack_require__(/*! ./LvRankRatingSegment */ \"./js/rating-visualizer/LvRankRatingSegment.tsx\");\r\nclass LvRatingContainer extends react_1.default.PureComponent {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.handleLabelClick = () => {\r\n            const { lvTitle, minLv, maxLv } = this.props;\r\n            this.props.onZoomIn(lvTitle, minLv, maxLv);\r\n        };\r\n    }\r\n    render() {\r\n        const { canZoomIn, lvTitle, minLv, maxLv, heightUnit, containerHeight, ranks } = this.props;\r\n        const style = {\r\n            height: containerHeight + \"px\",\r\n        };\r\n        return (react_1.default.createElement(\"div\", { className: \"lvRatingContainer\", style: style },\r\n            react_1.default.createElement(LvLabel_1.LvLabel, { title: lvTitle, onClick: this.handleLabelClick, canZoomIn: canZoomIn }),\r\n            heightUnit ? ranks.map((rank) => (react_1.default.createElement(LvRankRatingSegment_1.LvRankRatingSegment, { key: rank.title, minLv: minLv, maxLv: maxLv, minAchv: rank.minAchv, maxAchv: rank.maxAchv, rankFactor: rank.rankFactor, maxRankFactor: rank.maxRankFactor, heightUnit: heightUnit, title: rank.title, highlightInterval: this.props.highlightInterval }))) : null));\r\n    }\r\n}\r\nexports.LvRatingContainer = LvRatingContainer;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/LvRatingContainer.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/OptionsInput.tsx":
/*!***********************************************!*\
  !*** ./js/rating-visualizer/OptionsInput.tsx ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.OptionsInput = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass OptionsInput extends react_1.default.PureComponent {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.handleChangeVersion = (evt) => {\r\n            console.log(evt.target);\r\n            const isPlus = evt.currentTarget.value === \"plus\";\r\n            this.props.onChangeDxPlus(isPlus);\r\n        };\r\n        this.handleChangeHeightUnit = (evt) => {\r\n            console.log(evt.target);\r\n            const unit = parseInt(evt.currentTarget.value);\r\n            this.props.onChangeUnit(unit);\r\n        };\r\n    }\r\n    render() {\r\n        const { minLv, maxLv, selectedLv, showZoomOutButton, onZoomOut, onFocus, onBlur, isDxPlus, } = this.props;\r\n        const lvDisplayed = selectedLv || `${minLv} - ${maxLv}`;\r\n        return (react_1.default.createElement(\"div\", { className: \"optionsContainer\" },\r\n            react_1.default.createElement(\"div\", { className: \"container\", onFocus: onFocus, onBlur: onBlur, tabIndex: -1 },\r\n                react_1.default.createElement(\"label\", { className: \"optionGroup\" },\r\n                    \"Game version:\\u00A0\",\r\n                    react_1.default.createElement(\"select\", { onChange: this.handleChangeVersion },\r\n                        react_1.default.createElement(\"option\", { value: \"dx\", selected: !isDxPlus }, \"DX\"),\r\n                        react_1.default.createElement(\"option\", { value: \"plus\", selected: isDxPlus }, \"DX+\"))),\r\n                react_1.default.createElement(\"label\", { className: \"optionGroup\" },\r\n                    \"Scale:\\u00A0\",\r\n                    react_1.default.createElement(\"select\", { onChange: this.handleChangeHeightUnit },\r\n                        react_1.default.createElement(\"option\", { value: \"0\" }, \"Hide\"),\r\n                        react_1.default.createElement(\"option\", { value: \"3\" }, \"3x\"),\r\n                        react_1.default.createElement(\"option\", { value: \"4\" }, \"4x\"),\r\n                        react_1.default.createElement(\"option\", { value: \"5\" }, \"5x\"),\r\n                        react_1.default.createElement(\"option\", { value: \"8\", selected: true }, \"8x\"),\r\n                        react_1.default.createElement(\"option\", { value: \"12\" }, \"12x\"))),\r\n                react_1.default.createElement(\"span\", { className: \"lvRangeLabelContainer\" },\r\n                    \"Showing\\u00A0Level\\u00A0\",\r\n                    react_1.default.createElement(\"span\", { className: \"lvRangeLabel\" }, lvDisplayed),\r\n                    showZoomOutButton && (react_1.default.createElement(\"button\", { className: \"resetZoomButton\", onClick: onZoomOut }, \"Reset\"))))));\r\n    }\r\n}\r\nexports.OptionsInput = OptionsInput;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/OptionsInput.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/RatingAxis.tsx":
/*!*********************************************!*\
  !*** ./js/rating-visualizer/RatingAxis.tsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RatingAxis = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nclass RatingAxis extends react_1.default.PureComponent {\r\n    render() {\r\n        const { step, maxRating, containerHeight, onClick } = this.props;\r\n        const containerStyle = {\r\n            height: containerHeight + \"px\",\r\n        };\r\n        const children = [];\r\n        let i = 0;\r\n        for (i = 0; i < maxRating; i += step) {\r\n            children.push(this.renderLabel(i));\r\n        }\r\n        children.push(this.renderLabel(i));\r\n        return (react_1.default.createElement(\"div\", { className: \"axisLabelContainer\", style: containerStyle, onClick: onClick }, children));\r\n    }\r\n    renderLabel(i) {\r\n        const childStyle = { bottom: i * this.props.heightUnit + \"px\" };\r\n        return (react_1.default.createElement(\"div\", { className: \"axisLabel\", style: childStyle },\r\n            react_1.default.createElement(\"span\", { className: \"axisLabelText\" }, i)));\r\n    }\r\n}\r\nexports.RatingAxis = RatingAxis;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/RatingAxis.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/RatingTable.tsx":
/*!**********************************************!*\
  !*** ./js/rating-visualizer/RatingTable.tsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RatingTable = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst MIN_RANK_TITLE = \"AAA\";\r\nclass RatingTable extends react_1.default.PureComponent {\r\n    render() {\r\n        const { levels } = this.props;\r\n        let { ranks } = this.props;\r\n        const rankLastIdx = ranks.findIndex((r) => r.title === MIN_RANK_TITLE);\r\n        ranks = ranks.slice(0, rankLastIdx + 1);\r\n        return (react_1.default.createElement(\"table\", { className: \"lookupTable\" },\r\n            react_1.default.createElement(\"thead\", { className: \"lookupTableHead\" },\r\n                react_1.default.createElement(\"tr\", null,\r\n                    react_1.default.createElement(\"th\", { className: \"lookupTopLeftCell\" }),\r\n                    ranks.map((r) => (react_1.default.createElement(\"th\", null, r.title))))),\r\n            react_1.default.createElement(\"tbody\", { className: \"lookupTableBody\" }, levels.map((lv) => {\r\n                return (react_1.default.createElement(\"tr\", null,\r\n                    react_1.default.createElement(\"th\", null, lv.title),\r\n                    ranks.map((r) => {\r\n                        const minRating = Math.floor(lv.minLv * r.minAchv * r.rankFactor * 0.01);\r\n                        const maxRating = Math.floor(lv.maxLv * r.maxAchv * (r.maxRankFactor || r.rankFactor) * 0.01);\r\n                        const text = minRating === maxRating ? minRating : `${minRating} - ${maxRating}`;\r\n                        return react_1.default.createElement(\"td\", null, text);\r\n                    })));\r\n            }))));\r\n    }\r\n}\r\nexports.RatingTable = RatingTable;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/RatingTable.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/RatingVisualizer.tsx":
/*!***************************************************!*\
  !*** ./js/rating-visualizer/RatingVisualizer.tsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RatingVisualizer = void 0;\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst constants_1 = __webpack_require__(/*! ./constants */ \"./js/rating-visualizer/constants.ts\");\r\nconst IntervalLines_1 = __webpack_require__(/*! ./IntervalLines */ \"./js/rating-visualizer/IntervalLines.tsx\");\r\nconst LvRatingContainer_1 = __webpack_require__(/*! ./LvRatingContainer */ \"./js/rating-visualizer/LvRatingContainer.tsx\");\r\nconst OptionsInput_1 = __webpack_require__(/*! ./OptionsInput */ \"./js/rating-visualizer/OptionsInput.tsx\");\r\nconst RatingAxis_1 = __webpack_require__(/*! ./RatingAxis */ \"./js/rating-visualizer/RatingAxis.tsx\");\r\nconst RatingTable_1 = __webpack_require__(/*! ./RatingTable */ \"./js/rating-visualizer/RatingTable.tsx\");\r\nclass RatingVisualizer extends react_1.default.PureComponent {\r\n    constructor(props) {\r\n        super(props);\r\n        this.removeIntervalTimeout = 0;\r\n        this.handleDxPlusChange = (isPlus) => {\r\n            this.setState({ isDxPlus: isPlus });\r\n            if (!isPlus && this.state.maxLv > 14) {\r\n                this.handleUnselectLv();\r\n            }\r\n        };\r\n        this.handleChangeHeightUnit = (unit) => {\r\n            this.setState({ heightUnit: unit });\r\n            if (unit === 0) {\r\n                this.removeHighlightInterval();\r\n            }\r\n        };\r\n        this.handleSelectLv = (lvTitle, minLv, maxLv) => {\r\n            this.setState({ selectedLvTitle: lvTitle, minLv, maxLv });\r\n        };\r\n        this.handleUnselectLv = () => {\r\n            this.setState({ minLv: undefined, maxLv: undefined, selectedLvTitle: undefined });\r\n        };\r\n        this.highlightInterval = (minRt, maxRt) => {\r\n            const curItvl = this.state.highlightInterval;\r\n            if (curItvl && curItvl[0] === minRt && curItvl[1] === maxRt) {\r\n                this.removeHighlightInterval();\r\n            }\r\n            else {\r\n                this.setState({ highlightInterval: [minRt, maxRt] });\r\n            }\r\n        };\r\n        this.removeHighlightInterval = () => {\r\n            console.log(\"removeInterval\");\r\n            console.log(document.activeElement);\r\n            this.removeIntervalTimeout = setTimeout(() => {\r\n                this.setState({ highlightInterval: undefined });\r\n                this.removeIntervalTimeout = 0;\r\n            }, 0);\r\n        };\r\n        this.cancelRemoveHighlightInterval = () => {\r\n            console.log(\"cancelRemove\");\r\n            console.log(document.activeElement);\r\n            if (this.removeIntervalTimeout) {\r\n                clearTimeout(this.removeIntervalTimeout);\r\n                this.removeIntervalTimeout = 0;\r\n            }\r\n        };\r\n        this.state = {\r\n            width: 30,\r\n            heightUnit: 8,\r\n            maxRating: constants_1.DX_MAX_RATING,\r\n            topPadding: 70,\r\n            isDxPlus: true,\r\n            axisLabelStep: 5,\r\n        };\r\n    }\r\n    render() {\r\n        const { isDxPlus, heightUnit, maxRating, axisLabelStep, highlightInterval, minLv, selectedLvTitle, } = this.state;\r\n        const levels = this.getLevels();\r\n        const ranks = isDxPlus ? constants_1.DX_PLUS_RANKS : constants_1.DX_RANKS;\r\n        const containerHeight = this.getContainerHeight();\r\n        const canZoomIn = !minLv;\r\n        return (react_1.default.createElement(\"div\", { className: \"ratingVisualizer\" },\r\n            react_1.default.createElement(OptionsInput_1.OptionsInput, { isDxPlus: isDxPlus, onChangeDxPlus: this.handleDxPlusChange, onChangeUnit: this.handleChangeHeightUnit, onZoomOut: this.handleUnselectLv, selectedLv: selectedLvTitle, minLv: levels[levels.length - 1].title, maxLv: levels[0].title, showZoomOutButton: !canZoomIn, onBlur: this.removeHighlightInterval, onFocus: this.cancelRemoveHighlightInterval }),\r\n            react_1.default.createElement(\"div\", { className: \"container\", onBlur: this.removeHighlightInterval, onFocus: this.cancelRemoveHighlightInterval, tabIndex: -1 },\r\n                react_1.default.createElement(\"div\", { className: \"ratingContainer\" },\r\n                    heightUnit ? (react_1.default.createElement(RatingAxis_1.RatingAxis, { maxRating: maxRating, heightUnit: heightUnit, containerHeight: containerHeight, step: axisLabelStep, onClick: this.removeHighlightInterval })) : null,\r\n                    levels.map((lv) => {\r\n                        return (react_1.default.createElement(LvRatingContainer_1.LvRatingContainer, { key: lv.title, canZoomIn: canZoomIn, lvTitle: lv.title, minLv: lv.minLv, maxLv: lv.maxLv, heightUnit: heightUnit, containerHeight: containerHeight, ranks: ranks, onZoomIn: this.handleSelectLv, highlightInterval: this.highlightInterval }));\r\n                    }),\r\n                    highlightInterval && (react_1.default.createElement(IntervalLines_1.IntervalLines, { interval: highlightInterval, heightUnit: heightUnit, onClick: this.removeHighlightInterval })))),\r\n            react_1.default.createElement(\"div\", { className: \"container\" },\r\n                react_1.default.createElement(RatingTable_1.RatingTable, { ranks: ranks, levels: levels }),\r\n                react_1.default.createElement(\"footer\", { className: \"footer\" },\r\n                    react_1.default.createElement(\"hr\", { className: \"footerSep\" }),\r\n                    react_1.default.createElement(\"span\", null, \"Made by \"),\r\n                    react_1.default.createElement(\"a\", { className: \"authorLink\", href: \"https://github.com/myjian\", target: \"_blank\" }, \"myjian\"),\r\n                    react_1.default.createElement(\"span\", null, \".\")))));\r\n    }\r\n    getLevels() {\r\n        const { minLv, isDxPlus } = this.state;\r\n        let { maxLv } = this.state;\r\n        if (minLv && maxLv) {\r\n            const lvs = [];\r\n            while (minLv <= maxLv) {\r\n                lvs.push({\r\n                    title: maxLv.toFixed(1),\r\n                    minLv: maxLv,\r\n                    maxLv: maxLv,\r\n                });\r\n                maxLv -= 0.1;\r\n            }\r\n            return lvs;\r\n        }\r\n        return isDxPlus ? constants_1.DX_PLUS_LEVELS : constants_1.DX_LEVELS;\r\n    }\r\n    getContainerHeight() {\r\n        const { axisLabelStep, maxRating, heightUnit, topPadding } = this.state;\r\n        return (maxRating + axisLabelStep) * heightUnit + topPadding;\r\n    }\r\n}\r\nexports.RatingVisualizer = RatingVisualizer;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/RatingVisualizer.tsx?");

/***/ }),

/***/ "./js/rating-visualizer/constants.ts":
/*!*******************************************!*\
  !*** ./js/rating-visualizer/constants.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.DX_LEVELS = exports.DX_PLUS_LEVELS = exports.DX_PLUS_RANKS = exports.DX_RANKS = exports.DX_MAX_RATING = void 0;\r\nexports.DX_MAX_RATING = 211; // 15.0 * 14 * 1.005\r\nexports.DX_RANKS = [\r\n    {\r\n        \"title\": \"SSS+\",\r\n        \"minAchv\": 100.5,\r\n        \"rankFactor\": 15,\r\n        \"maxAchv\": 100.5\r\n    },\r\n    {\r\n        \"title\": \"SSS\",\r\n        \"minAchv\": 100,\r\n        \"rankFactor\": 14,\r\n        \"maxAchv\": 100.4999\r\n    },\r\n    {\r\n        \"title\": \"SS+\",\r\n        \"minAchv\": 99.5,\r\n        \"rankFactor\": 13,\r\n        \"maxAchv\": 99.9999,\r\n        \"maxRankFactor\": 13.5\r\n    },\r\n    {\r\n        \"title\": \"SS\",\r\n        \"minAchv\": 99,\r\n        \"rankFactor\": 12,\r\n        \"maxAchv\": 99.4999\r\n    },\r\n    {\r\n        \"title\": \"S+\",\r\n        \"minAchv\": 98,\r\n        \"rankFactor\": 11,\r\n        \"maxAchv\": 98.9999\r\n    },\r\n    {\r\n        \"title\": \"S\",\r\n        \"minAchv\": 97,\r\n        \"rankFactor\": 10,\r\n        \"maxAchv\": 97.9999\r\n    },\r\n    {\r\n        \"title\": \"AAA\",\r\n        \"minAchv\": 94,\r\n        \"rankFactor\": 9.4,\r\n        \"maxAchv\": 96.9999\r\n    },\r\n    {\r\n        \"title\": \"AA\",\r\n        \"minAchv\": 90,\r\n        \"rankFactor\": 9,\r\n        \"maxAchv\": 93.99999\r\n    },\r\n    {\r\n        \"title\": \"A\",\r\n        \"minAchv\": 80,\r\n        \"rankFactor\": 8,\r\n        \"maxAchv\": 89.9999\r\n    }\r\n];\r\nexports.DX_PLUS_RANKS = [\r\n    {\r\n        \"title\": \"SSS+\",\r\n        \"minAchv\": 100.5,\r\n        \"rankFactor\": 14,\r\n        \"maxAchv\": 100.5\r\n    },\r\n    {\r\n        \"title\": \"SSS\",\r\n        \"minAchv\": 100,\r\n        \"rankFactor\": 13.5,\r\n        \"maxAchv\": 100.4999\r\n    },\r\n    {\r\n        \"title\": \"SS+\",\r\n        \"minAchv\": 99.5,\r\n        \"rankFactor\": 13.2,\r\n        \"maxAchv\": 99.9999\r\n    },\r\n    {\r\n        \"title\": \"SS\",\r\n        \"minAchv\": 99,\r\n        \"rankFactor\": 13,\r\n        \"maxAchv\": 99.4999\r\n    },\r\n    {\r\n        \"title\": \"S+\",\r\n        \"minAchv\": 98,\r\n        \"rankFactor\": 12.7,\r\n        \"maxAchv\": 98.9999\r\n    },\r\n    {\r\n        \"title\": \"S\",\r\n        \"minAchv\": 97,\r\n        \"rankFactor\": 12.5,\r\n        \"maxAchv\": 97.9999\r\n    },\r\n    {\r\n        \"title\": \"AAA\",\r\n        \"minAchv\": 94,\r\n        \"rankFactor\": 10.5,\r\n        \"maxAchv\": 96.9999\r\n    },\r\n    {\r\n        \"title\": \"AA\",\r\n        \"minAchv\": 90,\r\n        \"rankFactor\": 9.5,\r\n        \"maxAchv\": 93.9999\r\n    },\r\n    {\r\n        \"title\": \"A\",\r\n        \"minAchv\": 80,\r\n        \"rankFactor\": 8.5,\r\n        \"maxAchv\": 89.9999\r\n    },\r\n];\r\nconst dxPlusLevels = [\r\n    { title: \"15\", minLv: 15.0, maxLv: 15.0 },\r\n    { title: \"14+\", minLv: 14.7, maxLv: 14.9 },\r\n    { title: \"14\", minLv: 14.0, maxLv: 14.6 },\r\n    { title: \"13+\", minLv: 13.7, maxLv: 13.9 },\r\n    { title: \"13\", minLv: 13.0, maxLv: 13.6 },\r\n    { title: \"12+\", minLv: 12.7, maxLv: 12.9 },\r\n    { title: \"12\", minLv: 12.0, maxLv: 12.6 },\r\n    { title: \"11+\", minLv: 11.7, maxLv: 11.9 },\r\n    { title: \"11\", minLv: 11.0, maxLv: 11.6 },\r\n    { title: \"10+\", minLv: 10.7, maxLv: 10.9 },\r\n    { title: \"10\", minLv: 10.0, maxLv: 10.6 },\r\n    { title: \"9+\", minLv: 9.7, maxLv: 9.9 },\r\n    { title: \"9\", minLv: 9.0, maxLv: 9.6 },\r\n    { title: \"8+\", minLv: 8.7, maxLv: 8.9 },\r\n    { title: \"8\", minLv: 8.0, maxLv: 8.6 },\r\n];\r\nexports.DX_PLUS_LEVELS = dxPlusLevels;\r\nconst dxLevels = exports.DX_PLUS_LEVELS.slice(2);\r\ndxLevels[0] = { title: \"14\", minLv: 14.0, maxLv: 14.0 };\r\nexports.DX_LEVELS = dxLevels;\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/constants.ts?");

/***/ }),

/***/ "./js/rating-visualizer/main.tsx":
/*!***************************************!*\
  !*** ./js/rating-visualizer/main.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst react_1 = __importDefault(__webpack_require__(/*! react */ \"react\"));\r\nconst react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ \"react-dom\"));\r\nconst lang_1 = __webpack_require__(/*! ../common/lang */ \"./js/common/lang.ts\");\r\nconst RatingVisualizer_1 = __webpack_require__(/*! ./RatingVisualizer */ \"./js/rating-visualizer/RatingVisualizer.tsx\");\r\nif (lang_1.LANG === \"zh\") {\r\n    document.title = \"maimai DX R 值視覺化互動式網頁\";\r\n}\r\nreact_dom_1.default.render(react_1.default.createElement(RatingVisualizer_1.RatingVisualizer, null), document.getElementById(\"root\"));\r\n\n\n//# sourceURL=webpack:///./js/rating-visualizer/main.tsx?");

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