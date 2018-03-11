import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'

import App from '../containers/App'
import { store, history } from './store'

const Root = () => (
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
)

export default Root
