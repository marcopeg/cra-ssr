/* eslint global-require: off */

import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

export default combineReducers({
    post: require('./post-reducer').default,
    routing,
})
