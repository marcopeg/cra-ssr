/* global window */

import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import { reduxEventsMiddleware } from '../lib/redux-events-middleware'
import { configServices } from '../services'
import { configListeners } from '../listeners'
import reducers from '../reducers'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
    thunk,
    routerMiddleware(history),
    reduxEventsMiddleware,
]

// redux dev tools (development & client only)
if (process.env.NODE_ENV === 'development' && !process.env.SSR) {
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

export const connectedHistory = syncHistoryWithStore(history, store)

export const isReady = new Promise(async (resolve, reject) => {
    try {
        await configListeners()
        await configServices(store, history)
        resolve()
    } catch (err) {
        reject()
    }
})

// redux dev tools (development & client only)
if (process.env.NODE_ENV === 'development' && !process.env.SSR) {
    window.store = store
}
