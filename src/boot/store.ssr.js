
import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

// import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'

import { reduxEventsMiddleware } from '../lib/redux-events-middleware'
import { configServices } from '../services'
import { configListeners } from '../listeners'
import reducers from '../reducers'
import { init as initRequest } from '../lib/request'

export const createStore = (initialState = {}) => {
    const history = createHistory()
    const enhancers = []
    const middleware = [
        thunk,
        // routerMiddleware(history),
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

    const isReady = new Promise(async (resolve, reject) => {
        try {
            await initRequest(store, history)(store.dispatch, store.getState)
            await configListeners()
            await configServices(store, history)
            resolve()
        } catch (err) {
            reject(err)
        }
    })

    return { store, history, isReady }
}

export const createStaticStore = (initialState = {}) => {
    const history = createHistory()
    const enhancers = []
    const middleware = []

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
