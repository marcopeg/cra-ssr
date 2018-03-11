/*
    eslint
        import/prefer-default-export: off
*/

import React from 'react'
import { renderToString } from 'react-dom/server'
import { ShallowRoot, StaticRoot } from './boot/Root.ssr'

import { createStore, createStaticStore } from './boot/store.ssr'

export const dataRender = url => new Promise((resolve) => {
    const { store, history } = createStore({})
    history.push(url)
    setTimeout(() => resolve(store.getState()), 1500)
    renderToString(<ShallowRoot store={store} history={history} />)
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
