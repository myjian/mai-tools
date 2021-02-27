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
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/album-download-helper.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./scripts/album-download-helper.ts":
/*!******************************************!*\
  !*** ./scripts/album-download-helper.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n(function (d) {\r\n    const DIFF_REGEX = /music_(\\w+)_score_back/;\r\n    // 540 = 9 * 60 minutes = UTC+9 (Japan Time), 1 minute = 60000 milliseconds\r\n    const timezoneOffset = (540 + new Date().getTimezoneOffset()) * 60000;\r\n    function getPlayDate(row) {\r\n        const playDateText = row.getElementsByClassName(\"block_info\")[0].innerText;\r\n        const m = playDateText.match(/(\\d+)\\/(\\d+)\\/(\\d+) (\\d+):(\\d+)/);\r\n        const japanDt = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]));\r\n        return new Date(japanDt.valueOf() - timezoneOffset);\r\n    }\r\n    function padNumberWithZeros(n, len) {\r\n        len = len || 2;\r\n        return n.toString().padStart(len, \"0\");\r\n    }\r\n    function formatDate(dt) {\r\n        return (dt.getFullYear() +\r\n            \"-\" +\r\n            padNumberWithZeros(dt.getMonth() + 1) +\r\n            \"-\" +\r\n            padNumberWithZeros(dt.getDate()) +\r\n            \" \" +\r\n            padNumberWithZeros(dt.getHours()) +\r\n            \"-\" +\r\n            padNumberWithZeros(dt.getMinutes()));\r\n    }\r\n    function getFileName(row) {\r\n        const playDate = getPlayDate(row);\r\n        const songName = row.getElementsByClassName(\"black_block\")[0].innerText.replace(/<>:\"\\/\\\\\\|\\?\\*/g, \"-\");\r\n        const difficulty = row.className.match(DIFF_REGEX);\r\n        return difficulty\r\n            ? `${formatDate(playDate)} ${songName} ${difficulty[1].toUpperCase()}.jpg`\r\n            : `${formatDate(playDate)} ${songName}.jpg`;\r\n    }\r\n    function assignFilenameToPhoto(row) {\r\n        if (row.getElementsByTagName(\"a\").length) {\r\n            return;\r\n        }\r\n        const img = row.querySelector(\"img.w_430\");\r\n        const link = d.createElement(\"a\");\r\n        link.download = getFileName(row);\r\n        link.href = img.src;\r\n        img.insertAdjacentElement('beforebegin', link);\r\n        link.append(img);\r\n    }\r\n    function main() {\r\n        // Enable right click\r\n        document.body.oncontextmenu = null;\r\n        const rows = Array.from(d.getElementsByClassName(\"black_block\")).map((r) => r.parentElement);\r\n        for (const row of rows) {\r\n            assignFilenameToPhoto(row);\r\n        }\r\n    }\r\n    main();\r\n})(document);\r\n\n\n//# sourceURL=webpack:///./scripts/album-download-helper.ts?");

/***/ })

/******/ });