/* global document */

// import React from 'react';
// import ReactDOM from 'react-dom';
// 
// import App from './containers/App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

import React from 'react'
import { render } from 'react-dom'
import { isReady } from './boot/store'
import Root from './boot/Root'
import './index.css'

isReady
    .then(() => render(<Root />, document.getElementById('root')))
    .catch((err) => {
        document.body.innerHTML = err ? err.message : 'unknown error'
        console.error(err) // eslint-disable-line
    })
