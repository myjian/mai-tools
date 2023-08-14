import React from 'react';
import {createRoot} from 'react-dom/client';

import {RootComponent} from './RootComponent';
import './styles.css';

const root = createRoot(document.getElementById("root"));
root.render(<RootComponent />);
