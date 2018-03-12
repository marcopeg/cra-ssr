/*
    eslint
        import/prefer-default-export: off,
        react/prop-types: off
*/

import React from 'react'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'

import App from '../containers/App'

export const StaticRoot = ({ store, url, context }) => (
    <Provider store={store}>
        <StaticRouter location={url} context={context}>
            <App />
        </StaticRouter>
    </Provider>
)
