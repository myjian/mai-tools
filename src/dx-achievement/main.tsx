/**
 * A tool that takes FiNALE score data and converts that to DX score
 * (achievement rate, break distribution, etc.)
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {DxAchievementCalculator} from './DxAchievementCalculator';

ReactDOM.render(<DxAchievementCalculator />, document.getElementById("root"));
