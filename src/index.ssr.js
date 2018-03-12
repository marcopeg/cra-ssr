/*
    eslint
        import/prefer-default-export: off
*/

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRoot } from './boot/Root.ssr'
import { registerListener } from './lib/redux-events-middleware'
import { createStore, createStaticStore } from './boot/store.ssr'

export const dataRender = url => new Promise((resolve) => {
    const { store, history } = createStore({})
    const timer = setTimeout(() => {
        console.error('TIMEOUT', url) // eslint-disable-line
        resolve(store.getState())
    }, 3000)

    registerListener([{
        type: 'app::is::ready',
        handler: () => () => {
            clearTimeout(timer)
            resolve(store.getState())
        },
    }])

    history.push(url)
})

export const staticRender = async (url) => {
    const initialState = await dataRender(url)
    const { store } = createStaticStore(initialState)
    const html = renderToString(<StaticRoot store={store} url={url} context={{}} />)
    return {
        html,
        initialState,
    }
}
