/* eslint global-require: off */
import { registerListener } from '../lib/redux-events-middleware'

const listeners = [
    // require('./location-listener'),
    // require('./app-listener'),
]

// eslint-disable-next-line
export const configListeners = () =>
    listeners
        .map(listener => listener.default)
        .map(registerListener)
