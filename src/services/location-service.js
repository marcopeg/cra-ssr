/*
    eslint
        import/prefer-default-export: off
*/

import { history } from '../boot/store'
import createHistoryRouter from '../lib/redux-history-router'
// import { fetchProductById } from 'services/products-service'

const applyRoutes = createHistoryRouter([
    {
        path: '/p/:id',
        action: ({ id }) => () => {
            // dispatch(fetchProductById(productId))
            console.log('fetch product', id)
        },
    },
])


export const init = () => (dispatch, getState) => {
    history.listen(match => applyRoutes(match)(dispatch, getState))
}

export const start = () => (dispatch, getState) =>
    applyRoutes(history.location)(dispatch, getState)
