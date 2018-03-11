/*
    eslint
        import/prefer-default-export: off
*/

import { history } from 'boot/store'
import createHistoryRouter from 'lib/redux-history-router'
import { fetchPostById } from 'services/posts-service'

const applyRoutes = createHistoryRouter([
    {
        path: '/p/:postId',
        action: ({ postId }) => dispatch => dispatch(fetchPostById(postId)),
    },
])


export const init = () => (dispatch, getState) => {
    history.listen(match => applyRoutes(match)(dispatch, getState))
}

export const start = () => (dispatch, getState) =>
    applyRoutes(history.location)(dispatch, getState)
