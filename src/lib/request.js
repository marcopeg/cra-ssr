/* global fetch */
import { pause } from './utils'

require('es6-promise').polyfill()
require('isomorphic-fetch')

// eslint-disable-next-line
const wrappedFetch = (url, config = null) => {
    return fetch(url, config)
}

export const getJSON = async (url, config = null) => {
    try {
        await pause(500)
        const res = await wrappedFetch(url, config)
        return await res.json()
    } catch (err) {
        throw err
    }
}

export default wrappedFetch
