/*
    eslint
        import/prefer-default-export: off
*/

import React from 'react'
import { renderToString } from 'react-dom/server'
import { ShallowRoot, StaticRoot } from './boot/Root.ssr'

import { createStore, createStaticStore } from './boot/store.ssr'

export const dataRender = () => new Promise((resolve) => {
    const { store, history } = createStore()
    setTimeout(resolve(store.getState()), 1000)
    renderToString(<ShallowRoot store={store} history={history} />)
})

export const staticRender = async (url) => {
    const initialState = await dataRender()
    const { store } = createStaticStore(initialState)

    return {
        html: renderToString(<StaticRoot store={store} url={url} context={{}} />),
        initialState,
    }
}
