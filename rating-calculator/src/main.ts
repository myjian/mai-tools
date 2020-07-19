import React from 'react';
import ReactDOM from 'react-dom';

import {RootComponent} from './components/RootComponent';
import {LANG} from './i18n';

document.title = {
  zh: "maimai DX R 值分析工具",
  en: "maimai DX Rating Analyzer",
}[LANG];

ReactDOM.render(React.createElement(RootComponent), document.getElementById("root"));
