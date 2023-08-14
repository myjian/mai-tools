// Better font smoothing by forcing browser-default font
// https://poe.com/s/ZvbZoqIhJV0TxF9pfQ6G

// Create a <style> element
var styleElement = document.createElement('style');

// Set the CSS rule to force browser default font
var cssCode = '* { font-family: inherit !important; }';

// Append the CSS code to the <style> element
styleElement.appendChild(document.createTextNode(cssCode));

// Append the <style> element to the <head> section of the document
document.head.appendChild(styleElement);

// Use https://github.com/myjian/mai-tools
// Consider https://github.com/myjian/mai-tools/blob/gh-pages/install-mai-tools.user.js

(function() {
    'use strict';
    const s = document.createElement('script');
    const cacheBuster = Math.floor(Date.now()/60000);
    s.src = 'https://myjian.github.io/mai-tools/scripts/all-in-one.js?t=' + cacheBuster;
    document.body.append(s);
})();