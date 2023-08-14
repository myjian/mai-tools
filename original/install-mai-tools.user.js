// ==UserScript==
// @name         run mai-tools on all maimaidx-net pages
// @version      0.1
// @description  run mai-tools on all maimaidx-net pages
// @author       Ming-yuen Jien
// @match        https://maimaidx.jp/*
// @match        https://maimaidx-eng.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const s = document.createElement('script');
    const cacheBuster = Math.floor(Date.now()/60000);
    s.src = 'https://myjian.github.io/mai-tools/scripts/all-in-one.js?t=' + cacheBuster;
    document.body.append(s);
})();
