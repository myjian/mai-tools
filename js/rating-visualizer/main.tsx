import React from 'react';
import ReactDOM from 'react-dom';

import {LANG} from '../common/lang';
import {RatingVisualizer} from './RatingVisualizer';

if (LANG === "zh") {
  document.title = "maimai DX R 值視覺化互動式網頁";
}

ReactDOM.render(<RatingVisualizer />, document.getElementById("root"));
