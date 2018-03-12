/*
    eslint
        import/prefer-default-export: off
*/

import React from 'react'
import { renderToString } from 'react-dom/server'
import createHistory from 'history/createMemoryHistory'
import Root from './boot/Root'
import RootStatic from './boot/RootStatic'
import { registerListener } from './lib/redux-events-middleware'
import { createStore } from './boot/store'

const renderInitialState = (url, store, history, timeout) => new Promise((resolve) => {
    const timer = setTimeout(() => {
        console.error('TIMEOUT', url) // eslint-disable-line
        resolve()
    }, timeout)

    registerListener([{
        type: 'app::is::ready',
        handler: () => () => {
            clearTimeout(timer)
            resolve()
        },
    }])

    history.push(url)
    renderToString(<Root store={store} history={history} />)
})

export const staticRender = async (url, initialState = {}, timeout) => {
    const history = createHistory()
    const { store } = createStore(history, initialState)
    const context = {}

    await renderInitialState(url, store, history, timeout)
    const html = renderToString(<RootStatic store={store} url={url} context={context} />)

    return {
        html,
        context,
        initialState: store.getState(),
    }
}
