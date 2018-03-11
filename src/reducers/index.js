/* eslint global-require: off */

import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

// import app from './app-reducer'
// import clock from './clock-reducer'
// import products from './products-reducer'

export default combineReducers({
    // app,
    // clock,
    // products,
    routing,
})
