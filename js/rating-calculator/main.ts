import React from 'react';
import ReactDOM from 'react-dom';

import {LANG} from '../common/lang';
import {RootComponent} from './components/RootComponent';

document.title = {
  zh: "maimai DX R 值分析工具",
  en: "maimai DX Rating Analyzer",
}[LANG];

ReactDOM.render(React.createElement(RootComponent), document.getElementById("root"));
