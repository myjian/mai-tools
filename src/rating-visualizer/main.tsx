import React from 'react';
import ReactDOM from 'react-dom';

import {LANG} from '../common/lang';
import {RatingVisualizer} from './RatingVisualizer';

if (LANG === "zh") {
  document.title = "maimai DX R值圖表";
}

ReactDOM.render(<RatingVisualizer />, document.getElementById("root"));
