/* eslint global-require: off */

import { routerReducer as routing } from 'react-router-redux'

export default {
    app: require('./app-reducer').default,
    postsList: require('./posts-list-reducer').default,
    post: require('./post-reducer').default,
    user: require('./user-reducer').default,
    routing,
}
