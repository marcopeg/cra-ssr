
import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'

import { reduxEventsMiddleware } from '../lib/redux-events-middleware'
import { configServices } from '../services'
import { configListeners } from '../listeners'
import reducers from '../reducers'

export const createStore = (initialState = {}) => {
    const history = createHistory()
    const enhancers = []
    const middleware = [
        thunk,
        routerMiddleware(history),
        reduxEventsMiddleware,
    ]

    const composedEnhancers = compose(
        applyMiddleware(...middleware),
        ...enhancers,
    )

    const store = createReduxStore(
        reducers,
        initialState,
        composedEnhancers,
    )

    // const connectedHistory = syncHistoryWithStore(history, store)

    const isReady = new Promise(async (resolve, reject) => {
        try {
            await configListeners()
            await configServices(store)
            resolve()
        } catch (err) {
            console.log(err)
            reject()
        }
    })

    return { store, history, isReady }
}

export const createStaticStore = (initialState = {}) => {
    const history = createHistory()
    const enhancers = []
    const middleware = [
        thunk,
        routerMiddleware(history),
    ]

    const composedEnhancers = compose(
        applyMiddleware(...middleware),
        ...enhancers,
    )

    const store = createReduxStore(
        reducers,
        initialState,
        composedEnhancers,
    )

    return { store, history }
}
