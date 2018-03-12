/* global fetch */
import { pause } from './utils'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const pendingRequests = []
let checkTimer = null

const onRequestStart = (url) => {
    clearTimeout(checkTimer)
    pendingRequests.push(url)
}

const onRequestComplete = (url) => {
    clearTimeout(checkTimer)
    const index = pendingRequests.indexOf(url)
    if (index !== -1) {
        pendingRequests.splice(index, 1)
    }

    checkTimer = setTimeout(() => {
        if (pendingRequests.length === 0
            && onRequestComplete.dispatch
            && !onRequestComplete.fired
        ) {
            onRequestComplete.dispatch({ type: 'app::is::ready' })
            onRequestComplete.fired = true
        }
    }, 10)
}

// eslint-disable-next-line
const wrappedFetch = async (url, config = null) => {
    onRequestStart(url)
    try {
        if (process.env.NODE_ENV === 'development') {
            await pause(1)
        }
        const res = await fetch(url, config)
        onRequestComplete(url)
        return res
    } catch (err) {
        throw err
    }
}

export const getJSON = async (url, config = null) => {
    try {
        const res = await wrappedFetch(url, config)
        return await res.json()
    } catch (err) {
        throw err
    }
}

export const init = () => (dispatch) => {
    onRequestComplete.fired = false
    onRequestComplete.dispatch = dispatch
    onRequestComplete(null)
}

export default wrappedFetch
