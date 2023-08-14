/**
 * A tool that takes DX score data, converts that to FiNALE score
 * (achievement rate, break distribution, etc.), and displays it
 * in old maimai-NET style.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {RootComponent} from './components/RootComponent';
import './css/styles.css';

ReactDOM.render(<RootComponent />, document.getElementById("root"));
