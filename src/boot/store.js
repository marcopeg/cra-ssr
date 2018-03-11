/* global window */

import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { routerMiddleware } from 'react-router-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import { reduxEventsMiddleware } from '../lib/redux-events-middleware'
import { configServices } from '../services'
import { configListeners } from '../listeners'
import reducers from '../reducers'

const initialState = {}
const enhancers = []
const middleware = [
    thunk,
    reduxEventsMiddleware,
]

// redux dev tools
if (process.env.NODE_ENV === 'development') {
    const { devToolsExtension } = window

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers,
)

export const store = createReduxStore(
    reducers,
    initialState,
    composedEnhancers,
)

export const history = createHistory()
export const connectedHistory = syncHistoryWithStore(history, store)

export const isReady = new Promise(async (resolve, reject) => {
    try {
        await configListeners()
        await configServices(store)
        resolve()
    } catch (err) {
        reject()
    }
})

if (process.env.NODE_ENV === 'development') {
    window.store = store
}
