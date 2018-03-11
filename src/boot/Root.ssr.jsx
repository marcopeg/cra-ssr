/*
    eslint
        react/prop-types: off
*/

import React from 'react'
import { Provider } from 'react-redux'
import { Router, StaticRouter } from 'react-router-dom'

import App from '../containers/App'

export const ShallowRoot = ({ store, history }) => (
    <Provider store={store}>
        <Router history={history}>
            <div />
        </Router>
    </Provider>
)

export const StaticRoot = ({ store, url, context }) => (
    <Provider store={store}>
        <StaticRouter location={url} context={context}>
            <App />
        </StaticRouter>
    </Provider>
)
