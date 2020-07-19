import React from 'react';
import ReactDOM from 'react-dom';

import {RatingVisualizer} from './RatingVisualizer';

const queryParams = new URLSearchParams(document.location.search);
let lang = "en";
if (queryParams.get("hl")) {
  lang = queryParams.get("hl").startsWith("zh") ? "zh" : "en";
} else if (navigator.language.startsWith("zh")) {
  lang = "zh";
}

if (lang === "zh") {
  document.title = "maimai DX R 值視覺化互動式網頁";
}

ReactDOM.render(<RatingVisualizer />, document.getElementById("root"));
