import React from 'react';
import ReactDOM from 'react-dom';

import {LANG, PAGE_TITLE} from './i18n';
import {RootComponent} from './RootComponent';

(document.children[0] as HTMLHtmlElement).lang = LANG === "zh" ? "zh-Hant" : "en-US";
document.title = PAGE_TITLE;

ReactDOM.render(<RootComponent />, document.getElementById("root"));
