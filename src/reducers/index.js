/* eslint global-require: off */

import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

export default combineReducers({
    app: require('./app-reducer').default,
    postsList: require('./posts-list-reducer').default,
    post: require('./post-reducer').default,
    user: require('./user-reducer').default,
    routing,
})
